import React, { PropTypes } from 'react';
import { View } from 'react-native';
import { FormLabel, FormInput } from 'react-native-elements';

const Input = (props) => {
  return (
    <View>
      <FormLabel>{props.label}</FormLabel>
      <FormInput
        autoCapitalize="none"
        autoCorrect={false}
        {...props}
      />
    </View>
  );
};

Input.propTypes = {
  label: PropTypes.string,
};

export default Input;
