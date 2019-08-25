import React, { useState, useEffect } from 'react';
import {
  View,
} from 'react-native';
import {
  ActivityIndicator, Text, TextInput,
  Button, Dialog, Portal, Paragraph,
} from 'react-native-paper'

import styled from 'styled-components/native';
import * as fb from '../../firebase/firebase';

interface IProps {
  navigation: any;
  selectedItem: any;
}

function UserProdukDetail(props: IProps) {
  const [loading, setLoading] = useState(true);
  const [txtJumlahPesan, setTxtJumlahPesan] = useState('');
  const [statusProduksi, setStatusProduksi] = useState('');
  const [nomorResi, setNomorResi] = useState('');
  const [] = useState('');
  const [produk, setProduk] = useState([]);
  const [dlgJumlahProduksi, setDlgJumlahProduksi] = useState(false);

  const r = props.selectedItem;
  // console.log(r);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fb.db.ref('items/admin/' + r.idItem).once('value');
      const r1: any = [];
      res.forEach((el: any) => {
        // console.log(el.hasChildren());
        el.hasChildren()
          ? r1.push({
            userIdReseller: el.val().userId,
            userNameReseller: el.val().userName,
            jumlah2Item: el.val().jumlah2Item,
            jumlah2ItemOrder: el.val().jumlah2ItemOrder,
            statusOrderItem: el.val().statusOrderItem,
            nomorResi: el.val().nomorResi,
          })
          : ''
          ;
      });
      // console.log(res.val());
      if (res.val() !== null) {
        setProduk(r1);
        setLoading(false);
      }
    };
    fetchData();

    return () => {
      fb.db.ref('items').off;
    };
  }, [loading]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fb.db.ref('items/admin/' + r.idItem + '/jumlah1Total').once('value');
      setTxtJumlahPesan(res.val() ? res.val().toString() : '0');
    };
    fetchData();
    const fetchData2 = async () => {
      const res2 = await fb.db.ref('items/admin/' + r.idItem + '/statusProduksi').once('value');
      setStatusProduksi(res2.val() ? res2.val().toString() : '');
    };
    fetchData2();
    setLoading(false);
    return () => {
      fb.db.ref('items').off;
    };
  }, [loading]);

  const _onSubmit = () => {
    fb.db.ref('items/admin/' + r.idItem)
      .update({
        jumlah1Total: parseInt(txtJumlahPesan),
        statusProduksi: 'Update stok Produksi done'
      });
    setDlgJumlahProduksi(false);
    setLoading(true);
  }

  const _onKirimBarang = (p: any, s: any) => {
    fb.db.ref('items/admin/' + s.idItem + '/' + p.userIdReseller)
      .update({
        statusOrderItem: 'Barang di shipping',
        nomorResi: nomorResi,
      });
    setLoading(true);
  }

  const _showDialogJumlahProduksi = () => setDlgJumlahProduksi(true);
  const _hideDialogJumlahProduksi = () => setDlgJumlahProduksi(false);

  return (
    <View>{loading === true ? <ActivityIndicator animating={true} /> :
      <View>
        <Text>Harga Item: {r.harga2Item}</Text>
        <Text>Produksi Total: {txtJumlahPesan}</Text>
        {/* <Text>Status Proses Kirim Barang: {statusProduksi}</Text> */}
        <Space5 />
        {!!statusProduksi && statusProduksi === 'Update stok Produksi NOK' &&
          <View>
            <TextInput
              label='Jumlah Pesan'
              keyboardType='number-pad'
              value={txtJumlahPesan}
              onChangeText={(a) => setTxtJumlahPesan(a)}
            />
            <Space2 />
            <Button icon="add-circle-outline" mode="contained" onPress={_showDialogJumlahProduksi}
              disabled={txtJumlahPesan === '0' || txtJumlahPesan === ''}
            >
              Simpan
        </Button>
          </View>}
        {
          !!produk && produk.map((el: any, key) =>
            <View key={key}>
              <Space5 />
              <Text>
                {el.userNameReseller} : {el.statusOrderItem} / Resi : {el.nomorResi}
              </Text>
              <Space5 />
              {!!el.statusOrderItem && el.statusOrderItem === 'Pembayaran OK, proses kirim Barang' &&
                <View>
                  <TextInput
                    label='Nomor Resi'
                    value={nomorResi}
                    onChangeText={(a) => setNomorResi(a)}
                  />
                  <Space2 />
                  <Button icon="add-circle-outline" mode="contained" onPress={() => _onKirimBarang(el, r)}>
                    Kirim Barang
                  </Button>
                </View>}
            </View>
          )
        }
        <Portal>
          <Dialog
            visible={dlgJumlahProduksi}
            onDismiss={_hideDialogJumlahProduksi}>
            <Dialog.Title>Notify</Dialog.Title>
            <Dialog.Content>
              <Paragraph>Jumlah Barang Produksi sudah benar?</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button mode="contained" onPress={_onSubmit}>OK</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>}
    </View>

  );
}

UserProdukDetail.navigationOptions = {
  title: 'Produk Detail',
}
export default UserProdukDetail;

const Space5 = styled.View`
  height: 5px;
  width: 5px;
`;
const Space2 = styled.View`
  height: 2px;
  width: 2px;
`;