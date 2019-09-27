import React, { useState, useEffect } from 'react';
import {
  View,
} from 'react-native';
import {
  ActivityIndicator, Text, Divider, TextInput,
  Button, Dialog, Portal, Paragraph, IconButton,
} from 'react-native-paper'

import styled from 'styled-components/native';
import * as fb from '../../firebase/firebase';

interface IProps {
  navigation?: any;
  selectedUser?: any;
  selectedItem?: any;
  // editPesan: any;
}

function Page(props: IProps) {
  const [loading, setLoading] = useState(true);
  const [jumlah1Total, setJumlah1Total] = useState('');
  const [jumlah2Total, setJumlah2Total] = useState('');
  const [statusOrder, setStatusOrder] = useState('');
  const [statusProduksi, setStatusProduksi] = useState('');
  const [produk, setProduk] = useState([]);
  const [statusOrderAll, setStatusOrderAll] = useState('');
  const [jumlahOrder, setJumlahOrder] = useState('');
  const [dlgVerifikasiOrder, setDlgVerifikasiOrder] = useState(false);
  const [dlgVerifikasiPembayaran, setDlgVerifikasiPembayaran] = useState(false);
  const [dlgOrderClosed, setDlgOrderClosed] = useState(false);
  const [txtJumlahPesan, setTxtJumlahPesan] = useState('');
  const [dlgPesan, setDlgPesan] = useState(false);
  const [editPesan, setEditPesan] = useState(false);

  const r = props.selectedItem;
  const s = props.selectedUser;


  useEffect(() => {
    // console.log('r', r)
    // console.log('s', s)

    const fetchData = async () => {
      const res = await fb.db.ref('items/admin/' + s.idItem).once('value');
      const r1: any = [];
      res.forEach((el: any) => {
        // el.hasChildren() ? 
        el.val().userId !== undefined ?
          r1.push({
            userIdReseller: el.val().userId,
            userNameReseller: el.val().userName,
            jumlah2Item: el.val().jumlah2Item,
            jumlah2ItemOrder: el.val().jumlah2ItemOrder,
            jumlah2ItemPercentage: el.val().jumlah2ItemPercentage,
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
        // console.log('res.val()', res.val())
        // console.log('r1', r1)
      }
    };
    fetchData();
    return () => {
      fb.db.ref('items').off;
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

  const _onVefirikasiPembayaran = (p: any, s: any) => {
    fb.db.ref('items/admin/' + s.idItem + '/' + p.userIdReseller)
      .update({
        statusOrderItem: 'Pembayaran OK, proses kirim Barang',
      });
    setDlgVerifikasiPembayaran(false);
    setProduk([]);
  }

  const _onEditPesanOK = (p: any, q: any, r: any) => {
    // console.log('_onEditPesanOK', p, q, r)
    // console.log('jumlah2Total', jumlah2Total)
    // console.log('r', r)
    // console.log('produk', produk)
    fb.db.ref('items/admin/' + q.idItem + '/' + p.userIdReseller)
      .update({
        jumlah2ItemOrder: parseInt(txtJumlahPesan),
        statusOrderItem: 'Jumlah pesan di konfirm Admin'
      });
    fb.db.ref('items/admin/' + q.idItem)
      .update({
        jumlah2Total: parseInt(r) - parseInt(p.jumlah2Item) + parseInt(txtJumlahPesan),
      });
    setEditPesan(false);
    setDlgPesan(false);
    setProduk([]);
    setLoading(true);
  }

  const _onOrderClosed = (p: any, s: any) => {
    fb.db.ref('items/admin/' + s.idItem + '/' + p.userIdReseller)
      .update({
        statusOrderItem: '---',
      });
    fb.db.ref('items/admin/' + s.idItem)
      .update({
        jumlah1Total: 0,
        jumlah2Total: 0,
        statusOrder: 'Open Order',
        statusProduksi: 'Update stok Produksi NOK',
      });
    fb.db.ref('items/admin')
      .update({
        jumlahOrder: parseInt(jumlahOrder) - 1,
      });
    setDlgOrderClosed(false);
    setProduk([]);
    setLoading(true);
  }

  const _showDialogPesan = () => setDlgPesan(true);
  const _hideDialogPesan = () => setDlgPesan(false);
  const _showDialogVerifikasiPembayaran = () => setDlgVerifikasiPembayaran(true);
  const _hideDialogVerifikasiPembayaran = () => setDlgVerifikasiPembayaran(false);
  const _showDialogOrderClosed = () => setDlgOrderClosed(true);
  const _hideDialogOrderClosed = () => setDlgOrderClosed(false);

  return (
    <View>
      {loading === true ? <ActivityIndicator animating={true} /> :
        <View style={r.statusOrderItem === 'Jumlah pesanan di simpan' && !editPesan ? { flexDirection: 'row', alignItems: 'center' } : { flexDirection: 'column' }}>
          <View>
            <Text>
              {r.userNameReseller} :
              {r.jumlah2Item} /
              {' '}{r.jumlah2ItemPercentage}% /
              {' '}{r.jumlah2ItemOrder}
            </Text>
            <Text>Status: {r.statusOrderItem}</Text>
          </View>
          <Space5 />
          {
            (r.statusOrderItem === 'Jumlah pesanan di simpan' && !editPesan) &&
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
          {r.statusOrderItem === 'Pembayaran Selesai, menunggu verifikasi Admin' &&
            <Button icon="add-circle-outline" mode="contained" onPress={_showDialogVerifikasiPembayaran}
            >
              Verifikasi Pembayaran OK
            </Button>}
          {r.statusOrderItem === 'Barang diterima' &&
            <Button icon="add-circle-outline" mode="contained" onPress={_showDialogOrderClosed}
            >
              Order closed
            </Button>}
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
          <Portal>
            <Dialog
              visible={dlgVerifikasiPembayaran}
              onDismiss={_hideDialogVerifikasiPembayaran}>
              <Dialog.Title>Notify</Dialog.Title>
              <Dialog.Content>
                <Paragraph>Verifikasi Pembayaran {r.userNameReseller} sudah OK?</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button mode="contained" onPress={() => _onVefirikasiPembayaran(r, s)}>OK</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
          <Portal>
            <Dialog
              visible={dlgOrderClosed}
              onDismiss={_hideDialogOrderClosed}>
              <Dialog.Title>Notify</Dialog.Title>
              <Dialog.Content>
                <Paragraph>Order {r.userNameReseller} closed?</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button mode="contained" onPress={() => _onOrderClosed(r, s)}>OK</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>

      }
    </View>
  );
}

export default Page;



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

