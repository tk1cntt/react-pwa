/* eslint-disable import/prefer-default-export */

import { SHOW_DRAWER } from '../constants';

export default function showDrawer(value) {
  return {
    type: SHOW_DRAWER,
    payload: value
  };
};
