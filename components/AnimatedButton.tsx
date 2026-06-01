import React from 'react';
import { StyleSheet } from 'react-native';
import { AnimatedFAB, type AnimatedFABAnimateFrom } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AnimatedButtonProps = {
  label?: string;
  icon?: string;
  onPress?: () => void;
  visible?: boolean;
  animateFrom?: AnimatedFABAnimateFrom;
  initialExtended: boolean;
};

const AnimatedButton = ({
  label = 'Add contact',
  icon = 'plus',
  onPress,
  visible = true,
  animateFrom = 'right',
  initialExtended,
}: AnimatedButtonProps) => {
  const insets = useSafeAreaInsets();

  const handlePress = () => {
    onPress?.();
  };

  return (
    <AnimatedFAB
      icon={icon}
      label={label}
      extended={initialExtended}
      visible={visible}
      animateFrom={animateFrom}
      iconMode="static"
      onPress={handlePress}
      style={[
        styles.fab,
        { bottom: insets.bottom + 16, [animateFrom]: 16 },
      ]}
    />
  );
};

export default AnimatedButton;

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
  },
});
