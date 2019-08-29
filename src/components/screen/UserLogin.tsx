import React from 'react';
import {
  View, Alert, AsyncStorage,
} from 'react-native';
import styled from 'styled-components/native';
import {
  TextInput,
  Button,
} from 'react-native-paper';
import { AppProvider as Provider, AppConsumer, AppContext } from '../../providers';
import { auth } from '../../firebase';

interface IProps {
  navigation: any;
  store?: any;
}

function Login(props: IProps) {
  const [txtEmail, setTxtEmail] = React.useState('');
  const [txtPassword, setTxtPassword] = React.useState('');
  const { state, dispatch } = React.useContext(AppContext);

  const _onLogin = (a: string, b: string) => {
    auth.doSignInWithEmailAndPassword(a, b)
      .then((authUser) => {
        AsyncStorage.setItem('userToken', authUser.user.uid);
        props.navigation.navigate('UserAuthe')
      })
      .catch((error) => {
        Alert.alert(error.message);
      });
  }

  return (
    <Container>
      <View style={{width:'100%'}}>
        <TextInput
          label='Email'
          value={txtEmail}
          keyboardType='email-address'
          onChangeText={(a) => setTxtEmail(a)}
          returnKeyType='next'
        />
        <Space8 />
        <TextInput
          label='Password'
          value={txtPassword}
          onChangeText={(a) => setTxtPassword(a)}
          secureTextEntry={true}
          returnKeyType='next'
        />
        <Space8 />
        <Button mode="contained" onPress={() => _onLogin(txtEmail, txtPassword)}>
          Login
      </Button>
        <Space8 />
        <Button onPress={() => props.navigation.navigate('UserRegister')}>
          Register
      </Button>
      </View>
    </Container>
  );


}

Login.navigationOptions = {
  header: null
}

export default Login;

const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
`;
const Space8 = styled.View`
  height: 8px;
  width: 8px;
`;