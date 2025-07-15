import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isUserLoggedIn: false,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setIsUSerLoggedIn: (state, action) => {
      state.isUserLoggedIn = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setIsUSerLoggedIn, setLoading } = userSlice.actions;

// Async thunk to check for token and update login state
export const getUser = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const token = await AsyncStorage.getItem("token");
    if (token) {
      dispatch(setIsUSerLoggedIn(true));
    } else {
      dispatch(setIsUSerLoggedIn(false));
    }
  } catch (error) {
    dispatch(setIsUSerLoggedIn(false));
  } finally {
    dispatch(setLoading(false));
  }
};

export default userSlice.reducer;
