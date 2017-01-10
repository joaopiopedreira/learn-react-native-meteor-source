import React from 'react';
import {
  NavigationProvider,
  StackNavigation,
} from '@exponent/ex-navigation';
import Router from './config/router';

const App = () => {
  return (
    <NavigationProvider router={Router}>
      {/* <StackNavigation initialRoute={Router.getRoute('findNearMe')} /> */}
      <StackNavigation initialRoute={Router.getRoute('nearMe')} />
    </NavigationProvider>
  );
};

export default App;
