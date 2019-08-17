import React, { useContext } from 'react';
import { AppContext } from '../../contexts';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import UserAuthe from '../screen/UserAuthe';
import AppNavigator from './RootStackNavigator';
import AuthStackNavigator from './AuthStackNavigator';
import { ThemeProvider } from 'styled-components';
import { createTheme } from '../../theme';

const SwitchNavigator = createSwitchNavigator(
  {
    AppNavigator,
    UserAuthe,
    AuthStackNavigator,
  },
  {
    initialRouteName: 'UserAuthe',
  },
);

const AppContainer = createAppContainer(SwitchNavigator);

export default () => {
  // @ts-ignore
  const { state } = useContext(AppContext);
  const { theme } = state;

  return (
    <ThemeProvider theme={createTheme(theme)}>
      <AppContainer
        screenProps={{ theme: createTheme(theme)}}
      />
    </ThemeProvider>
  )
};
