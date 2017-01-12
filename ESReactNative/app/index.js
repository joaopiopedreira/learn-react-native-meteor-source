import React from 'react';
import {
  NavigationProvider,
  StackNavigation,
  TabNavigation,
  TabNavigationItem as TabItem,
} from '@exponent/ex-navigation';
import Router from './config/router';

const App = () => {
  return (
    <NavigationProvider router={Router}>
      <TabNavigation
        id="main"
        navigatorUID="main"
        initialTab="home"
      >
        <TabItem
          id="home"
          title="Home"
          // selectedStyle={styles.selectedTab}
          // renderIcon={(isSelected) => <Image source={require('./assets/images/home.png')} /> }
        >
          <StackNavigation
            id="home"
            navigatorUID="home"
            initialRoute={Router.getRoute('findNearMe')}
          />
        </TabItem>
        <TabItem
          id="account"
          title="Account"
          // selectedStyle={styles.selectedTab}
          // renderIcon={(isSelected) => <Image source={require('./assets/images/home.png')} /> }
        >
          <StackNavigation
            id="account"
            navigatorUID="account"
            initialRoute={Router.getRoute('signUp')}
          />
        </TabItem>
      </TabNavigation>
    </NavigationProvider>
  );
};

export default App;
