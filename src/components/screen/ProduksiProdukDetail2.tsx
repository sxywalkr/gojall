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
  navigation?: any;
  selectedItem: any;
  selectedUser: any;
}

function UserProdukDetail(props: IProps) {
  const [loading, setLoading] = useState(false);
  const [nomorResi, setNomorResi] = useState('');
  const [produk, setProduk] = useState([]);
  const [dlgKirimBarang, setDlgKirimBarang] = useState(false);

  const r = props.selectedItem;
  const s = props.selectedUser;
  // console.log('r', r);
  // console.log('s', s);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const res = await fb.db.ref('items/admin/' + s.idItem).once('value');
  //     const r1: any = [];
  //     res.forEach((el: any) => {
  //       // console.log(r.hasChildren());
  //       el.hasChildren()
  //         ? r1.push({
  //           userIdReseller: el.val().userId,
  //           userNameReseller: el.val().userName,
  //           jumlah2Item: el.val().jumlah2Item,
  //           jumlah2ItemOrder: el.val().jumlah2ItemOrder,
  //           statusOrderItem: el.val().statusOrderItem,
  //           nomorResi: el.val().nomorResi,
  //         })
  //         : ''
  //         ;
  //     });
  //     // console.log(res.val());
  //     if (res.val() !== null) {
  //       setProduk(r1);
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();

  //   return () => {
  //     fb.db.ref('items').off;
  //   };
  // }, [produk]);

  const _onKirimBarang = () => {
    fb.db.ref('items/admin/' + s.idItem + '/' + r.userIdReseller)
      .update({
        statusOrderItem: 'Barang di shipping',
        nomorResi: nomorResi,
      });
    setDlgKirimBarang(false);
    setProduk([]);
    setLoading(false);
  }

  const _showDialogKirimBarang = () => setDlgKirimBarang(true);
  const _hideDialogKirimBarang = () => setDlgKirimBarang(false);

  return (
    <View>{loading === true ? <ActivityIndicator animating={true} /> :

      <View key={r.userIdReseller}>
        <Space5 />
        <Text>
          {r.userNameReseller} : {r.statusOrderItem} / Resi : {r.nomorResi}
        </Text>
        <Space5 />
        {!!r.statusOrderItem && r.statusOrderItem === 'Pembayaran OK, proses kirim Barang' &&
          <View>
            <TextInput
              label='Nomor Resi'
              value={nomorResi}
              onChangeText={(a) => setNomorResi(a)}
            />
            <Space2 />
            <Button icon="add-circle-outline" mode="contained" onPress={_showDialogKirimBarang}
              disabled={nomorResi === ''}
            >
              Kirim Barang
            </Button>
          </View>}
        <Portal>
          <Dialog
            visible={dlgKirimBarang}
            onDismiss={_hideDialogKirimBarang}>
            <Dialog.Title>Notify</Dialog.Title>
            <Dialog.Content>
              <Paragraph>Barang {r.userNameReseller} sudah dikirim?</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button mode="contained" onPress={() => _onKirimBarang()}>OK</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    }
    </View>
  )
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