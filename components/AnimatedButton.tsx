import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { AnimatedFAB, type AnimatedFABAnimateFrom } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AnimatedButtonProps = {
  label?: string;
  icon?: string;
  onPress?: () => void;
  visible?: boolean;
  animateFrom?: AnimatedFABAnimateFrom;
};

const AnimatedButton = ({
  label = 'Add contact',
  icon = 'plus',
  onPress,
  visible = true,
  animateFrom = 'right',
}: AnimatedButtonProps) => {
  const insets = useSafeAreaInsets();
  const [extended, setExtended] = useState(false);

  const handlePress = () => {
    setExtended((prev) => !prev);
    onPress?.();
  };

  return (
    <AnimatedFAB
      icon={icon}
      label={label}
      extended={extended}
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
