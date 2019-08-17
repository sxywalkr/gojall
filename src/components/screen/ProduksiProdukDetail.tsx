import React, { Component, useContext, useState, useEffect } from 'react';
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
import {
  ActivityIndicator, Text, TextInput,
  Button,
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
  const [statusOrderItem, setStatusOrderItem] = useState('');
  const [produk, setProduk] = useState([]);

  const { state, dispatch } = React.useContext(AppContext);
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
            <Button icon="add-circle-outline" mode="contained" onPress={() => _onSubmit()}>
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

      </View>}
    </View>

  );
}

UserProdukDetail.navigationOptions = {
  title: 'Produk Detail',
}
export default UserProdukDetail;

// const Container = styled.View`
//   flex: 1;
//   background-color: ${(props) => props.theme.background};
//   flex-direction: row;
//   align-items: center;
//   justify-content: center;
// `;
const Space8 = styled.View`
  height: 8px;
  width: 8px;
`;
const Space5 = styled.View`
  height: 5px;
  width: 5px;
`;
const Space2 = styled.View`
  height: 2px;
  width: 2px;
`;