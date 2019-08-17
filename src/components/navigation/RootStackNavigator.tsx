import React from 'react';
import { Text } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, getActiveChildNavigationOptions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';

import IntroScreen from '../screen/Intro';
import TempScreen from '../screen/Temp';
import AdminProdukEdit from '../screen/AdminProdukEdit';
import AdminProduksList from '../screen/AdminProdukList';
import AdminHome from '../screen/AdminHome';
import UserAuthe from '../screen/UserAuthe';
import AdminProdukDetail from '../screen/AdminProdukDetail';
import AdminProdukDetail2 from '../screen/AdminProdukDetail2';
import UserProdukDetail from '../screen/UserProdukDetail';
import ProduksiProdukDetail from '../screen/ProduksiProdukDetail';
import AdminUserList from '../screen/AdminUserList';
import OwnerProdukDetail from '../screen/OwnerProdukDetail';

const BottomTabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: AdminHome,
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: (() => (<Icon name='home' size={30} />)),
        tabBarVisible: true,
      },
    },
    Intro2: {
      screen: IntroScreen,
      navigationOptions: () => ({
        tabBarLabel: 'Profil',
        tabBarIcon: (() => (<Icon name='user-md' size={30} />)),
        tabBarVisible: true,
      }),
    },
  },
);

const routeConfig = {
  BottomTabNavigator: {
    screen: BottomTabNavigator,
    navigationOptions: ({ navigation, screenProps }: { navigation: any, screenProps: any }) => {
      const childOptions = getActiveChildNavigationOptions(navigation, screenProps);
      return {
        title: childOptions.title,
      };
    },
  },
  UserAuthe: {
    screen: UserAuthe,
  },
  UserProdukDetail: {
    screen: UserProdukDetail,
  },
  ProduksiProdukDetail: {
    screen: ProduksiProdukDetail,
  },
  AdminProdukDetail: {
    screen: AdminProdukDetail,
  },
  AdminProdukDetail2: {
    screen: AdminProdukDetail2,
  },
  AdminHome: {
    screen: AdminHome,
  },
  AdminUserList: {
    screen: AdminUserList,
  },
  AdminProdukEdit: {
    screen: AdminProdukEdit,
    navigationOptions: {
      headerTitle: <Text style={{
        fontSize: 18,
      }}>Produk Edit</Text>,
    },
  },
  AdminProdukList: {
    screen: AdminProduksList,
    navigationOptions: {
      title: 'Produk List',
      headerTitle: <Text style={{
        fontSize: 18,
      }}>Produk List</Text>,
    },
    // path: 'adminProdukEdit',
  },
  OwnerProdukDetail: {
    screen: OwnerProdukDetail,
  },
  Intro: {
    screen: IntroScreen,
    navigationOptions: {
      title: 'Intro',
    },
    path: 'intro',
  },
  Temp: {
    screen: TempScreen,
    navigationOptions: {
      headerTitle: <Text style={{
        fontSize: 18,
      }}>Temp</Text>,
    },
    path: 'temp',
  },

};

const navigatorConfig = {
  initialRouteName: 'BottomTabNavigator',
  // header: null,
  // headerMode: 'none',
  gesturesEnabled: true,
  statusBarStyle: 'light-content',
  navigationOptions: ({ navigation, screenProps }: { navigation: any, screenProps: any }) => {
    const { theme } = screenProps;
    // const childOptions = getActiveChildNavigationOptions(navigation, screenProps);
    return ({
      // title: childOptions.title,
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
