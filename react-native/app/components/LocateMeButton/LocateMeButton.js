import React, { PropTypes } from 'react';
import { TouchableHighlight, TouchableNativeFeedback, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import styles, { ICON_COLOR, ICON_SIZE, UNDERLAY_COLOR } from './styles';

const LocateMeButton = ({ onPress = () => null, loading = false }) => {
  const Touchable = Platform.OS === 'ios' ? TouchableHighlight : TouchableNativeFeedback;

  return (
    <Touchable
      style={styles.button}
      onPress={onPress}
      underlayColor={UNDERLAY_COLOR}
      disabled={loading}
    >
      {loading ?
        <FontAwesome
          name="spinner"
          size={ICON_SIZE}
          color={ICON_COLOR}
          style={styles.icon}
        />
      :
        <Icon
          name="my-location"
          size={ICON_SIZE}
          color={ICON_COLOR}
          style={styles.icon}
        />
      }
    </Touchable>
  );
};

LocateMeButton.propTypes = {
  onPress: PropTypes.func,
  loading: PropTypes.bool,
};

export default LocateMeButton;
