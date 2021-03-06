import axios from "axios";
import history from "../history";

/**
 * ACTION TYPES
 */

const GOT_USER = "GOT_USER";
const REMOVED_USER = "REMOVED_USER";

/**
 * ACTION CREATORS
 */

const gotUser = (user) => ({
  type: GOT_USER,
  user,
});

const removedUser = () => ({
  type: REMOVED_USER,
});

/**
 * THUNK
 */

export const auth = (
  email,
  password,
  method,
  firstName = null,
  lastName = null
) => async (dispatch) => {
  let res;
  try {
    res = firstName
      ? await axios.post(`/auth/${method}`, {
          firstName,
          lastName,
          email,
          password,
        })
      : await axios.post(`/auth/${method}`, { email, password });
  } catch (authError) {
    dispatch(gotUser({ error: authError }));
  }
  try {
    dispatch(gotUser(res.data.user));
    history.push("/portfolio");
    localStorage.setItem("token", res.data.token);
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr);
  }
};

// confirms the authenticated user on state
export const me = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(gotUser(res.data));
  } catch (err) {
    dispatch(gotUser(defaultUser));
    history.push("/login");
    console.error(err);
  }
};

export const logout = () => async (dispatch) => {
  try {
    localStorage.removeItem("token");
    await axios.post("/auth/logout");
    dispatch(removedUser());
    history.push("/login");
  } catch (err) {
    console.error(err);
  }
};

/**
 * INITIAL STATE
 */

const defaultUser = {};

/**
 * REDUCER
 */

export default function (state = defaultUser, action) {
  switch (action.type) {
    case GOT_USER:
      if (!state.id) {
        return action.user;
      } else {
        return { ...state, cash: action.user.cash };
      }
    case REMOVED_USER:
      return defaultUser;
    default:
      return state;
  }
}
