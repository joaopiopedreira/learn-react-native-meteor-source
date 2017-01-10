import {
  createRouter,
} from '@exponent/ex-navigation';

import FindNearMe from '../screens/FindNearMe';
import LocationDetails from '../screens/LocationDetails';
import NearMe from '../screens/NearMe';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';

const Router = createRouter(() => ({
  findNearMe: () => FindNearMe,
  nearMe: () => NearMe,
  locationDetails: () => LocationDetails,
  signIn: () => SignIn,
  signUp: () => SignUp,
}));

export default Router;
