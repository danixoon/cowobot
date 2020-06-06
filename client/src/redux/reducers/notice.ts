import { Reducer } from "redux";
import { ActionTypes, UserState, ServiceState, NoticeState } from "../types";
import { v4 as uuid } from "uuid";
import avatarUrl from "../../images/avatar.png";
import { setAction, setError } from "../store";

const defaultState: () => NoticeState = () => ({
  action: null,
  error: null,
  notices: [],
  // noticesWithData: [],
  // noti
  // data: {
  //   action: null,
  //   error: null,
  //   queries: [],
  //   values: [],
  // },
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
      return {
        ...state,
        notices: [
          ...state.notices,
          { ...setAction(), ...action.payload, randomId: uuid() },
        ],
      };
    case ActionTypes.NOTICE_ADD_LOADING:
      return {
        ...state,
        notices: state.notices.map((notice) =>
          notice.randomId === action.payload.randomId
            ? { ...notice, ...setAction("add") }
            : notice
        ),
      };
    case ActionTypes.NOTICE_ADD_SUCCESS:
      return {
        ...state,
        notices: state.notices.map((notice) =>
          notice.randomId === action.payload.randomId
            ? { ...action.payload, ...setAction() }
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
      return {
        ...state,
        notices: state.notices.map((notice) =>
          notice.id === action.payload.noticeId
            ? { ...notice, ...setAction("delete") }
            : notice
        ),
      };
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
    case ActionTypes.NOTICE_FETCH_LOADING:
      return {
        ...state,
        notices: state.notices.map((notice) =>
          notice.id === action.payload.noticeId
            ? { ...notice, ...setAction("fetch") }
            : notice
        ),
      };
    case ActionTypes.NOTICE_FETCH_SUCCESS:
      return {
        ...state,
        notices: state.notices.map((notice) =>
          notice.id === action.payload.id
            ? { ...setAction(), ...action.payload }
            : notice
        ),
        ...setAction(),
      };
    case ActionTypes.NOTICE_FETCH_ERROR:
      return {
        ...state,
        ...setError(action.payload),
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
        notices: action.payload.map((notice) => ({
          ...setAction(),
          ...notice,
          values: [],
          queries: [],
        })),
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
