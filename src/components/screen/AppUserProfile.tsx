import React, { useState, useEffect, useContext } from 'react';
import {
  View,
} from 'react-native';
import { AppContext } from '../../providers';
import * as fb from '../../firebase/firebase';
import {
  ActivityIndicator, Text, Button
} from 'react-native-paper';
import styled from 'styled-components/native';
// import UserProfileEdit from '../screen/UserProfileEdit';

interface IProps {
  navigation?: any;
}

function Page(props: IProps) {
  const { state, dispatch } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [dataUser, setDataUser] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const res = await fb.db.ref('appUser/' + state.appUserToken).once('value');
      dispatch({ type: 'set-user-app', payload: res.val() });
    };
    fetchData();
    return () => {
      fb.db.ref('appUser').off;
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await fb.db.ref('appUser/' + state.appUserToken).on('value', (snaps: any) =>{
        setDataUser(snaps.val());
      });      
      setLoading(false);
    }
    fetchData();
    return () => {
      fb.db.ref('appUser').off
    };
  }, [loading]);

  return (
    <Container>
      {loading ? <ActivityIndicator animating={true} /> :
        <View>
          <View>
          <Text>Halo {dataUser.userName}</Text>
          <Text>Email {dataUser.userEmail}</Text>
          <Text>Role {dataUser.userRole}</Text>
          </View>
          <Button onPress={() => props.navigation.navigate('UserProfileEdit', {q: dataUser})}>Edit Profile</Button>
        </View>}
    </Container>
  );
}

export default Page;

const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background};
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 5px;
`;
