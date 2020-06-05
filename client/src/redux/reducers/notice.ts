import { Reducer } from "redux";
import { ActionTypes, UserState, ServiceState, NoticeState } from "../types";
import avatarUrl from "../../images/avatar.png";
import { setAction, setError } from "../store";

const defaultState: () => NoticeState = () => ({
  action: null,
  error: null,
  notices: [],
  data: {
    action: null,
    error: null,
    queries: [],
    values: [],
  },
});

export const noticeReducer: Reducer<NoticeState, Action> = (
  state = defaultState(),
  action
) => {
  switch (action.type) {
    case ActionTypes.NOTICE_SAVE_LOADING:
      return { ...state, ...setAction("save") };
    case ActionTypes.NOTICE_SAVE_SUCCESS:
      return { ...state, ...setAction() };
    case ActionTypes.NOTICE_SAVE_ERROR:
      return { ...state, ...setError(action.payload) };

    case ActionTypes.NOTICE_ADD:
      return { ...state, notices: [...state.notices, action.payload] };
    case ActionTypes.NOTICE_ADD_LOADING:
      return { ...state, ...setAction("add") };
    case ActionTypes.NOTICE_ADD_SUCCESS:
      return {
        ...state,
        notices: state.notices.map((notice) =>
          notice.randomId === action.payload.randomId
            ? { ...notice, ...action.payload }
            : notice
        ),
        ...setAction(),
      };
    case ActionTypes.NOTICE_ADD_ERROR:
      return {
        ...state,
        ...setError(action.payload),
      };

    case ActionTypes.NOTICE_DELETE_LOADING:
      return { ...state, ...setAction("delete") };
    case ActionTypes.NOTICE_DELETE_SUCCESS:
      return {
        ...state,
        ...setAction(),
        notices: state.notices.filter(
          (notice) => notice.id !== action.payload.id
        ),
      };
    case ActionTypes.NOTICE_DELETE_ERROR:
      return { ...state, ...setError(action.payload) };
    case ActionTypes.NOTICE_FETCH_DATA_LOADING:
      return {
        ...state,
        data: {
          ...state.data,
          ...setAction("fetch"),
        },
      };
    case ActionTypes.NOTICE_FETCH_DATA_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload,
          ...setAction(),
        },
      };
    case ActionTypes.NOTICE_FETCH_DATA_ERROR:
      return {
        ...state,
        data: {
          ...state.data,
          ...setError(action.payload),
        },
      };
    case ActionTypes.NOTICES_FETCH_LOADING:
      return {
        ...state,
        ...setAction("fetch"),
      };
    case ActionTypes.NOTICES_FETCH_SUCCESS:
      return {
        ...state,
        ...setAction(),
        notices: action.payload,
      };
    case ActionTypes.NOTICES_FETCH_ERROR:
      return {
        ...state,
        ...setError(action.payload),
      };
    case ActionTypes.USER_LOGOUT_SUCCESS:
      return defaultState();
    default:
      return state;
  }
};
