import React from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { RootStackParamList } from '../types/milo';
import { useMilo } from '../context/MiloContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { safety, updateSafety, logout } = useMilo();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View>
          <TouchableOpacity style={styles.backRow} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={20} color="#1E1E1E" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <Text style={styles.heading}>Settings</Text>

          <Text style={styles.sectionTitle}>Connection & Security</Text>
          <View style={styles.card}>
            <View style={[styles.row, styles.rowBorder]}>
              <Text style={styles.rowText}>MILO Status: Connected</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowText}>Privacy: End-to-End Encrypted</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Safety Preferences</Text>
          <View style={styles.card}>
            <View style={[styles.row, styles.rowBorder, styles.rowBetween]}>
              <Text style={styles.rowText}>Require PIN for Manual Drive</Text>
              <Switch
                value={safety.requirePinForManualDrive}
                onValueChange={(val) => updateSafety({ requirePinForManualDrive: val })}
                trackColor={{ false: '#DCDCDC', true: '#1E1E1E' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={[styles.sliderBlock, styles.rowBorder]}>
              <View style={styles.rowBetween}>
                <Text style={styles.rowText}>Manual drive speed</Text>
                <Text style={styles.percentText}>{safety.maxDriveSpeed}%</Text>
              </View>
              <Slider
                style={{ width: '100%', height: 36 }}
                minimumValue={10}
                maximumValue={100}
                step={5}
                value={safety.maxDriveSpeed}
                onValueChange={(val) => updateSafety({ maxDriveSpeed: val })}
                minimumTrackTintColor="#1E1E1E"
                maximumTrackTintColor="#DCDCDC"
                thumbTintColor="#1E1E1E"
              />
            </View>

            <View style={[styles.row, styles.rowBetween]}>
              <Text style={styles.rowText}>Auto-Pause on signal loss</Text>
              <Switch
                value={safety.autoPauseOnSignalLoss}
                onValueChange={(val) => updateSafety({ autoPauseOnSignalLoss: val })}
                trackColor={{ false: '#DCDCDC', true: '#1E1E1E' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 14 },
  backText: { fontSize: 15, fontWeight: '500', color: '#1E1E1E' },
  heading: { fontSize: 28, fontWeight: '700', color: '#1E1E1E', marginBottom: 22 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E1E1E',
    marginBottom: 8,
    marginTop: 14,
  },
  card: {
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },
  row: { paddingHorizontal: 16, paddingVertical: 15 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: '#EAEAEA' },
  rowText: { fontSize: 14, color: '#1E1E1E' },
  sliderBlock: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 },
  percentText: { fontSize: 14, color: '#666666' },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  logoutText: { fontSize: 15, fontWeight: '600', color: '#1E1E1E' },
});
