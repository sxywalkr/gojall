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
  ActivityIndicator, Text, TextInput, Divider,
  Button,
} from 'react-native-paper'

import styled from 'styled-components/native';
import * as fb from '../../firebase/firebase';


interface IProps {
  navigation: any;
  selectedItem: any;
}

function Page(props: IProps) {
  const [loading, setLoading] = useState(true);
  const [jumlah1Total, setJumlah1Total] = useState('');
  const [jumlah2Total, setJumlah2Total] = useState('');
  const [statusOrder, setStatusOrder] = useState('');
  const [produk, setProduk] = useState([]);
  const [statusOrderAll, setStatusOrderAll] = useState('');
  // console.log(props);
  // const { state, dispatch } = React.useContext(AppContext);
  // const { r } = props.navigation.state.params;
  const r = props.selectedItem;

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
          })
          : ''
          ;
      });
      // console.log(res.val());
      if (res.val() !== null) {
        setProduk(r1);
        setJumlah1Total(res.val().jumlah1Total);
        setJumlah2Total(res.val().jumlah2Total);
        setStatusOrder(res.val().statusOrder);
        setLoading(false);
      }
    };
    fetchData();

    return () => {
      fb.db.ref('items').off;
    };
  }, [produk]);

  // console.log(statusOrder);

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

  const _onSubmit = (p: any, q: any, r: any, s: any) => {
    if (parseInt(jumlah2Total) > parseInt(jumlah1Total)) {
      p.forEach((el: any) => {
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
    setProduk([]);
  }


  const _onVefirikasiPembayaran = (p: any, s: any) => {
    fb.db.ref('items/admin/' + s.idItem + '/' + p.userIdReseller)
      .update({
        statusOrderItem: 'Pembayaran OK, proses kirim Barang',
      });
    setProduk([]);
  }


  return (

    <View>
      {loading === true ? <ActivityIndicator animating={true} /> :
        <View>
          <Text>Harga Item: {r.harga2Item}</Text>
          <Text>{jumlah1Total} / {jumlah2Total}</Text>
          <Space8 />
          <Divider />
          {
            !!produk && produk.map((el: any, key) =>
              <View key={key}>
                <Space5 />
                <Text>
                  {el.userNameReseller} : 
                  {el.jumlah2Item} / 
                  {jumlah2Total > jumlah1Total
                    ? 100 * parseInt(el.jumlah2Item) / parseInt(jumlah2Total)
                    : el.jumlah2Item}% / 
                  {jumlah2Total > jumlah1Total
                    ? Math.floor((parseInt(el.jumlah2Item) / parseInt(jumlah2Total)) * parseInt(jumlah1Total))
                    : el.jumlah2Item}
                </Text>
                <Space5 />
                {el.statusOrderItem === 'Pembayaran Selesai, menunggu verifikasi Admin' &&
                  <Button icon="add-circle-outline" mode="contained" onPress={() => _onVefirikasiPembayaran(el, r)}
                  // disabled={el.statusOrderItem === 'Pembayaran Selesai, menunggu verifikasi Admin' ? false : true}
                  >
                    Verifikasi Pembayaran OK
                  </Button>}
              </View>
            )
          }
          <Space8 />
          {(statusOrderAll === 'Close Order' && statusOrder === 'Close Order') &&
            <Button icon="add-circle-outline" mode="contained" onPress={() => _onSubmit(produk, jumlah1Total, jumlah2Total, r)}
              disabled={statusOrderAll === 'Close Order' ? false : true}
            >
              Verifikasi order
          </Button>}
        </View>
      }
    </View>

  );
}

Page.navigationOptions = {
  title: 'Produk Detail',
}

export default Page;

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
const Space5 = styled.View`
  height: 5px;
  width: 5px;
`;
const Space2 = styled.View`
  height: 2px;
  width: 2px;
`;
