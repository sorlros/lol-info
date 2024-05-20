

import { RootState } from "@/redux/store";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SummonerState {
  gameName: string;
  puuid: string;
  tagLine: string;
}

const initialState: SummonerState = {
  gameName: "",
  puuid: "",
  tagLine: "",
}

const summonerSlice = createSlice({
  name: "summoner",
  initialState,
  reducers: {
    setSummoner: (state, action: PayloadAction<SummonerState>) => {
      state.gameName = action.payload.gameName;
      state.puuid = action.payload.puuid;
      state.tagLine = action.payload.tagLine;
    }
  }
})

export const { setSummoner } = summonerSlice.actions;
export default summonerSlice.reducer;

export const selectSummoner = (state: RootState) => state.summoner;
export const selectGameName = createSelector(selectSummoner, (summoner) => summoner.gameName);
export const selectPuuid = createSelector(selectSummoner, (summoner) => summoner.puuid);
export const selectTagLine = createSelector(selectSummoner, (summoner) => summoner.tagLine);