import { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

const HOLD_MS = 3000;

type Props = {
  onAction: () => void;
  size: number;
  bgColor: string;
  fillColor: string;
  accessibilityLabel: string;
  children: React.ReactNode;
};

/**
 * A hold-to-confirm button. The user must press and hold for HOLD_MS ms
 * before the action fires. Releasing early cancels and resets the fill.
 *
 * Visual: a "water rising" fill that climbs from bottom to top while held.
 */
export const HoldButton = ({
  onAction,
  size,
  bgColor,
  fillColor,
  accessibilityLabel,
  children,
}: Props) => {
  const progress = useRef(new Animated.Value(0)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);
  const firedRef = useRef(false);

  const fillHeight = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, size],
  });

  const reset = useCallback(() => {
    animRef.current?.stop();
    animRef.current = Animated.timing(progress, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    });
    animRef.current.start();
  }, [progress]);

  const handlePressIn = useCallback(() => {
    firedRef.current = false;
    animRef.current?.stop();
    animRef.current = Animated.timing(progress, {
      toValue: 1,
      duration: HOLD_MS,
      useNativeDriver: false,
    });
    animRef.current.start(({ finished }) => {
      if (finished && !firedRef.current) {
        firedRef.current = true;
        onAction();
        reset();
      }
    });
  }, [onAction, progress, reset]);

  const handlePressOut = useCallback(() => {
    if (!firedRef.current) reset();
  }, [reset]);

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <View
        style={[
          styles.btn,
          { width: size, height: size, borderRadius: size / 2, backgroundColor: bgColor },
        ]}
      >
        <Animated.View
          style={[
            styles.fill,
            { height: fillHeight, backgroundColor: fillColor, borderRadius: size / 2 },
          ]}
        />
        <View style={styles.icon}>{children}</View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btn: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  icon: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
