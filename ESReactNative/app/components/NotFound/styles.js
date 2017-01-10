import { create } from 'react-native-platform-stylesheet';
import colors from '../../config/colors';

export const ICON_SIZE = 90;
export const ICON_COLOR = '#a2a2a2';

export default create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: colors.defaultText,
  },
});
