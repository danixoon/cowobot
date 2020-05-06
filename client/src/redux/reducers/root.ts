import { Reducer } from "redux";

const defaultState = () => ({ owo: true });

const rootReducer: Reducer = (state = defaultState(), action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default rootReducer;
