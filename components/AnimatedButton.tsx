import { buttonStyles, typography } from '@/assets/styles/theme';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Icon } from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AnimatedButtonProps = {
  label?: string;
  icon?: string;
  onPress?: () => void;
  visible?: boolean;
  initialExtended: boolean;
};

const AnimatedButton = ({
  label = 'Add contact',
  icon = 'plus',
  onPress,
  visible = true,
  initialExtended,
}: AnimatedButtonProps) => {
  const insets = useSafeAreaInsets();

  const containerStyle = useAnimatedStyle(() => ({
    width: withTiming(initialExtended ? 170 : 56, {
      duration: 250,
    }),
  }));

  const labelStyle = useAnimatedStyle(() => ({
    width: withTiming(initialExtended ? 100 : 0, {
      duration: 250,
    }),
  }));

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        { bottom: insets.bottom + 16 },
        containerStyle,
      ]}
    >
      <Pressable style={buttonStyles.animatedButton} onPress={onPress}>
        <Icon source={icon} size={24} color="#FFFFFF"/>

        <Animated.View style={[styles.labelContainer, labelStyle]}>
          <Text numberOfLines={1} style={typography.labelLarge}>
            {label}
          </Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

export default AnimatedButton;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    height: 56,
  },
  labelContainer: {
    overflow: 'hidden',
    marginLeft: 12,
  },
});