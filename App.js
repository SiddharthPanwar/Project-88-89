import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SignUpLoginScreen from './screens/SignUpLoginScreen'
import {createAppContainer,createSwitchNavigator} from 'react-navigation'
import {AppDrawerNavigator} from './components/AppDrawerNavigator'

export default class App extends React.Component {
  render(){
  return (
     <AppContainer/>
  );
  }
}

const switchNavigator = createSwitchNavigator({
  SignUpLoginScreen : {screen : SignUpLoginScreen},
  Drawer : {screen:AppDrawerNavigator}
})

const AppContainer = createAppContainer(switchNavigator)
