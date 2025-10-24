package tastebase.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.*;

public class Trie {
    private final TrieNode root;
    private int size;

    public Trie() {
        root = new TrieNode();
        size = 0;
    }

    public void insert(String word) {
        TrieNode node = root;
        word = word.toLowerCase();
        word = word.replaceAll("-", " ");

        if (!isValidWord(word)) return;
        for (int i = 0; i < word.length(); i++) {
            char c = word.charAt(i);
            if (node.child(c) == null) {
                node.addChild(new TrieNode(c));
            }
            node = node.child(c);
        }
        if (!node.endOfWord) size++;
        node.endOfWord = true;
        node.frequency++;
    }

    public boolean isValidWord(String word) {
        for (char c : word.toCharArray()) {
            if (!Character.isLetter(c) && !List.of(' ', '_', '-').contains(c)) return false;
        }
        return true;
    }

    public boolean search(String word) {
        TrieNode node = root;
        for (int i = 0; i < word.length(); i++) {
            char c = word.charAt(i);
            if (node.child(c) == null) {
                return false;
            }

            node = node.child(c);
        }
        return node != null && node.endOfWord;
    }

    public boolean startsWith(String prefix) {
        TrieNode node = root;
        for (int i = 0; i < prefix.length(); i++) {
            char c = prefix.charAt(i);
            if (node.child(c) == null) {
                return false;
            }
            node = node.child(c);
        }
        return true;
    }

    public void suggestHelper(TrieNode root, Set<String> out, StringBuffer curr, int count) {
        if (out.size() == count) return;

        if (root.endOfWord)  {
            out.add(curr.toString());
        }

        if (root.children.length == 0) return;

        for (TrieNode child : Arrays.stream(root.children).filter(Objects::nonNull).toArray(TrieNode[]::new)) {
            suggestHelper(child, out, curr.append(child.c), count);
            curr.setLength(curr.length() - 1);
        }
    }

    public Set<String> suggest(String prefix, int count) {
        Set<String> out = new HashSet<>();
        TrieNode node = root;
        StringBuffer curr = new StringBuffer();

        for (char c : prefix.toCharArray()) {
            node = node.child(c);
            if (node == null) return out;
            curr.append(c);
        }
        suggestHelper(node, out, curr, count);
        return out;
    }

    public int getSize() {
        return size;
    }
}
