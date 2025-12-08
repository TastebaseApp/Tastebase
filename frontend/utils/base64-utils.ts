import { Platform } from 'react-native';

/**
 * Converts a Uint8Array to a base64 string (cross-platform)
 * Uses btoa on web for better performance, manual conversion on React Native
 * @param bytes - The Uint8Array to convert
 * @returns The base64 encoded string
 */
export function uint8ArrayToBase64(bytes: Uint8Array): string {
  if (Platform.OS === 'web' && typeof btoa !== 'undefined') {
    // Use btoa on web
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  } else {
    // For React Native, use a simple base64 conversion
    // This is a basic implementation that works cross-platform
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    let i = 0;
    while (i < bytes.length) {
      const a = bytes[i++];
      const b = i < bytes.length ? bytes[i++] : 0;
      const c = i < bytes.length ? bytes[i++] : 0;
      
      const bitmap = (a << 16) | (b << 8) | c;
      
      result += chars.charAt((bitmap >> 18) & 63);
      result += chars.charAt((bitmap >> 12) & 63);
      result += i - 2 < bytes.length ? chars.charAt((bitmap >> 6) & 63) : '=';
      result += i - 1 < bytes.length ? chars.charAt(bitmap & 63) : '=';
    }
    return result;
  }
}

