import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type IconButtonProps = {
  iconName?: string;
  iconColor?: string;
  iconSize?: number;
  style?: Object;
};

const IconButton: React.FC<IconButtonProps> = ({
  iconName,
  iconColor = '#2C8C7E',
  iconSize = 16,
  style,
}) => {
  return (
    <Icon
      name={iconName || ''}
      size={iconSize}
      color={iconColor}
      style={style}
    />
  );
};

export default IconButton;
