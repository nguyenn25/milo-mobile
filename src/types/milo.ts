export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  ManualDrive: undefined;
  Settings: undefined;
};

export type RobotState = 'Standby' | 'Navigating' | 'Manual Drive' | 'Safety Stopped';

export interface SafetySettings {
  requirePinForManualDrive: boolean;
  maxDriveSpeed: number;
  autoPauseOnSignalLoss: boolean;
}

export interface TelemetryPacket {
  state: RobotState;
  batteryPercent: number;
  connected: boolean;
  encrypted: boolean;
}
