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
  navigation?: any;
  selectedItem?: any;
  selectedUser?: any;
}

function OwnerProdukDetail(props: IProps) {
  const [loading, setLoading] = useState(true);
  // const [] = useState('');
  const [jumlah1Total, setJumlah1Total] = useState('');
  const [jumlah2Total, setJumlah2Total] = useState('');
  const [statusOrder, setStatusOrder] = useState('');
  const [produk, setProduk] = useState([]);
  const [dlgVerifikasiOrder, setDlgVerifikasiOrder] = useState(false);
  const [txtJumlahPesan, setTxtJumlahPesan] = useState('');
  const [dlgPesan, setDlgPesan] = useState(false);
  const [editPesan, setEditPesan] = useState(false);

  const r = props.selectedItem;
  const s = props.selectedUser;

  // console.log('jumlah2Total', jumlah2Total)

  useEffect(() => {
    // console.log('r', r)
    // console.log('s', s)
    const fetchData = async () => {
      const res = await fb.db.ref('items/admin/' + s.idItem).once('value');
      const r1: any = [];
      res.forEach((el: any) => {
        // console.log(el.val())
        el.val().userId !== undefined ?
          r1.push({
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
      if (res.val() !== null) {
        setProduk(r1);
        setJumlah1Total(res.val().jumlah1Total);
        setJumlah2Total(res.val().jumlah2Total);
        setStatusOrder(res.val().statusOrder);
        setLoading(false);
        // console.log('jumlah2Total', jumlah2Total)
      }
    };
    fetchData();

    return () => {
      fb.db.ref('items').off;
    };
  }, [produk]);

  const _onEditPesanOK = (p: any, q: any, r: any) => {
    // console.log('jumlah2Total', jumlah2Total, r, p.jumlah2Item, txtJumlahPesan)
    fb.db.ref('items/admin/' + q.idItem + '/' + p.userIdReseller)
      .update({
        jumlah2ItemOrder: parseInt(txtJumlahPesan),
        statusOrderItem: 'Order OK, konfirmasi ke Reseller',
      });
    fb.db.ref('items/admin/' + q.idItem)
      .update({
        jumlah2Total: parseInt(r) - parseInt(p.jumlah2ItemOrder) + parseInt(txtJumlahPesan),
        statusOrder: 'Order OK, konfirmasi ke Reseller',
      });
    setEditPesan(false);
    setDlgPesan(false);
    setTxtJumlahPesan('');
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

      <View style={(r.statusOrderItem === 'Jumlah pesan di konfirm Admin' || r.statusOrderItem === 'Jumlah pesanan di simpan') && editPesan ? { flexDirection: 'column' } : { flexDirection: 'row', alignItems: 'center' }}>
        <Space5 />
        <View>
          <Text>
            {r.userNameReseller} :
            {r.jumlah2Item} /{' '}
            {r.jumlah2ItemPercentage}% /{' '}
            {r.jumlah2ItemOrder}
          </Text>
        </View>
        <Space5 />
        {
          (r.statusOrderItem === 'Jumlah pesan di konfirm Admin' || r.statusOrderItem === 'Jumlah pesanan di simpan') && !editPesan &&
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
            visible={dlgPesan}
            onDismiss={_hideDialogPesan}>
            <Dialog.Title>Notify</Dialog.Title>
            <Dialog.Content>
              <Paragraph>Jumlah Pesan sudah OK?</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button mode="contained" onPress={() => _onEditPesanOK(r, s, jumlah2Total)}>OK</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    }
    </View>
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
