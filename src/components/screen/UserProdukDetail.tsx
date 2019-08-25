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
  const [produk, setProduk] = useState('');
  const [produk2, setProduk2] = useState('');
  const [jumlah2ItemOrder, setJumlah2ItemOrder] = useState('');
  const [statusOrder, setStatusOrder] = useState('');
  const [statusOrderItem, setStatusOrderItem] = useState('');
  const [nomorResi, setNomorResi] = useState('');
  const [jumlahOrder, setJumlahOrder] = useState('0');
  const { state, dispatch } = useContext(AppContext);
  const [statusOrderAll, setStatusOrderAll] = useState('');
  const [produks, setProduks] = useState([]);
  const r = props.selectedItem;
  // const { r } = props.navigation.state.params;

  useEffect(() => {
    const fetchData = async () => {
      const res = await fb.db.ref('items/admin/' + r.idItem + '/jumlah2Total').once('value');
      setProduk(res.val() ? res.val() : '0');
    };
    fetchData();
    const fetchData2 = async () => {
      const res2 = await fb.db.ref('items/admin/' + r.idItem + '/' + state.appUser.userId + '/jumlah2Item').once('value');
      setTxtJumlahPesan(res2.val() ? res2.val().toString() : '0');
      setProduk2(res2.val() ? res2.val().toString() : '0');
    };
    fetchData2();
    const fetchData3 = async () => {
      const res3 = await fb.db.ref('items/admin/' + r.idItem + '/statusOrder').once('value');
      setStatusOrder(res3.val() ? res3.val() : 'loading');
    };
    fetchData3();
    const fetchData4 = async () => {
      const res4 = await fb.db.ref('items/admin/' + r.idItem + '/' + state.appUser.userId + '/jumlah2ItemOrder').once('value');
      setJumlah2ItemOrder(res4.val() ? res4.val().toString() : '0');
    };
    fetchData4();
    const fetchData5 = async () => {
      const res5 = await fb.db.ref('items/admin/' + r.idItem + '/' + state.appUser.userId + '/statusOrderItem').once('value');
      setStatusOrderItem(res5.val() ? res5.val() : '---');
    };
    fetchData5();
    const fetchData6 = async () => {
      const res6 = await fb.db.ref('items/admin/' + r.idItem + '/' + state.appUser.userId + '/nomorResi').once('value');
      setNomorResi(res6.val() ? res6.val() : '---');
    };
    fetchData6();
    setLoading(false);
    return () => {
      fb.db.ref('items').off;
    };
  }, [jumlah2ItemOrder]);

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

  useEffect(() => {
    const fetchData = async () => {
      const res = await fb.db.ref('items/admin/' + r.idItem + 'statusOrder').once('value');
      setStatusOrder(res.val());
      setLoading(false);
    };
    fetchData();
    setLoading(false);
    return () => {
      fb.db.ref('items/admin').off;
    };
  }, [loading]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fb.db.ref('items/admin/' + r.idItem + '/' + state.appUser.userId + '/statusOrderItem').once('value');
      setStatusOrderItem(res.val());
      setLoading(false);
    };
    fetchData();

    return () => {
      fb.db.ref('items/admin').off;
    };
  }, [loading]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fb.db.ref('items/admin/jumlahOrder').once('value');
      setJumlahOrder(res.val());
      setLoading(false);
    };
    fetchData();

    return () => {
      fb.db.ref('items/admin').off;
    };
  }, [loading]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const res = await fb.db.ref('items/admin/' + r.idItem).once('value');
  //     const r1: any = [];
  //     res.forEach((el: any) => {
  //       // console.log(el.hasChildren());
  //       el.hasChildren()
  //         ? r1.push({
  //           userIdReseller: el.val().userId,
  //           userNameReseller: el.val().userName,
  //           jumlah2Item: el.val().jumlah2Item,
  //           jumlah2ItemOrder: el.val().jumlah2ItemOrder,
  //           statusOrderItem: el.val().statusOrderItem,
  //         })
  //         : ''
  //         ;
  //     });
  //     // console.log(res.val());
  //     if (res.val() !== null) {
  //       setProduks(r1);
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();

  //   return () => {
  //     fb.db.ref('items').off;
  //   };
  // }, [loading]);

  const _onSubmit = () => {
    fb.db.ref('items/admin/' + r.idItem + '/' + state.appUser.userId)
      .update({
        userId: state.appUser.userId,
        userName: state.appUser.userName,
        jumlah2Item: parseInt(txtJumlahPesan),
        jumlah2ItemOrder: parseInt('0'),
        statusOrderItem: 'Barang dipesan'
      });
    fb.db.ref('items/admin/' + r.idItem)
      .update({
        jumlah2Total: parseInt(produk) - parseInt(produk2) + parseInt(txtJumlahPesan),
      });
    fb.db.ref('items/admin')
      .update({
        jumlahOrder: parseInt(jumlahOrder) + 1,
      });
    setLoading(true);
    setJumlah2ItemOrder('');
  }

  const _onOrderOK = (s: any) => {
    fb.db.ref('items/admin/' + s.idItem + '/' + state.appUser.userId)
      .update({
        statusOrderItem: 'Pembayaran Selesai, menunggu verifikasi Admin'
      });
    setLoading(true);
  }

  const _onBarangDiterima = (s: any) => {
    fb.db.ref('items/history/' + s.idItem + '/' + state.appUser.userId)
      .update({
        jumlah2ItemPending: parseInt(produk2) - parseInt(jumlah2ItemOrder),
      });
    fb.db.ref('items/admin/' + s.idItem + '/' + state.appUser.userId)
      .update({
        jumlah2Item: 0,
        jumlah2ItemOrder: 0,
        jumlah2ItemPending: parseInt(produk2) - parseInt(jumlah2ItemOrder),
        statusOrderItem: 'Barang diterima',
        nomorResi: '',
      });
    setLoading(true);
  }

  // console.log(statusOrderItem);

  return (
    <View>{loading === true ? <ActivityIndicator animating={true} /> :
      <View>
        <Text>Harga Item: {r.harga2Item}</Text>
        <Text>Jumlah Pre Order: {produk2}</Text>
        <Text>Jumlah Fix Order: {jumlah2ItemOrder}</Text>
        <Text>Status: {statusOrderItem}</Text>
        <Text>Nomor Resi: {nomorResi}</Text>
        <Space5 />
        {
          statusOrderAll === 'Open Order All' && statusOrder === 'Open Order' && statusOrderItem === '---' &&
          <View>
            <TextInput
              label='Jumlah Pesan'
              keyboardType='number-pad'
              value={txtJumlahPesan}
              onChangeText={(a) => setTxtJumlahPesan(a)}
            />
            <Space2 />
            <Button icon="add-circle-outline" mode="contained" onPress={() => _onSubmit()}>
              Pesan
            </Button>
          </View>
        }
        {
          statusOrderItem === 'Barang dipesan' && statusOrder === 'Order OK, konfirmasi ke Reseller' &&
          <Button icon="add-circle-outline" mode="contained" onPress={() => _onOrderOK(r)}
          >
            Order OK, konfirmasi Pembayaran
              </Button>
        }
        {
          !!statusOrderItem && statusOrderItem === 'Barang di shipping' &&
          <Button icon="add-circle-outline" mode="contained" onPress={() => _onBarangDiterima(r)}
          >
            Barang diterima
              </Button>

        }
      </View>
    }</View>
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
const Space5 = styled.View`
  height: 5px;
  width: 5px;
`;
const Space2 = styled.View`
  height: 2px;
  width: 2px;
`;
