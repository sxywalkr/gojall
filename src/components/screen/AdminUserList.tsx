import React, { useState, useEffect, useContext } from 'react';
import {
    ScrollView,
    FlatList,
    ActivityIndicator,
    View,
} from 'react-native';
import styled from 'styled-components/native';
import {
    Title, Paragraph, Caption, Subheading, Text,
    Card, Searchbar, TextInput, Dialog, Portal, Provider, IconButton,
    Button,
} from 'react-native-paper';
import { AppProvider as AppProvider, AppConsumer, AppContext } from '../../providers';
import { IProduk } from 'src/types';
import * as fb from '../../firebase/firebase';


interface IProps {
    navigation: any;
    store?: any;
}
// state.appUser.userRole == 'Admin' ? 'AdminProdukList' : 'UserProdukList'

function AdminUserList(props: IProps) {
    const { state, dispatch } = useContext(AppContext);
    const [produk, setProduk] = useState([]);
    const [txtJumlahPesan, setTxtJumlahPesan] = useState('0');
    // console.log(state.appUser);
    const _renderItem = ({ item }: any) => (
        <Card key={item.idItem}>
            <Card.Content>
                <Title>{item.userName}</Title>
                <Paragraph>{item.userRole}</Paragraph>
            </Card.Content>
            <Card.Actions>
                <IconButton
                    icon='info-outline'
                    size={20}
                    onPress={() => _onChangeRole(item)}
                />
            </Card.Actions>
        </Card>
    )
    const _keyExtractor = (item: any, index: number) => item.userId;

    useEffect(() => {
        const fetchData = async () => {
            const res = await fb.db.ref('appUser').once('value');
            const r1: any = [];
            res.forEach((el) => {
                r1.push({
                    userId: el.val().userId,
                    userName: el.val().userName,
                    userRole: el.val().userRole,
                });
            });
            setProduk(r1);
        };

        fetchData();
        return () => {
            fb.db.ref('appUser').off;
        };
    }, [produk]);

    return (
        <Container>

            <ScrollView style={{ width: '100%' }}>
                <FlatList
                    data={produk}
                    keyExtractor={_keyExtractor}
                    renderItem={_renderItem}
                />
            </ScrollView>

        </Container>
    );

    function _onChangeRole(p: any) {
        if (p.userRole === 'Roleless') {
            fb.db.ref('appUser/' + p.userId).update({
                userRole: 'Reseller'
            })
        } else if (p.userRole === 'Reseller') {
            fb.db.ref('appUser/' + p.userId).update({
                userRole: 'Admin'
            })
        } else if (p.userRole === 'Admin') {
            fb.db.ref('appUser/' + p.userId).update({
                userRole: 'Produksi'
            })
        } else if (p.userRole === 'Produksi') {
            fb.db.ref('appUser/' + p.userId).update({
                userRole: 'Reseller'
            })
        }
    }
}

AdminUserList.navigationOptions = {
    title: 'User List',
}

export default AdminUserList;

const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background};
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 5px;
`;
const Space8 = styled.View`
  height: 8px;
  width: 8px;
`;