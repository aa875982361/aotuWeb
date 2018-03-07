import { routerRedux } from 'dva/router';
import { fakeAccountLogin } from '../services/api';
import { setToken } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      // console.log('login', payload);
      try {
        const response = yield call(fakeAccountLogin, payload);
        // console.log('login', response.state, JSON.stringify(response));
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        // console.log('login/login', response.state, JSON.stringify(response));
        // Login successfully
        if (response.status === 'ok') {
          yield put(routerRedux.push('/'));
        }
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            state: 'error',
          },
        });
        yield put(routerRedux.push('/'));
      }
    },
    *logout(_, { put, select }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      if (payload.token) {
        setToken(payload.token);
      }
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
