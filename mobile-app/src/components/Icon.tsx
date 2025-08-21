import React from 'react';
import { Text } from 'react-native';

export const Icon = ({ name, size, color, focused }: { name: string; size: number; color: string; focused?: boolean }) => {
  return <Text style={{ fontSize: size, color }} accessibilityLabel={name}>⬤</Text>;
};

export default Icon;