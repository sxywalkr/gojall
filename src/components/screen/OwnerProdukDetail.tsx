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

function OwnerProdukDetail(props: IProps) {
  const [loading, setLoading] = useState(true);
  const [txtJumlahPesan, setTxtJumlahPesan] = useState('');
  const [jumlah1Total, setJumlah1Total] = useState('');
  const [jumlah2Total, setJumlah2Total] = useState('');
  const [statusOrder, setStatusOrder] = useState('');
  const [produk, setProduk] = useState([]);

  const { state, dispatch } = React.useContext(AppContext);

  const r = props.selectedItem;

  useEffect(() => {
    const fetchData = async () => {
      const res = await fb.db.ref('items/admin/' + r.idItem).once('value');
      const r1: any = [];
      res.forEach((el: any) => {
        el.hasChildren()
          ? r1.push({
            userIdReseller: el.val().userId,
            userNameReseller: el.val().userName,
            jumlah2Item: el.val().jumlah2Item,
            jumlah2ItemOrder: el.val().jumlah2ItemOrder,
          })
          : ''
          ;
      });
      setProduk(r1);
      setJumlah1Total(res.val().jumlah1Total);
      setJumlah2Total(res.val().jumlah2Total);
      setStatusOrder(res.val().statusOrder);
    };
    fetchData();
    setLoading(false);
    return () => {
      fb.db.ref('items').off;
    };
  }, [loading]);

  // console.log(produk);

  const _onKonfirmasiKeReseller = (s: any) => {
    // * save to firebase 
    fb.db.ref('items/admin/' + s.idItem)
      .update({
        statusOrder: 'Order OK, konfirmasi ke Reseller'
      });
    setLoading(true);
  }

  return (
    <View>{loading === true ? <ActivityIndicator animating={true} /> :
      <View>
        <Text>Harga Item: {r.harga2Item}</Text>
        <Text>{jumlah1Total} / {jumlah2Total}</Text>

        <Divider />
        {
          !!produk && produk.map((el: any, key) =>
            <View key={key}>
              <Space8 />
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
            </View>
          )
        }

        {statusOrder === 'Konfirmasi ke Owner' &&
          <Button icon="add-circle-outline" mode="contained" onPress={() => _onKonfirmasiKeReseller(r)}
            disabled={statusOrder === 'Konfirmasi ke Owner' ? false : true}
          >
            Verifikasi Order
      </Button>}
      </View>
    }</View>
  );
}

OwnerProdukDetail.navigationOptions = {
  title: 'Produk Detail',
}
export default OwnerProdukDetail;

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
