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
        console.log('login', 'd');
        if (response !== undefined) {
          console.log('login', response.status);
        }
        // response 有可能是undefined 出现错误的情况 是没有返回结果的 没有返回结果就undefined 所以要加一个判断
        if (response !== undefined && response.token !== undefined) {
          console.log('login', 'e');
          reloadAuthorized();
          yield put(routerRedux.push('/'));
        }
      } catch (e) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            state: 'error',
          },
        });
        reloadAuthorized();
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
      if (payload === undefined) {
        return {
          ...state,
          status: 'error',
          type: 'account',
        };
      }
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
