
import { getLiuhai, addLiuhaiApi, getLiuhaiSeriesList } from '../services/api';

export default {
  namespace: 'liuhai',

  state: {
    status: undefined,
  },

  effects: {
    *getlist({ payload }, { call, put }) {
      console.log('getlist', payload);
      const response = yield call(getLiuhai, payload);
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
    *getSeriesList({ payload }, { call, put }) {
      console.log('getSeriesList', payload);
      const response = yield call(getLiuhaiSeriesList, payload);
      console.log('getSeriesList', response);
      if (response) {
        yield put({
          type: 'changeSeriesList',
          payload: response,
        });
      } else {
        yield put({
          type: 'changeSeriesList',
          payload: {},
        });
      }
    },
    *addLiuhai({ payload }, { put, call }) {
      console.log('addLiuhai', payload);
      const response = yield call(addLiuhaiApi, payload);
      console.log('addLiuhai', response);
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
      console.log('liuhai/changeList', state, payload);
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
      console.log('liuhai/addList', state, payload);
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
    changeSeriesList(state, { payload }) {
      console.log('getSeriesListReducer', payload);
      if (payload !== undefined && payload.content !== undefined) {
        return {
          ...state,
          seriesList: payload.content,
        };
      }
      return {
        ...state,
        seriesList: [],
      };
    },
  },
};
