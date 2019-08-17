import React, { Component } from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  ScrollView,
  Text,
  View,
  FlatList,
  InteractionManager,
} from 'react-native';
import { AppProvider as Provider, AppConsumer, AppContext } from '../../providers';

import styled from 'styled-components/native';

import Button from '../shared/Button';
import {
  IC_MASK,
} from '../../utils/Icons';

interface IProps {
  navigation: any;
}

function Page(props: IProps) {
  const { state, dispatch } = React.useContext(AppContext);
  console.log(state);
  return (
    <Container>
      <Button
        testID='btn'
        onClick={() => props.navigation.goBack()}
        text='Go Back'
        style={{
          backgroundColor: '#333333',
        }}
      />
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
