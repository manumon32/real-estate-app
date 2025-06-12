import useBoundStore from '@stores/index';
import React, {useMemo} from 'react';
import {TouchableOpacity} from 'react-native';
import IconButton from './Buttons/IconButton';

interface Props {
  item: {id: string; [key: string]: any};
  iconSize?: number;
  IconButtonStyle?: any;
  tuchableStyle?: any;
}

const FavoriteButton = ({
  item,
  iconSize = 18,
  IconButtonStyle,
  tuchableStyle,
}: Props) => {
  const toggleFavorite = useBoundStore(s => s.toggleFavorite);
  const isFavorite = useBoundStore(s => s.isFavorite(item._id));
  const {bearerToken, setVisible} = useBoundStore();

  const iconName = useMemo(
    () => (isFavorite ? 'heart' : 'heart-outline'),
    [isFavorite],
  );
  const iconColor = useMemo(() => (isFavorite ? 'red' : 'gray'), [isFavorite]);

  return (
    <TouchableOpacity
      style={tuchableStyle}
      onPress={() => {
        if (bearerToken) {
          toggleFavorite(item);
        } else {
          setVisible();
        }
      }}>
      <IconButton
        style={[
          {backgroundColor: '#fff', borderRadius: 20, padding: 5},
          IconButtonStyle && IconButtonStyle,
        ]}
        iconSize={iconSize}
        //red , heart
        iconColor={iconColor}
        iconName={iconName}
      />
    </TouchableOpacity>
  );
};

export default React.memo(FavoriteButton);
