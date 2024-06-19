import { RootState } from "@/redux/store";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MatchInfoState {
  matchIds: string[];
}

const initialState: MatchInfoState = {
  matchIds: []
}

const matchInfoSlice = createSlice({
  name: "matchInfo",
  initialState,
  reducers: {
    setMatchInfo: (state, action: PayloadAction<MatchInfoState>) => {
      state.matchIds = action.payload.matchIds;
    }
  }
})

export const { setMatchInfo } = matchInfoSlice.actions;
export default matchInfoSlice.reducer;

export const selectMatchInfo = (state: RootState) => state.matchInfo;
export const selectMatchIds = createSelector(selectMatchInfo, (matchInfo) => matchInfo.matchIds);
