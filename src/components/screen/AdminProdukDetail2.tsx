import React, { useState, useEffect } from 'react';
import {
  View,
} from 'react-native';
import {
  ActivityIndicator, Text, Divider,
  Button, Dialog, Portal, Paragraph,
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
  const [statusProduksi, setStatusProduksi] = useState('');
  const [produk, setProduk] = useState([]);
  const [statusOrderAll, setStatusOrderAll] = useState('');
  const [jumlahOrder, setJumlahOrder] = useState('');
  const [dlgVerifikasiOrder, setDlgVerifikasiOrder] = useState(false);
  const [dlgVerifikasiPembayaran, setDlgVerifikasiPembayaran] = useState(false);
  const [dlgOrderClosed, setDlgOrderClosed] = useState(false);

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

  useEffect(() => {
    const fetchData = async () => {
      const res = await fb.db.ref('items/admin/' + r.idItem + '/statusOrder').once('value');
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
      const res = await fb.db.ref('items/admin/' + r.idItem + '/statusProduksi').once('value');
      setStatusProduksi(res.val());
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



  const _onVerifikasiOrder = (p: any, q: any, r: any, s: any) => {
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
    setDlgVerifikasiOrder(false);
    setLoading(true);
  }


  const _onVefirikasiPembayaran = (p: any, s: any) => {
    fb.db.ref('items/admin/' + s.idItem + '/' + p.userIdReseller)
      .update({
        statusOrderItem: 'Pembayaran OK, proses kirim Barang',
      });
    setDlgVerifikasiPembayaran(false);
    setProduk([]);
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
        statusOrder: '---',
        statusProduksi: '---',
      });
    fb.db.ref('items/admin')
      .update({
        jumlahOrder: parseInt(jumlahOrder) - 1,
      });
    setDlgOrderClosed(false);
    setProduk([]);
    setLoading(true);
  }

  const _showDialogVerifikasiOrder = () => setDlgVerifikasiOrder(true);
  const _hideDialogVerifikasiOrder = () => setDlgVerifikasiOrder(false);
  const _showDialogVerifikasiPembayaran = () => setDlgVerifikasiPembayaran(true);
  const _hideDialogVerifikasiPembayaran = () => setDlgVerifikasiPembayaran(false);
  const _showDialogOrderClosed = () => setDlgOrderClosed(true);
  const _hideDialogOrderClosed = () => setDlgOrderClosed(false);

  // console.log(statusOrderAll, statusOrder, statusProduksi)

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
                <Text>Status: {el.statusOrderItem}</Text>
                <Space5 />
                {el.statusOrderItem === 'Pembayaran Selesai, menunggu verifikasi Admin' &&
                  <Button icon="add-circle-outline" mode="contained" onPress={_showDialogVerifikasiPembayaran}
                  >
                    Verifikasi Pembayaran OK
                  </Button>}
                {el.statusOrderItem === 'Barang diterima' &&
                  <Button icon="add-circle-outline" mode="contained" onPress={_showDialogOrderClosed}
                  >
                    Order closed
                  </Button>}
                <Portal>
                  <Dialog
                    visible={dlgVerifikasiPembayaran}
                    onDismiss={_hideDialogVerifikasiPembayaran}>
                    <Dialog.Title>Notify</Dialog.Title>
                    <Dialog.Content>
                      <Paragraph>Verifikasi Pembayaran {el.userNameReseller} sudah OK?</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                      <Button mode="contained" onPress={() => _onVefirikasiPembayaran(el, r)}>OK</Button>
                    </Dialog.Actions>
                  </Dialog>
                </Portal>
                <Portal>
                  <Dialog
                    visible={dlgOrderClosed}
                    onDismiss={_hideDialogOrderClosed}>
                    <Dialog.Title>Notify</Dialog.Title>
                    <Dialog.Content>
                      <Paragraph>Order {el.userNameReseller} closed?</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                      <Button mode="contained" onPress={() => _onOrderClosed(el, r)}>OK</Button>
                    </Dialog.Actions>
                  </Dialog>
                </Portal>
              </View>
            )
          }
          <Space8 />
          {statusOrderAll === 'Close Order' && statusOrder === 'Open Order' && statusProduksi === 'Update stok Produksi done' &&
            <Button icon="add-circle-outline" mode="contained" onPress={_showDialogVerifikasiOrder}
            >
              Verifikasi order
          </Button>}
          <Portal>
            <Dialog
              visible={dlgVerifikasiOrder}
              onDismiss={_hideDialogVerifikasiOrder}>
              <Dialog.Title>Notify</Dialog.Title>
              <Dialog.Content>
                <Paragraph>Verifikasi Order sudah OK?</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button mode="contained" onPress={() => _onVerifikasiOrder(produk, jumlah1Total, jumlah2Total, r)}>OK</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      }
    </View>

  );
}

Page.navigationOptions = {
  title: 'Produk Detail',
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

