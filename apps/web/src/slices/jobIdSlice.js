import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    jobId: null,
};

const jobSlice = createSlice({
    name: "job",
    initialState: initialState,
    reducers: {
        setJobId(state, action) {
            state.jobId = action.payload;
        }
    }
});

export const { setJobId } = jobSlice.actions;

export default jobSlice.reducer;