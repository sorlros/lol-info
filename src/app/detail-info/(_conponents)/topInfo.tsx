"use client";

import { selectPuuid } from "@/features/summonerSlice";
import { RootState } from "@/redux/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export const TopInfo = () => {
  const summonerInfo = useSelector((state: RootState) => state.summoner)
  const puuid = summonerInfo.puuid;
  const summonerName = summonerInfo.summonerName;

  useEffect(() => {
    const fetchSummonerInfo = async (puuid: string) => {
      try {
        const response = await fetch(`/api/summoner/${puuid}`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("matches fetching 오류");
        }

        const data = await response.json();
      } catch (error) {
        toast.error("소환사 정보를 불러오지 못했습니다.");
      }
    }

    if (puuid && typeof puuid === "string") {
      fetchSummonerInfo(puuid);
    }
  }, [])

  return (
    <div className="flex flex-col w-full h-[300px] bg-neutral-700">
      Profile
      {
    // "id": "9vSkX-_v6-tzzZjjNySaIlODXkawxnxJA454uAWMWhrt7w",
    // "accountId": "2MhsBzVYuF_lB37tlfV4KoiWpevDhKjPlQDedBtKElvM",
    // "puuid": "H5Z8NlV9038dZw9ZnCvO55WsHqQqK5skSH-WeFegTH2HpTIezp2DvxfIrNnFqCqDbdW8tcsscEV5xw",
    // "profileIconId": 5089,
    // "revisionDate": 1715954627000,
    // "summonerLevel": 160
}
    </div>
  )
}