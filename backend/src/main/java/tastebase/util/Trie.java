package tastebase.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.*;

public class Trie {
    private final TrieNode root;

    public Trie() {
        root = new TrieNode();
    }

    public void insert(String word) {
        TrieNode node = root;
        word = word.toLowerCase();
        if (!isValidWord(word)) return;
        for (int i = 0; i < word.length(); i++) {
            char c = word.charAt(i);
            if (node.children[c - 'a'] == null) {
                node.children[c - 'a'] = new TrieNode(c);
            }
            node = node.children[c - 'a'];
        }
        node.endOfWord = true;
        node.frequency++;
    }

    public boolean isValidWord(String word) {
        for (char c : word.toCharArray()) {
            if (!Character.isLetter(c)) return false;
        }
        return true;
    }

    public boolean search(String word) {
        TrieNode node = root;
        for (int i = 0; i < word.length(); i++) {
            char c = word.charAt(i);
            if (node.children[c - 'a'] == null) {
                return false;
            }

            node = node.children[c - 'a'];
        }
        return node != null && node.endOfWord;
    }

    public boolean startsWith(String prefix) {
        TrieNode node = root;
        for (int i = 0; i < prefix.length(); i++) {
            char c = prefix.charAt(i);
            if (node.children[c - 'a'] == null) {
                return false;
            }
            node = node.children[c - 'a'];
        }
        return true;
    }

    public void suggestHelper(TrieNode root, List<String> list, StringBuffer curr, int count) {
        if (list.size() == count) return;

        if (root.endOfWord)  {
            list.add(curr.toString());
        }

        if (root.children.length == 0) return;

        for (TrieNode child : Arrays.stream(root.children).filter(Objects::nonNull).toArray(TrieNode[]::new)) {
            suggestHelper(child, list, curr.append(child.c), count);
            curr.setLength(curr.length() - 1);
        }
    }

    public List<String> suggest(String prefix, int count) {
        List<String> list = new ArrayList<String>();
        TrieNode node = root;
        StringBuffer curr = new StringBuffer();

        for (char c : prefix.toCharArray()) {
            node = node.children[c - 'a'];
            if (node == null) return list;
            curr.append(c);
        }
        suggestHelper(node, list, curr, count);
        return list;
    }
}
