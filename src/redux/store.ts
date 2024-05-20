import summonerSlice from "@/features/summonerSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({ 
  reducer: {
    summoner: summonerSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;