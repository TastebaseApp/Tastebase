import React, { useState, useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import { ColorSchemeWidget } from './ColorSchemeWidget';

const ICON_SIZE = 40; // Fixed icon size to match ProfileIcon default

type Props = {
  visible: boolean;
  onClose: () => void;
  iconColor: string;
};

export function ProfileCard({
  visible,
  onClose,
  iconColor,
}: Props) {
  const bg = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const buttonBg = useThemeColor({}, 'text');
  const buttonText = useThemeColor({}, 'background');
  const { token, getUserEmail, logout, login } = useAuth();
  
  const [email, setEmail] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>("You are not logged in");

  // Fetch email when card opens and user is logged in
  useEffect(() => {
    if (visible && token && !email) {
      getUserEmail().then((userEmail) => {
        setEmail(userEmail);
        setMessage(userEmail);
      });
    }
  }, [visible, token, email, getUserEmail]);

  // Reset email when logged out
  useEffect(() => {
    if (!token) {
      setEmail(null);
    }
  }, [token]);

  const handleLogout = async () => {
    if (!token) {
      return;
    }
    await logout();
    setEmail(null);
    setMessage("You are no longer logged in");
  };

  const handleLogin = () => {
    setMessage("Loading...");
    login();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
          style={[styles.card, { backgroundColor: bg }]}
        >

          {/* Profile Icon */}
          <TouchableOpacity
            onPress={onClose}
            style={styles.iconContainer}
            hitSlop={8}
          >
            <Ionicons name="person-circle" size={ICON_SIZE} color={iconColor} />
          </TouchableOpacity>

          {/* Email or "Not logged in" message */}
          <ThemedView style={styles.contentContainer}>
            <ThemedText style={[styles.notLoggedInText, { color: text }]}>{message}</ThemedText>

            {/* Logout or Login button */}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: buttonBg }]}
              onPress={token ? handleLogout : handleLogin}
            >
              <ThemedText style={[styles.buttonText, { color: buttonText }]}>
                {token ? 'Logout' : 'Log In'}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
          <ThemedView style={styles.colorSchemeContainer}>
            <ColorSchemeWidget />
          </ThemedView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  card: {
    position: 'absolute',
    top: 30, // Match ProfileIcon top position
    right: 20, // Match ProfileIcon right position
    borderRadius: 16,
    padding: 24,
    paddingTop: 44, // Space for icon overlap (20px for half icon + 24px padding)
    width: 280,
    alignItems: 'flex-start',
  },
  iconContainer: {
    position: 'absolute',
    top: 10, // Half of ICON_SIZE to center icon on card's top-right corner
    right: 16, // Half of ICON_SIZE to center icon on card's top-right corner
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
    marginTop: 8, // Space after icon
  },
  emailText: {
    fontSize: 16,
    textAlign: 'left',
    fontWeight: '500',
  },
  notLoggedInText: {
    fontSize: 16,
    textAlign: 'left',
    fontWeight: '500',
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  colorSchemeContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
    marginTop: 16, // Space after icon
  },
});

