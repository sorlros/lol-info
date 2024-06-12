

import { RootState } from "@/redux/store";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SummonerIdState {
  encryptedSummonerId: string;
  encryptedAccountId: string;
  profileIconId: number;
  puuid: string;
  revisionDate: number;
  summonerLevel: number;
}

const initialState: SummonerIdState = {
  encryptedSummonerId: "",
  encryptedAccountId: "",
  revisionDate: 0,
  puuid: "",
  profileIconId: 0,
  summonerLevel: 0,
}

const summonerIdSlice = createSlice({
  name: "summonerId",
  initialState,
  reducers: {
    setSummonerId: (state, action: PayloadAction<SummonerIdState>) => {
      state.encryptedSummonerId = action.payload.encryptedSummonerId;
      state.encryptedAccountId = action.payload.encryptedAccountId;
      state.revisionDate = action.payload.revisionDate;
      state.puuid = action.payload.puuid;
      state.profileIconId = action.payload.profileIconId;
      state.summonerLevel = action.payload.summonerLevel;
    }
  }
})

export const { setSummonerId } = summonerIdSlice.actions;
export default summonerIdSlice.reducer;

export const selectSummonerId = (state: RootState) => state.summonerId;
export const selectPuuid = createSelector(selectSummonerId, (summonerId) => summonerId.puuid);
export const selectEncryptedSummonerId = createSelector(selectSummonerId, (summonerId) => summonerId.encryptedSummonerId);
export const selectEncryptedAccountId = createSelector(selectSummonerId, (summonerId) => summonerId.encryptedAccountId);
export const selectProfileIconId = createSelector(selectSummonerId, (summonerId) => summonerId.profileIconId);
export const selectSummonerLevel = createSelector(selectSummonerId, (summonerId) => summonerId.summonerLevel);
export const selectRevisionDate = createSelector(selectSummonerId, (summonerId) => summonerId.revisionDate);
