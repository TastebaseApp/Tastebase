package tastebase.util;

public class TrieNode {
    TrieNode[] children;
    boolean endOfWord;
    int frequency;
    char c;

    public TrieNode(char c) {
        this.c = c;
        children = new TrieNode[26];
        endOfWord = false;
        frequency = 0;
    }

    public TrieNode() {
        children = new TrieNode[26];
        endOfWord = false;
        frequency = 0;
    }
}
