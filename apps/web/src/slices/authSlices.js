import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    magicLink: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setMagicLink(state, value) {
            state.magicLink = value.payload;
        }
    }
});

export const { setMagicLink } = authSlice.actions;

export default authSlice.reducer;