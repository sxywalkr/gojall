import React, { Component, useState, useEffect } from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  ScrollView,
  View,
  FlatList,
  InteractionManager,
} from 'react-native';
import { AppProvider as Provider, AppConsumer, AppContext } from '../../providers';
import * as fb from '../../firebase/firebase';
import {
  Title, Paragraph, Caption, Subheading, Text,
  Card, Searchbar, TextInput, Dialog, Portal, IconButton,
  Button,
} from 'react-native-paper';

import styled from 'styled-components/native';

interface IProps {
  navigation?: any;
}

function Page(props: IProps) {
  const { state, dispatch } = React.useContext(AppContext);

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

  

  return (
    <Container>
      <Text>{state.appUser ? state.appUser.userName : 'loading' }</Text>
    </Container>
  );
}

export default Page;

const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background};
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
