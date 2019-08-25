import React from 'react';
import { Platform, StatusBar, StyleSheet, View, Text, Dimensions, AsyncStorage, Alert } from 'react-native';
import SwitchNavigator from './components/navigation/SwitchNavigator';

import { AppProvider as Provider } from './providers';
import { Provider as PaperProvider } from 'react-native-paper';

const App = () => {
  return (
    <Provider>
      <PaperProvider>
        <SwitchNavigator />
      </PaperProvider>
    </Provider>
  );
};

export default App;
