import { SHOW_DRAWER } from '../constants';

const initialState = {
  showDrawer: false
};

export default function setting(state = initialState, action) {
  switch (action.type) {
    case SHOW_DRAWER:
      return {
        ...state,
        showDrawer: action.payload
      };
    default:
      return state;
  }
}
