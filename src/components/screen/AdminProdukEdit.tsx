import React from 'react';
import {
    ScrollView
} from 'react-native';
import styled from 'styled-components/native';
import {
    Title,
    TextInput,
    Button,
} from 'react-native-paper';
import { AppProvider as Provider, AppConsumer, AppContext } from '../../providers';
import { IProduk } from 'src/types';
import * as fb from '../../firebase/firebase';

interface IProps {
    navigation: any;
    store?: any;
}

function AdminProdukEdit(props: IProps) {
    const [txtNamaItem, setTxtNamaItem] = React.useState('');
    const [txtKategoriItem, setTxtKategoriItem] = React.useState('');
    const [txtHarga1Item, setTxtHarga1Item] = React.useState('');
    const [txtHarga2Item, setTxtHarga2Item] = React.useState('');
    const [txtJumlah1Item, setTxtJumlah1Item] = React.useState('');
    const [txtJumlah2Item, setTxtJumlah2Item] = React.useState('');
    const { state, dispatch } = React.useContext(AppContext);

    const _onSubmit = () => {
        // * get key to firebase 
        const a = fb.db.ref('items/all').push();
        const produk: IProduk = {
            idItem: a.key,
            namaItem: txtNamaItem,
            kategoriItem: txtKategoriItem,
            harga1Item: parseInt(txtHarga1Item),
            harga2Item: parseInt(txtHarga2Item),
            // jumlah1Item: parseInt(txtJumlah1Item),
            // jumlah2Item: parseInt(txtJumlah2Item),
        };
        fb.db.ref('items/all/' + a.key).update(produk);
        fb.db.ref('items/admin/' + a.key).update({
            jumlah1Total: 0,
            jumlah2Total: 0,
            statusOrder: 'Open Order',
            statusProduksi: 'Update stok Produksi NOK'
        });
        fb.db.ref('items/admin/').update({
            statusOrderAll: 'Open Order All',
            jumlahOrder: 0,
        });
        props.navigation.navigate('Home');
    }

    return (
        <Container>
            <ScrollView style={{ width: '100%' }}>
                <Title>Input Produk</Title>
                <Space8 />
                <TextInput
                    label='Nama Item'
                    value={txtNamaItem}
                    onChangeText={(a) => setTxtNamaItem(a)}
                />
                <Space8 />
                <TextInput
                    label='Kategori Item'
                    value={txtKategoriItem}
                    onChangeText={(a) => setTxtKategoriItem(a)}
                />
                <Space8 />
                <TextInput
                    label='Harga 1 Item'
                    value={txtHarga1Item}
                    keyboardType='number-pad'
                    onChangeText={(a) => setTxtHarga1Item(a)}
                />
                <Space8 />
                <TextInput
                    label='Harga 2 Item'
                    value={txtHarga2Item}
                    keyboardType='number-pad'
                    onChangeText={(a) => setTxtHarga2Item(a)}
                />
                <Space8 />
                {/* <TextInput
                    label='Jumlah 1 Item'
                    value={txtJumlah1Item}
                    keyboardType='number-pad'
                    onChangeText={(a) => setTxtJumlah1Item(a)}
                />
                <Space8 />
                <TextInput
                    label='Jumlah 2 Item'
                    value={txtJumlah2Item}
                    keyboardType='number-pad'
                    onChangeText={(a) => setTxtJumlah2Item(a)}
                /><Space8 /> */}
                <Button icon="add-circle-outline" mode="contained" onPress={() => _onSubmit()}>
                    Submit Data
                </Button>
            </ScrollView>
        </Container>
    );
}

AdminProdukEdit.navigationOptions = {
    title: 'Produk Edit',
}

export default AdminProdukEdit;

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