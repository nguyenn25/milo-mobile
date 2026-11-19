import React, { useRef, useState } from 'react';
import { View, PanResponder, StyleSheet, Animated } from 'react-native';

interface Props {
  size?: number;
  onMove: (x: number, y: number) => void;
  onRelease: () => void;
}

export const VirtualJoystick: React.FC<Props> = ({ size = 148, onMove, onRelease }) => {
  const knobSize = 46;
  const maxRadius = (size - knobSize) / 2;
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [, setActive] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => setActive(true),
      onPanResponderMove: (_, gesture) => {
        let dx = gesture.dx;
        let dy = gesture.dy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > maxRadius) {
          dx = (dx / dist) * maxRadius;
          dy = (dy / dist) * maxRadius;
        }
        pan.setValue({ x: dx, y: dy });
        onMove(dx / maxRadius, -dy / maxRadius);
      },
      onPanResponderRelease: () => {
        setActive(false);
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
        onRelease();
      },
    })
  ).current;

  return (
    <View style={[styles.outerRing, { width: size, height: size, borderRadius: size / 2 }]}>
      <View
        style={[
          styles.innerRing,
          { width: size * 0.66, height: size * 0.66, borderRadius: (size * 0.66) / 2 },
        ]}
      />
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.knob,
          {
            width: knobSize,
            height: knobSize,
            borderRadius: knobSize / 2,
            transform: pan.getTranslateTransform(),
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  outerRing: {
    backgroundColor: '#F3F3F3',
    borderWidth: 1,
    borderColor: '#DCDCDC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerRing: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#E2E2E2',
  },
  knob: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#666666',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});
