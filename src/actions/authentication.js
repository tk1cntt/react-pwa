import axios from 'axios';

export const ACTION_TYPES = {
  LOGIN: 'authentication/LOGIN',
  GET_SESSION: 'authentication/GET_SESSION',
  LOGOUT: 'authentication/LOGOUT',
  CLEAR_AUTH: 'authentication/CLEAR_AUTH',
  ERROR_MESSAGE: 'authentication/ERROR_MESSAGE'
};

export const displayAuthError = message => ({ type: ACTION_TYPES.ERROR_MESSAGE, message });

export const getSession = () => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.GET_SESSION,
    payload: axios.get('api/account')
  });

  const { account } = getState().authentication;
  if (account && account.langKey) {
    const langKey = Storage.session.get('locale', account.langKey);
    await dispatch(setLocale(langKey));
  }
};

export const login = (username, password, rememberMe = false) => async (dispatch, getState) => {
  const result = await dispatch({
    type: ACTION_TYPES.LOGIN,
    payload: axios.post('api/authenticate', { username, password, rememberMe })
  });
  const bearerToken = result.value.headers.authorization;
  if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
    const jwt = bearerToken.slice(7, bearerToken.length);
    console.log(jwt);
  }
  await dispatch(getSession());
};

export const fblogin = (code, rememberMe = false) => async (dispatch, getState) => {
  const result = await dispatch({
    type: ACTION_TYPES.LOGIN,
    payload: axios.get('api/token-exchange?code=' + code)
  });
  const bearerToken = result.value.headers.authorization;
  if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
    const jwt = bearerToken.slice(7, bearerToken.length);
    console.log(jwt);
  }
  await dispatch(getSession());
};

export const clearAuthToken = () => {
  console.log("clearAuthToken");
};

export const logout = () => dispatch => {
  clearAuthToken();
  dispatch({
    type: ACTION_TYPES.LOGOUT
  });
};

export const clearAuthentication = messageKey => (dispatch, getState) => {
  clearAuthToken();
  dispatch(displayAuthError(messageKey));
  dispatch({
    type: ACTION_TYPES.CLEAR_AUTH
  });
};
