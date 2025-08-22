import React from 'react';
import Icon from 'react-native-vector-icons/Feather';

interface IconProps {
  name: string;
  size: number;
  color: string;
  focused?: boolean;
}

export const IconComponent: React.FC<IconProps> = ({ 
  name, 
  size, 
  color, 
  focused = false 
}) => {
  // Mapeo de nombres de iconos a Feather icons
  const iconMap: { [key: string]: string } = {
    'home': 'home',
    'users': 'users',
    'car': 'truck',
    'credit-card': 'credit-card',
    'receipt': 'file-text',
    'bar-chart-3': 'bar-chart-3',
    'file-text': 'file-text',
    'user': 'user',
    'settings': 'settings',
    'plus': 'plus',
    'search': 'search',
    'edit': 'edit',
    'trash': 'trash-2',
    'eye': 'eye',
    'filter': 'filter',
    'download': 'download',
    'upload': 'upload',
    'alert-triangle': 'alert-triangle',
    'check-circle': 'check-circle',
    'x-circle': 'x-circle',
    'phone': 'phone',
    'mail': 'mail',
    'id-card': 'credit-card',
    'calendar': 'calendar',
    'map-pin': 'map-pin',
    'shield': 'shield',
    'wrench': 'tool',
    'fuel': 'zap',
    'gauge': 'activity',
    'trending-up': 'trending-up',
    'trending-down': 'trending-down',
    'refresh-cw': 'refresh-cw',
    'clock': 'clock',
    'activity': 'activity',
    'dollar-sign': 'dollar-sign',
    'arrow-left': 'arrow-left',
    'arrow-right': 'arrow-right',
    'save': 'save',
    'x': 'x',
    'chevron-right': 'chevron-right',
    'chevron-down': 'chevron-down',
    'star': 'star',
    'heart': 'heart',
    'share': 'share',
    'more-horizontal': 'more-horizontal',
    'bell': 'bell',
    'menu': 'menu',
    'log-out': 'log-out',
  };

  const iconName = iconMap[name] || 'circle';
  
  return (
    <Icon 
      name={iconName} 
      size={size} 
      color={color} 
      style={{ 
        opacity: focused ? 1 : 0.7,
        transform: [{ scale: focused ? 1.1 : 1 }]
      }}
    />
  );
};

export default IconComponent;