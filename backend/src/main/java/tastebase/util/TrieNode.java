package tastebase.util;

import org.springframework.web.server.ServerWebInputException;

public class TrieNode {
    TrieNode[] children;
    boolean endOfWord;
    int frequency;
    char c;

    public TrieNode(char c) {
        this.c = c;
        children = new TrieNode[28];
        endOfWord = false;
        frequency = 0;
    }

    public TrieNode() {
        children = new TrieNode[28];
        endOfWord = false;
        frequency = 0;
    }

    public TrieNode child(char c) {
        c = Character.toLowerCase(c);
        if (Character.isLetter(c)) {
            return children[c - 'a'];
        }
        switch (c) {
            case ' ':
                return children[26];
            case '-':
                return children[27];
        }
        return null;
    }

    public void addChild(TrieNode node) {
        if (Character.isLetter(node.c)) {
            children[node.c - 'a'] = node;
        }
        switch (node.c) {
            case ' ':
                children[26] = node;
            case '-':
                children[27] = node;
        }
    }
}
