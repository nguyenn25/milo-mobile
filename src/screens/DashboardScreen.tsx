import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/milo';
import { useMilo } from '../context/MiloContext';
import { LiveCameraCard } from '../components/LiveCameraCard';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

const ROOMS = ['Living Room', 'Kitchen', 'Bedroom', 'Charging Dock'];

export const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const {
    robotState,
    batteryPercent,
    safety,
    pin,
    sendAiCommand,
    selectWaypoint,
    setRobotState,
  } = useMilo();

  const [command, setCommand] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [verifyPin, setVerifyPin] = useState('');

  const handleAiSubmit = () => {
    if (!command.trim()) return;
    sendAiCommand(command.trim());
    setCommand('');
  };

  const handleMicToggle = () => {
    setIsListening((prev) => !prev);
  };

  const handleOpenManualDrive = () => {
    if (safety.requirePinForManualDrive) {
      setVerifyPin('');
      setPinModalOpen(true);
    } else {
      setRobotState('Manual Drive');
      navigation.navigate('ManualDrive');
    }
  };

  const handleConfirmPin = () => {
    if (verifyPin === pin) {
      setPinModalOpen(false);
      setRobotState('Manual Drive');
      navigation.navigate('ManualDrive');
    } else {
      Alert.alert('Invalid PIN', 'Enter your session PIN to unlock Manual Drive.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.topBar}>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{robotState}</Text>
          </View>

          <View style={styles.topRight}>
            <View style={styles.batteryRow}>
              <Ionicons name="battery-charging-outline" size={20} color="#1E1E1E" />
              <Text style={styles.batteryText}>{batteryPercent}%</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')} hitSlop={10}>
              <Ionicons name="settings-outline" size={22} color="#1E1E1E" />
            </TouchableOpacity>
          </View>
        </View>

        <LiveCameraCard height={210} />

        <View>
          <Text style={styles.label}>AI Command</Text>
          <View style={[styles.commandBox, isListening && styles.commandBoxActive]}>
            <TextInput
              style={styles.commandInput}
              placeholder={isListening ? 'Listening...' : 'What would you like MILO to do?'}
              placeholderTextColor="#8E8E8E"
              value={command}
              onChangeText={setCommand}
              onSubmitEditing={handleAiSubmit}
              returnKeyType="send"
            />
            <TouchableOpacity onPress={handleMicToggle} hitSlop={10}>
              <Ionicons
                name={isListening ? 'mic' : 'mic-outline'}
                size={21}
                color={isListening ? '#C62828' : '#1E1E1E'}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setRoomModalOpen(true)}
          activeOpacity={0.7}
        >
          <Text style={[styles.dropdownText, !selectedRoom && styles.placeholderText]}>
            {selectedRoom ?? 'Select Room / Waypoint'}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#666666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.manualButton} onPress={handleOpenManualDrive}>
          <Text style={styles.manualButtonText}>Manual Drive</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={roomModalOpen} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setRoomModalOpen(false)}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select Room / Waypoint</Text>
            {ROOMS.map((room) => (
              <TouchableOpacity
                key={room}
                style={styles.roomOption}
                onPress={() => {
                  setSelectedRoom(room);
                  selectWaypoint(room);
                  setRoomModalOpen(false);
                }}
              >
                <Text style={styles.roomOptionText}>{room}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={pinModalOpen} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Manual Drive Safety Lock</Text>
            <Text style={styles.modalSubtitle}>Enter your PIN to unlock manual controls.</Text>
            <TextInput
              style={styles.pinInput}
              placeholder="PIN"
              secureTextEntry
              keyboardType="number-pad"
              value={verifyPin}
              onChangeText={setVerifyPin}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setPinModalOpen(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirm} onPress={handleConfirmPin}>
                <Text style={styles.modalConfirmText}>Unlock</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#7A7A7A' },
  statusText: { fontSize: 13, fontWeight: '500', color: '#1E1E1E' },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  batteryRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  batteryText: { fontSize: 14, fontWeight: '500', color: '#1E1E1E' },
  label: { fontSize: 13, fontWeight: '600', color: '#1E1E1E', marginBottom: 8 },
  commandBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
  },
  commandBoxActive: { borderColor: '#1E1E1E', borderWidth: 1.5 },
  commandInput: { flex: 1, fontSize: 14, color: '#1E1E1E', marginRight: 8 },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
  },
  dropdownText: { fontSize: 14, color: '#1E1E1E' },
  placeholderText: { color: '#555555' },
  manualButton: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  manualButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20 },
  modalTitle: { fontSize: 17, fontWeight: '700', color: '#1E1E1E', marginBottom: 8 },
  modalSubtitle: { fontSize: 13, color: '#666666', marginBottom: 14 },
  roomOption: { paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  roomOptionText: { fontSize: 15, color: '#1E1E1E' },
  pinInput: {
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  modalCancel: { paddingVertical: 10, paddingHorizontal: 16 },
  modalCancelText: { color: '#666666', fontWeight: '600' },
  modalConfirm: {
    backgroundColor: '#1E1E1E',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  modalConfirmText: { color: '#FFFFFF', fontWeight: '600' },
});
