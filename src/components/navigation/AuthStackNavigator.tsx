import React from 'react';
import { Text } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import LoginScreen from '../screen/UserLogin';
import RegisterScreen from '../screen/UserRegister';
import UserAuthe from '../screen/UserAuthe';

const routeConfig = {
  UserLogin: {
    screen: LoginScreen,
  },
  UserRegister: {
    screen: RegisterScreen,
  },
  UserAuthe: {
    screen: UserAuthe,
  }
  
};

const navigatorConfig = {
  initialRouteName: 'UserLogin',
  gesturesEnabled: true,
  statusBarStyle: 'light-content',
  // header: null,
  // headerMode: 'none',
  navigationOptions: ({ navigation, screenProps } : { navigation: any, screenProps: any}) => {
    const { theme } = screenProps;
    return ({
      headerStyle: {
        backgroundColor: theme.background,
        borderBottomColor: 'transparent',
        borderBottomWidth: 0,
        elevation: 0,
      },
      headerTitleStyle: { color: theme.fontColor },
      headerTintColor: theme.tintColor,
    });
  },
};

const RootStackNavigator = createStackNavigator(routeConfig, navigatorConfig);

interface IProps {
  navigation?: any;
  theme?: object;
}

class RootNavigator extends React.Component<IProps> {
  private static router = RootStackNavigator.router;

  public render() {
    return (
      <RootStackNavigator
        navigation={this.props.navigation}
        screenProps={{ theme: this.props.theme }}
      />
    );
  }
}

export default RootNavigator;
