

import { RootState } from "@/redux/store";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SummonerState {
  summonerName: string;
  puuid: string;
  tagLine: string;
  profileIconId: number;
  summonerLevel: number;
}

const initialState: SummonerState = {
  summonerName: "",
  puuid: "",
  tagLine: "",
  profileIconId: 0,
  summonerLevel: 0,
}

const summonerSlice = createSlice({
  name: "summoner",
  initialState,
  reducers: {
    setSummoner: (state, action: PayloadAction<SummonerState>) => {
      state.summonerName = action.payload.summonerName;
      state.puuid = action.payload.puuid;
      state.tagLine = action.payload.tagLine;
      state.profileIconId = action.payload.profileIconId;
      state.summonerLevel = action.payload.summonerLevel;
    }
  }
})

export const { setSummoner } = summonerSlice.actions;
export default summonerSlice.reducer;

export const selectSummoner = (state: RootState) => state.summoner;
export const selectSummonerName = createSelector(selectSummoner, (summoner) => summoner.summonerName);
export const selectPuuid = createSelector(selectSummoner, (summoner) => summoner.puuid);
export const selectTagLine = createSelector(selectSummoner, (summoner) => summoner.tagLine);
// export const selectPuuid = createSelector(selectSummoner, (summoner) => summoner.puuid);
// export const selectTagLine = createSelector(selectSummoner, (summoner) => summoner.tagLine);