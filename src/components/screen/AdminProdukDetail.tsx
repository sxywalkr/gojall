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
  Text, TextInput, Divider,
  Button,
} from 'react-native-paper'

import styled from 'styled-components/native';
import * as fb from '../../firebase/firebase';


interface IProps {
  navigation: any;
}

function AdminProdukDetail(props: IProps) {
  const [jumlah1Total, setJumlah1Total] = useState('');
  const [jumlah2Total, setJumlah2Total] = useState('');
  const [statusOrder, setStatusOrder] = useState('');
  const [produk, setProduk] = useState([]);

  // const { state, dispatch } = React.useContext(AppContext);
  const { r } = props.navigation.state.params;

  useEffect(() => {
    const fetchData = async () => {
      const res = await fb.db.ref('items/admin/' + r.idItem).once('value');
      const r1: any = [];
      res.forEach((el) => {
        // console.log(el.hasChildren());
        el.hasChildren()
          ? r1.push({
            userIdReseller: el.val().userId,
            userNameReseller: el.val().userName,
            jumlah2Item: el.val().jumlah2Item,
            jumlah2ItemOrder: el.val().jumlah2ItemOrder,
            statusOrderItem: el.val().statusOrderItem,
          })
          : console.log('!hasChildren')
          ;
      });
      // r1.splice(-1, 1); // remove last item of array
      setProduk(r1);
      setJumlah1Total(res.val().jumlah1Total);
      setJumlah2Total(res.val().jumlah2Total);
      setStatusOrder(res.val().statusOrder);
    };
    fetchData();
    return () => {
      fb.db.ref('items').off;
    };
  }, []);

  // console.log(produk);

  const _onSubmit = (p: any, q: any, r: any, s: any) => {
    if (parseInt(jumlah2Total) > parseInt(jumlah1Total)) {
      p.forEach((el: any) => {
        // el['jumlah2ItemOrder'] = Math.floor((parseInt(el.jumlah2Item) / parseInt(jumlah2Total)) * parseInt(jumlah1Total))
        fb.db.ref('items/admin/' + s.idItem + '/' + el.userIdReseller)
          .update({
            jumlah2ItemOrder: Math.floor((parseInt(el.jumlah2Item) / parseInt(jumlah2Total)) * parseInt(jumlah1Total)),
          })
      });
    } else {
      p.forEach((el: any) => {
        fb.db.ref('items/admin/' + s.idItem + '/' + el.userIdReseller)
          .update({
            jumlah2ItemOrder: parseInt(el.jumlah2Item),
          })
      });
    }
    fb.db.ref('items/admin/' + s.idItem)
      .update({
        statusOrder: 'Konfirmasi ke Owner'
      });
    // hitung jumlah item di array
    // const x = 0;
    // const a = p.reduce((accumulator: any, currentValue: any) => {
    //   return accumulator + currentValue.jumlah2ItemOrder;
    // }, x);
    // console.log('a', a);
    props.navigation.goBack();
  }

  const _onOpenOrder = (p: any, q: any, r: any, s: any) => {
    fb.db.ref('items/admin/' + s.idItem)
      .update({
        statusOrder: 'Open Order'
      });
  }
  const _onCloseOrder = (p: any, q: any, r: any, s: any) => {
    fb.db.ref('items/admin/' + s.idItem)
      .update({
        statusOrder: 'Close Order'
      });
  }
  const _onVefirikasiPembayaran = (p: any, s: any) => {
    // console.log(p)
    // p.forEach((el: any) => {
    fb.db.ref('items/admin/' + s.idItem + '/' + p.userIdReseller)
      .update({
        statusOrderItem: 'Verifikasi Pembayaran OK',
      })
    // });
    props.navigation.goBack();
  }


  return (

    <View>
      <Text>Nama Item: {r.namaItem}</Text>
      <Text>Kategori Item: {r.kategoriItem}</Text>
      <Text>Harga Item: {r.harga2Item}</Text>
      <Text>Total Produksi: {jumlah1Total}</Text>
      <Text>Total Pesanan: {jumlah2Total}</Text>
      <Text>{' '}</Text>
      <Divider />
      {
        !!produk && produk.map((el, key) =>
          <View key={key}>
            <Text>{el.userNameReseller}</Text>
            <Text>Jumlah Pesan : {el.jumlah2Item}</Text>
            <Text>Persen Pesan : {jumlah2Total > jumlah1Total
              ? 100 * parseInt(el.jumlah2Item) / parseInt(jumlah2Total)
              : el.jumlah2Item}%</Text>
            <Text>Jumlah Fix Pesan : {jumlah2Total > jumlah1Total
              ? Math.floor((parseInt(el.jumlah2Item) / parseInt(jumlah2Total)) * parseInt(jumlah1Total))
              : el.jumlah2Item}</Text>
            <Text>Status Pembayaran: {el.statusOrderItem}</Text>
            <Button icon="add-circle-outline" mode="contained" onPress={() => _onVefirikasiPembayaran(el, r)}
              disabled={el.statusOrderItem === 'Pembayaran Selesai, menunggu verifikasi Admin' ? false : true}
            >
              Verifikasi Pembayaran
            </Button>
            <Divider />
          </View>
        )
      }
      <Space8 />
      <Space8 />
      <Button icon="add-circle-outline" mode="contained" onPress={() => _onCloseOrder(produk, jumlah1Total, jumlah2Total, r)}
        disabled={statusOrder === 'Open Order' ? false : true}
      >
        Close Order
      </Button>
      <Space8 />
      <Button icon="add-circle-outline" mode="contained" onPress={() => _onSubmit(produk, jumlah1Total, jumlah2Total, r)}
        disabled={statusOrder === 'Close Order' ? false : true}
      >
        Proses order, konfirmasi ke Owner
      </Button>
      {/* <Button icon="add-circle-outline" mode="contained" onPress={() => _onSubmit(produk, jumlah1Total, jumlah2Total, r)}
        disabled={statusOrder === 'Pembayaran Selesai, menunggu verifikasi Admin' ? false : true}
      >
        Pembayaran OK
      </Button> */}
    </View>

  );
}

AdminProdukDetail.navigationOptions = {
  title: 'Produk Detail',
}

// function getSum(total: number, num: number) {
//   return total + Math.round(num.jumlah1Total);
// }

export default AdminProdukDetail;

const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background};
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
const Space8 = styled.View`
  height: 8px;
  width: 8px;
`;