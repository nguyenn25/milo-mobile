import React, { createContext, useContext, useState } from 'react';
import { RobotState, SafetySettings } from '../types/milo';

interface MiloContextType {
  userId: string;
  pin: string;
  isAuthenticated: boolean;
  robotState: RobotState;
  batteryPercent: number;
  safety: SafetySettings;
  login: (id: string, userPin: string) => boolean;
  logout: () => void;
  updateSafety: (partial: Partial<SafetySettings>) => void;
  sendAiCommand: (text: string) => void;
  selectWaypoint: (room: string) => void;
  sendDriveVector: (x: number, y: number, speedPercent: number) => void;
  triggerSafetyStop: () => void;
  setRobotState: (state: RobotState) => void;
}

const MiloContext = createContext<MiloContextType | undefined>(undefined);

export const MiloProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState('');
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [robotState, setRobotState] = useState<RobotState>('Standby');
  const [batteryPercent] = useState(85);

  const [safety, setSafety] = useState<SafetySettings>({
    requirePinForManualDrive: true,
    maxDriveSpeed: 25,
    autoPauseOnSignalLoss: true,
  });

  const login = (id: string, userPin: string) => {
    if (!id.trim() || !userPin.trim()) return false;
    setUserId(id.trim());
    setPin(userPin.trim());
    setIsAuthenticated(true);
    setRobotState('Standby');
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserId('');
    setPin('');
  };

  const updateSafety = (partial: Partial<SafetySettings>) => {
    setSafety((prev) => ({ ...prev, ...partial }));
  };

  const sendAiCommand = (text: string) => {
    console.log('[WS -> AI Node] Command:', { type: 'ai_command', payload: text });
    setRobotState('Navigating');
  };

  const selectWaypoint = (room: string) => {
    console.log('[WS -> ROS 2] Waypoint:', { type: 'nav_waypoint', room });
    setRobotState('Navigating');
  };

  const sendDriveVector = (x: number, y: number, speedPercent: number) => {
    console.log('[WS -> ROS 2] Twist:', {
      type: 'cmd_vel',
      linear_x: Number((y * (speedPercent / 100)).toFixed(2)),
      angular_z: Number((-x * (speedPercent / 100)).toFixed(2)),
    });
  };

  const triggerSafetyStop = () => {
    console.warn('[WS -> ROS 2] IMMEDIATE SAFETY STOP');
    setRobotState('Safety Stopped');
  };

  return (
    <MiloContext.Provider
      value={{
        userId,
        pin,
        isAuthenticated,
        robotState,
        batteryPercent,
        safety,
        login,
        logout,
        updateSafety,
        sendAiCommand,
        selectWaypoint,
        sendDriveVector,
        triggerSafetyStop,
        setRobotState,
      }}
    >
      {children}
    </MiloContext.Provider>
  );
};

export const useMilo = () => {
  const ctx = useContext(MiloContext);
  if (!ctx) throw new Error('useMilo must be used inside MiloProvider');
  return ctx;
};
