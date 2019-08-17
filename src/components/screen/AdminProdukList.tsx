import React, { useState, useEffect, useContext } from 'react';
import {
    ScrollView,
    FlatList,
    View,
} from 'react-native';
import styled from 'styled-components/native';
import {
    Title, Card, Button,
} from 'react-native-paper';
import * as fb from '../../firebase/firebase';
import AdminProdukDetail2 from '../screen/AdminProdukDetail2';
import UserProdukDetail from '../screen/UserProdukDetail';
import ProduksiProdukDetail from '../screen/ProduksiProdukDetail';
import OwnerProdukDetail from '../screen/OwnerProdukDetail';
import { AppContext } from '../../providers';

interface IProps {
    navigation: any;
    store?: any;
}

function AdminProduksList(props: IProps) {
    const { state, dispatch } = useContext(AppContext);
    const [loading, setLoading] = useState(true);
    const [produk, setProduk] = useState([]);
    const [statusOrderAll, setStatusOrderAll] = useState('');

    const _renderItem = ({ item }: any) => (
        <Card key={item.idItem} style={{ marginVertical: 3 }}>
            <Card.Content>
                <Title>{item.namaItem} ({item.kategoriItem})</Title>
                {!!state.appUser && state.appUser.userRole === 'Admin' &&
                    <AdminProdukDetail2 navigation={props.navigation} selectedItem={item} />}
                {!!state.appUser && state.appUser.userRole === 'Reseller' &&
                    <UserProdukDetail navigation={props.navigation} selectedItem={item} />}
                {!!state.appUser && state.appUser.userRole === 'Produksi' &&
                    <ProduksiProdukDetail navigation={props.navigation} selectedItem={item} />}
                {!!state.appUser && state.appUser.userRole === 'Owner' &&
                    <OwnerProdukDetail navigation={props.navigation} selectedItem={item} />}
            </Card.Content>
        </Card>
    )

    const _keyExtractor = (item: any) => item.idItem;

    const _onCloseOrder = () => {
        fb.db.ref('items/admin')
            .update({
                statusOrderAll: 'Close Order'
            });
        setStatusOrderAll('');
    }

    useEffect(() => {
        const fetchData = async () => {
            const res = await fb.db.ref('items/all').once('value');
            const r1: any = [];
            res.forEach((el: any) => {
                r1.push({
                    idItem: el.key,
                    namaItem: el.val().namaItem,
                    kategoriItem: el.val().kategoriItem,
                    harga1Item: el.val().harga1Item,
                    harga2Item: el.val().harga2Item,
                    jumlah1Item: el.val().jumlah1Item,
                    jumlah2Item: el.val().jumlah2Item,
                });
            });
            setProduk(r1);
        };
        fetchData();
        return () => {
            fb.db.ref('items/all').off;
        };
    }, [produk]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fb.db.ref('items/admin/statusOrderAll').once('value');
            setStatusOrderAll(res.val());
            setLoading(false);
        };
        fetchData();

        return () => {
            fb.db.ref('items/admin').off;
        };
    }, [statusOrderAll]);

    // console.log(statusOrderAll);

    return (
        <Container>

            <ScrollView style={{ width: '100%' }}>
                <FlatList
                    data={produk}
                    keyExtractor={_keyExtractor}
                    renderItem={_renderItem}
                />
            </ScrollView>
            <View>
                {!!state.appUser && state.appUser.userRole === 'Admin' && statusOrderAll === 'Open Order' &&
                    <Button icon="add-circle-outline" mode="contained"
                        onPress={() => _onCloseOrder()}
                    // disabled={statusOrderAll === 'Open Order' ? false : true}
                    >
                        Close Order
                </Button>}
                {/* {statusOrderAll === 'Close Order' &&
                    <Button icon="add-circle-outline" mode="contained"
                      onPress={() => _onKonfirmasiOrderKeOwner()}
                    //     disabled={statusOrder === 'Close Order' ? false : true}
                    >
                        Proses order, konfirmasi ke Owner
                </Button>} */}
            </View>

        </Container>
    );

}

AdminProduksList.navigationOptions = {
    title: 'Produk List',
}


export default AdminProduksList;

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
