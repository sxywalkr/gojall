import React, { useState, useEffect, useContext } from 'react';
import {
  View, ScrollView, Alert,
} from 'react-native';
import { AppContext } from '../../providers';
import * as fb from '../../firebase/firebase';
import {
  ActivityIndicator, Text, Button, TextInput, Title,
} from 'react-native-paper';

import styled from 'styled-components/native';
import { auth } from '../../firebase';

interface IProps {
  navigation?: any;
}

function Page(props: IProps) {
  const { state, dispatch } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [editProfile, setEditProfile] = useState(false);

  //   const [dataUser, setDataUser] = useState([])

  const [txtUserName, setTxtUserName] = useState('');
  // const [txtUserEmail, setTxtUserEmail] = useState('');
  // const [txtUserRole, setTxtUserRole] = useState('');
  const [txtUserOldPassword, setTxtUserOldPassword] = useState('');
  const [txtUserNewPassword, setTxtUserNewPassword] = useState('');

  const r = props.navigation.getParam('q')

  useEffect(() => {
    const fetchData = async () => {
      const res = await fb.db.ref('appUser/' + state.appUserToken).once('value');
      dispatch({ type: 'set-user-app', payload: res.val() });
      setLoading(false)
    };
    fetchData();
    return () => {
      fb.db.ref('appUser').off;
    };
  }, [loading]);

  const _onEditProfile = () => {
    fb.db.ref('appUser/' + state.appUserToken).update({
      userName: txtUserName,
    })
    props.navigation.navigate('BottomTabNavigator')
  }

  const _onUbahPassword = () => {
    auth.doChangePassword(r.userEmail, txtUserOldPassword, txtUserNewPassword)
    .then(() => {
      Alert.alert('Password berhasil diubah. Silahkan re-login.')
      props.navigation.navigate('BottomTabNavigator')
    })
    .catch((error:any) => {
      Alert.alert(error.message);
    });
  }

  return (
    <Container>
      {loading ? <ActivityIndicator animating={true} /> :
        <View style={{ width: '100%' }}>
          <ScrollView style={{ width: '100%' }}>
            {/* <Title>{r.userEmail}</Title> */}
            <TextInput
              label='User Name'
              value={txtUserName}
              onChangeText={(a) => setTxtUserName(a)}
              returnKeyType='next'
            />
            <Space2 />
            <Button icon="add-circle-outline" mode="contained" onPress={() => _onEditProfile()}>
              Submit Data
            </Button>
            <Space8 />
            <TextInput
              label='Password Lama'
              value={txtUserOldPassword}
              onChangeText={(a) => setTxtUserOldPassword(a)}
              returnKeyType='next'
            />
            <TextInput
              label='Password Baru'
              value={txtUserNewPassword}
              onChangeText={(a) => setTxtUserNewPassword(a)}
              returnKeyType='next'
            />
            <Space2 />
            <Button icon="add-circle-outline" mode="contained" onPress={() => _onUbahPassword()}>
              Ubah Password
            </Button>
          </ScrollView>
        </View>}
    </Container>
  );
}

Page.navigationOptions = {
  title: 'Edit User Profile',
}

export default Page;

const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background};
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 5px;
`;
const Space2 = styled.View`
  height: 2px;
  width: 2px;
`;
const Space8 = styled.View`
  height: 8px;
  width: 8px;
`;