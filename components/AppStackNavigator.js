import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import {AppDrawerNavigator} from './AppDrawerNavigator'
import RecieverDetailsScreen  from '../screens/RecieverDetailsScreen';




export const AppStackNavigator = createStackNavigator({
  Drawer : {
    screen : AppDrawerNavigator,
    navigationOptions:{
      headerShown : false
    }
  },
  RecieverDetails : {
    screen : RecieverDetailsScreen,
    navigationOptions:{
      headerShown : false
    }
  },

},
  {
    initialRouteName: 'ExchangeList'
  }
);
