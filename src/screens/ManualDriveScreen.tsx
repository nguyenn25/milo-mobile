import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { RootStackParamList } from '../types/milo';
import { useMilo } from '../context/MiloContext';
import { LiveCameraCard } from '../components/LiveCameraCard';
import { VirtualJoystick } from '../components/VirtualJoystick';

type Props = NativeStackScreenProps<RootStackParamList, 'ManualDrive'>;

export const ManualDriveScreen: React.FC<Props> = ({ navigation }) => {
  const { safety, sendDriveVector, triggerSafetyStop, setRobotState } = useMilo();
  const [speed, setSpeed] = useState<number>(safety.maxDriveSpeed);

  const handleEndDrive = () => {
    sendDriveVector(0, 0, 0);
    setRobotState('Standby');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.backRow} onPress={handleEndDrive}>
          <Ionicons name="chevron-back" size={20} color="#1E1E1E" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.banner}>
          <Text style={styles.bannerText}>Manual Drive Active — Please drive safely</Text>
        </View>

        <LiveCameraCard height={165} />

        <View style={styles.controlsRow}>
          <View style={styles.controlCol}>
            <Text style={styles.controlLabel}>Steer</Text>
            <VirtualJoystick
              onMove={(x, y) => sendDriveVector(x, y, speed)}
              onRelease={() => sendDriveVector(0, 0, 0)}
            />
          </View>

          <View style={styles.controlCol}>
            <Text style={styles.controlLabel}>Speed</Text>
            <View style={styles.verticalSliderWrap}>
              <Slider
                style={styles.verticalSlider}
                minimumValue={5}
                maximumValue={100}
                step={5}
                value={speed}
                onValueChange={setSpeed}
                minimumTrackTintColor="#1E1E1E"
                maximumTrackTintColor="#DCDCDC"
                thumbTintColor="#1E1E1E"
              />
            </View>
            <Text style={styles.speedValue}>{speed}%</Text>
          </View>
        </View>

        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.safetyStopButton}
            onPress={() => {
              sendDriveVector(0, 0, 0);
              triggerSafetyStop();
            }}
          >
            <Text style={styles.safetyStopText}>Safety Stop</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.endDriveButton} onPress={handleEndDrive}>
            <Text style={styles.endDriveText}>End Manual Drive</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backText: { fontSize: 15, fontWeight: '500', color: '#1E1E1E' },
  banner: {
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 14,
  },
  bannerText: { fontSize: 13, fontWeight: '500', color: '#1E1E1E' },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
  },
  controlCol: { alignItems: 'center', gap: 10 },
  controlLabel: { fontSize: 14, fontWeight: '600', color: '#1E1E1E' },
  verticalSliderWrap: {
    height: 140,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalSlider: {
    width: 140,
    height: 40,
    transform: [{ rotate: '-90deg' }],
  },
  speedValue: { fontSize: 13, color: '#666666', fontWeight: '500' },
  bottomActions: { gap: 10 },
  safetyStopButton: {
    backgroundColor: '#C62828',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  safetyStopText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  endDriveButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  endDriveText: { color: '#1E1E1E', fontSize: 15, fontWeight: '600' },
});
