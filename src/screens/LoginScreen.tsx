import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMilo } from '../context/MiloContext';

export const LoginScreen: React.FC = () => {
  const { login } = useMilo();
  const [userId, setUserId] = useState('');
  const [pin, setPin] = useState('');

  const handleConnect = () => {
    if (!login(userId, pin)) {
      Alert.alert('Missing Credentials', 'Please enter both your local User ID and PIN.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.heading}>Welcome to MILO</Text>
        <Text style={styles.subheading}>Connect to your home assistant.</Text>

        <Text style={styles.label}>User ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your user ID"
          placeholderTextColor="#8E8E8E"
          autoCapitalize="none"
          value={userId}
          onChangeText={setUserId}
        />

        <Text style={styles.label}>PIN</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your PIN"
          placeholderTextColor="#8E8E8E"
          secureTextEntry
          keyboardType="number-pad"
          value={pin}
          onChangeText={setPin}
        />

        <TouchableOpacity style={styles.primaryButton} onPress={handleConnect}>
          <Text style={styles.primaryButtonText}>Connect</Text>
        </TouchableOpacity>

        <View style={styles.securityFooter}>
          <Ionicons name="lock-closed-outline" size={14} color="#7A7A7A" />
          <Text style={styles.securityText}>Secure Local Connection</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 28 },
  heading: { fontSize: 28, fontWeight: '700', color: '#1E1E1E', marginBottom: 6 },
  subheading: { fontSize: 15, color: '#7A7A7A', marginBottom: 28 },
  label: { fontSize: 13, fontWeight: '600', color: '#1E1E1E', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1E1E1E',
    marginBottom: 18,
  },
  primaryButton: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 6,
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  securityFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 18,
  },
  securityText: { fontSize: 12, color: '#7A7A7A' },
});
