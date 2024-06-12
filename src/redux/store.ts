import summonerIdSlice from "@/features/summonerIdSlice";
import summonerSlice from "@/features/summonerSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({ 
  reducer: {
    summoner: summonerSlice,
    summonerId: summonerIdSlice,
  }
});

export type RootState = ReturnType<typeof store.getState>;