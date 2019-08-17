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
    ActivityIndicator, Title, Paragraph, Caption, Subheading, Text,
    Card, Searchbar, TextInput, Dialog, Portal, IconButton,
    Button,
} from 'react-native-paper';

import styled from 'styled-components/native';

interface IProps {
    navigation?: any;
}

function Page(props: IProps) {
    const [loading, setLoading] = useState(true);
    const { state, dispatch } = React.useContext(AppContext);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fb.db.ref('appUser/' + state.appUserToken).once('value');
            dispatch({ type: 'set-user-app', payload: res.val() });
        };
        fetchData();
        setLoading(false);
        return () => {
            fb.db.ref('appUser').off;
        };
    }, []);

    return (
        <Container>
            {loading === true ? <ActivityIndicator animating={true} /> :
                <View style={{ width: '100%' }}>
                    <Card>
                        <Card.Content>
                            <Title>{state.appUser ? state.appUser.userName : 'loading'}</Title>
                            <Paragraph>Role: {state.appUser ? state.appUser.userRole : 'loading'}</Paragraph>
                        </Card.Content>
                    </Card>
                    <Card>
                        <Card.Content>
                            <Title>Produk List</Title>
                        </Card.Content>
                        <Card.Actions>
                            <Button onPress={() => props.navigation.navigate('AdminProdukList')}>Lihat</Button>
                        </Card.Actions>
                    </Card>
                    {
                        !!state.appUser && state.appUser.userRole === 'Admin' ?
                            <Card>
                                <Card.Content>
                                    <Title>Produk Tambah</Title>
                                </Card.Content>
                                <Card.Actions>
                                    <Button onPress={() => props.navigation.navigate('AdminProdukEdit')}>Lihat</Button>
                                </Card.Actions>
                            </Card>
                            : <Text>{' '}</Text>
                    }
                    {
                        !!state.appUser && state.appUser.userRole === 'Owner' ?
                            <Card>
                                <Card.Content>
                                    <Title>Ubah status user</Title>
                                </Card.Content>
                                <Card.Actions>
                                    <Button onPress={() => props.navigation.navigate('AdminUserList')}>Lihat</Button>
                                </Card.Actions>
                            </Card>
                            : <Text>{' '}</Text>
                    }
                </View>}
        </Container>
    );
}

Page.navigationOptions = {
    title: 'Home',
}

export default Page;

const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background};
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 5px;
`;
const Space8 = styled.View`
  height: 8px;
  width: 8px;
`;