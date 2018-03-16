
import { getAdminList, addManagerApi } from '../services/api';

export default {
  namespace: 'admin',

  state: {
    status: undefined,
  },

  effects: {
    *getlist({ payload }, { call, put }) {
      console.log('getlist', payload);
      const response = yield call(getAdminList, payload);
      console.log('getlist', response);
      if (response) {
        yield put({
          type: 'changeList',
          payload: response,
        });
      } else {
        yield put({
          type: 'changeList',
          payload: {},
        });
      }
    },
    *addManager({ payload }, { put, call }) {
      console.log('addManager', payload);
      const response = yield call(addManagerApi, payload);
      console.log('addManager', response);
      if (response) {
        yield put({
          type: 'getlist',
          payload: response,
        });
      } else {
        yield put({
          type: 'getlist',
          payload: {},
        });
      }
    },
  },

  reducers: {
    changeList(state, { payload }) {
      console.log('admin/changeList', state, payload);
      if (payload === undefined) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        dataSource: payload.content || [],
      };
    },
    addList(state, { payload }) {
      console.log('admin/addList', state, payload);
      if (payload === undefined) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        dataSource: [payload] || [],
      };
    },
  },
};
