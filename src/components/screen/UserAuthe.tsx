import React, { Component, useState, useEffect } from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
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
import * as fb from '../../firebase/firebase';
// import styled from 'styled-components/native';

// import Button from '../shared/Button';
// import {
//     IC_MASK,
// } from '../../utils/Icons';

interface IProps {
    navigation: any;
}

function UserAuthe(props: IProps) {
    const { state, dispatch } = React.useContext(AppContext);
    const [userToken, setUserToken] = useState('');

    useEffect(() => {
        const getData = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                dispatch({ type: 'set-user-token', payload: token ? token : 'nouser' });
                props.navigation.navigate(token ? 'AppNavigator' : 'AuthStackNavigator');
            } catch (e) {
                console.log(e);
            }
        }
        getData();
    });

    return (
        <View>
            <ActivityIndicator />
            <StatusBar barStyle='default' />
        </View>
    );
}

export default UserAuthe;

// const Container = styled.View`
//   flex: 1;
//   background-color: ${(props) => props.theme.background};
//   flex-direction: row;
//   align-items: center;
//   justify-content: center;
// `;
