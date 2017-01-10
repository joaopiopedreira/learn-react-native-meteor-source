import React, { PropTypes } from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import styles, { ICON_SIZE, ICON_COLOR } from './styles';

const NotFound = ({ text = 'Not Found' }) => {
  return (
    <View style={styles.container}>
      <Icon name="alert" size={ICON_SIZE} color={ICON_COLOR} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

NotFound.propTypes = {
  text: PropTypes.string,
};

export default NotFound;
