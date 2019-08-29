import React, { useState, useEffect } from 'react';
import {
  View,
} from 'react-native';
import {
  ActivityIndicator, Text, Divider,
  Button, Dialog, Portal, Paragraph, IconButton, TextInput,
} from 'react-native-paper'

import styled from 'styled-components/native';
import * as fb from '../../firebase/firebase';

interface IProps {
  navigation: any;
  selectedItem: any;
}

function OwnerProdukDetail(props: IProps) {
  const [loading, setLoading] = useState(true);
  const [] = useState('');
  const [jumlah1Total, setJumlah1Total] = useState('');
  const [jumlah2Total, setJumlah2Total] = useState('');
  const [statusOrder, setStatusOrder] = useState('');
  const [produk, setProduk] = useState([]);
  const [dlgVerifikasiOrder, setDlgVerifikasiOrder] = useState(false);
  const [txtJumlahPesan, setTxtJumlahPesan] = useState('');
  const [dlgPesan, setDlgPesan] = useState(false);
  const [editPesan, setEditPesan] = useState(false);

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
            jumlah2ItemPercentage: el.val().jumlah2ItemPercentage,
            jumlah2ItemOrder: el.val().jumlah2ItemOrder,
            statusOrderItem: el.val().statusOrderItem,
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

  const _onKonfirmasiKeReseller = (s: any, t: any) => {
    // * save to firebase 
    fb.db.ref('items/admin/' + s.idItem)
      .update({
        statusOrder: 'Order OK, konfirmasi ke Reseller',
      });
    fb.db.ref('items/admin/' + s.idItem + '/' + t.userIdReseller)
      .update({
        statusOrderItem: 'Order OK, konfirmasi ke Reseller',
      });
    setDlgVerifikasiOrder(false)
    setLoading(true);
  }

  const _onEditPesanOK = (p: any, q: any, r: any) => {
    // console.log(p, q, r)
    fb.db.ref('items/admin/' + q.idItem + '/' + p.userIdReseller)
      .update({
        jumlah2ItemOrder: parseInt(txtJumlahPesan),
        statusOrderItem: 'Order OK, konfirmasi ke Reseller',
      });
    fb.db.ref('items/admin/' + q.idItem)
      .update({
        jumlah2Total: parseInt(r) - parseInt(p.jumlah2Item) + parseInt(txtJumlahPesan),
        statusOrder: 'Order OK, konfirmasi ke Reseller',
      });
    setEditPesan(false);
    setDlgPesan(false);
    setProduk([]);
    setLoading(true);
  }

  const _showDialogVerifikasiOrder = () => setDlgVerifikasiOrder(true);
  const _hideDialogVerifikasiOrder = () => setDlgVerifikasiOrder(false);
  const _showDialogPesan = () => setDlgPesan(true);
  const _hideDialogPesan = () => setDlgPesan(false);

  // console.log(produk, editPesan);

  return (
    <View>{loading === true ? <ActivityIndicator animating={true} /> :
      <View>
        <Text>Harga Item: {r.harga2Item}</Text>
        <Text>{jumlah1Total} / {jumlah2Total}</Text>
        <Space8 />
        <Divider />
        {
          !!produk && produk.map((el: any, key) =>
            <View key={key} style={(el.statusOrderItem === 'Jumlah pesan di konfirm Admin' || el.statusOrderItem === 'Jumlah pesanan di simpan') && editPesan ? {flexDirection: 'column'} : { flexDirection: 'row', alignItems: 'center' }}>
              <Space5 />
              <View>
                <Text>
                  {el.userNameReseller} :
                  {el.jumlah2Item} /{' '}
                  {el.jumlah2ItemPercentage}% /{' '}
                  {el.jumlah2ItemOrder}
                </Text>
              </View>
              <Space5 />
              {
                (el.statusOrderItem === 'Jumlah pesan di konfirm Admin' || el.statusOrderItem === 'Jumlah pesanan di simpan' ) && !editPesan &&
                <View><IconButton icon="edit"
                  size={20}
                  onPress={() => setEditPesan(true)}
                /></View>
              }
              {
                editPesan &&
                <View>
                  <TextInput
                    label='Jumlah Pesan'
                    keyboardType='number-pad'
                    value={txtJumlahPesan}
                    onChangeText={(a) => setTxtJumlahPesan(a)}
                  />
                  <Space2 />
                  <Button onPress={() => setEditPesan(false)}
                  >
                    Cancel
                  </Button>
                  <Button icon="add-circle-outline" mode="contained" onPress={_showDialogPesan}
                    disabled={txtJumlahPesan === '0' || txtJumlahPesan === ''}
                  >
                    Pesan OK
                  </Button>
                </View>
              }
              <Portal>
                <Dialog
                  visible={dlgVerifikasiOrder}
                  onDismiss={_hideDialogVerifikasiOrder}>
                  <Dialog.Title>Notify</Dialog.Title>
                  <Dialog.Content>
                    <Paragraph>Verifikasi Order sudah OK?</Paragraph>
                  </Dialog.Content>
                  <Dialog.Actions>
                    <Button mode="contained" onPress={() => _onKonfirmasiKeReseller(r, el)}>OK</Button>
                  </Dialog.Actions>
                </Dialog>
              </Portal>
              <Portal>
                <Dialog
                  visible={dlgPesan}
                  onDismiss={_hideDialogPesan}>
                  <Dialog.Title>Notify</Dialog.Title>
                  <Dialog.Content>
                    <Paragraph>Jumlah Pesan sudah OK?</Paragraph>
                  </Dialog.Content>
                  <Dialog.Actions>
                    <Button mode="contained" onPress={() => _onEditPesanOK(el, r, jumlah2Total)}>OK</Button>
                  </Dialog.Actions>
                </Dialog>
              </Portal>
            </View>
          )
        }
        <Space5 />
        {statusOrder === 'Konfirmasi ke Owner' && !editPesan &&
          <Button icon="add-circle-outline" mode="contained" onPress={_showDialogVerifikasiOrder}
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
const Space2 = styled.View`
  height: 2px;
  width: 2px;
`;
