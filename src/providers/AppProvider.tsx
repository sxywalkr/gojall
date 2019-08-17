import React, { useReducer } from 'react';
import { AppContext } from '../contexts';
import { IUser, IProduk } from '../types';

const AppConsumer = AppContext.Consumer;

interface IAction {
  type: 'reset-user' | 'set-user' | 'change-theme-mode' |
  'produk-reset' | 'produk-tambah' |
  'set-user-token' | 'set-user-app'
  ;
  payload: any;
}

interface IProps {
  navigation?: any;
  children?: any;
}

export interface IState {
  user: IUser;
  produk: IProduk;
}

const initialState: IState = {
  user: {
    displayName: '',
    age: 0,
    job: '',
  },
  produk: {
    namaItem: '',
    kategoriItem: '',
    harga1Item: 0,
    harga2Item: 0,
    jumlah1Item: 0,
    jumlah2Item: 0,
  }
};

const reducer = (state: IState, action: IAction) => {
  switch (action.type) {
    case 'reset-user':
      return { ...state, user: initialState.user };
    case 'set-user':
      return { ...state, user: action.payload };
    case 'change-theme-mode':
      return { ...state, theme: action.payload.theme };
    case 'produk-reset':
      return { ...state, produk: initialState.produk };
    case 'produk-tambah':
      return { ...state, produk: action.payload };
    case 'set-user-token':
      return { ...state, appUserToken: action.payload };
    case 'set-user-app':
      return { ...state, appUser: action.payload };
    default:
      return null;
  }
};

function AppProvider(props: IProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
}

export { AppConsumer, AppProvider, AppContext };
