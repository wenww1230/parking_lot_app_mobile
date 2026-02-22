import React from 'react';
import {TouchableOpacity, Text, View} from 'react-native';
import {menuCardStyles} from './MenuCard.styles';

interface MenuCardProps {
  title: string;
  subtitle?: string;
  onPress: () => void;
}

export function MenuCard({title, subtitle, onPress}: MenuCardProps) {
  return (
    <TouchableOpacity style={menuCardStyles.card} onPress={onPress} activeOpacity={0.7}>
      <Text style={menuCardStyles.title}>{title}</Text>
      {subtitle ? <Text style={menuCardStyles.subtitle}>{subtitle}</Text> : null}
    </TouchableOpacity>
  );
}
