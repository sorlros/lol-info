"use client";

import { selectPuuid } from "@/features/summonerSlice";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import Image from 'next/image';

interface TopInfoProps {
  puuid: string;
}

interface SummonerDataProps {
  id: string;
  accountId: string;
  profileIconId: number;
  puuid: string;
  revisionData: number;
  summonerLevel: number;
}

export const TopInfo = ({puuid}: TopInfoProps) => {
  const [summonerData, setSummonerData] = useState<SummonerDataProps>();

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
        setSummonerData(data);
      } catch (error) {
        // toast.error("소환사 정보를 불러오지 못했습니다.");
        console.error("소환사 정보를 불러오지 못했습니다.");
      }
    }

    if (puuid) {
      fetchSummonerInfo(puuid);
    }
  }, [puuid])

  useEffect(() => {
    if (summonerData) {
      console.log("summonerData", summonerData);
    }
  }, [summonerData]);

  return (
    <div className="flex w-full h-[300px] bg-[#28344E]">
      Profile
      {summonerData?.profileIconId}
      <Image 
        src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/profileicon/${summonerData?.profileIconId}.png`}
        alt="소환사 아이콘"
        width={500} // 원하는 너비 설정
        height={300} // 원하는 높이 설정
      />
      
    {/* // "id": "9vSkX-_v6-tzzZjjNySaIlODXkawxnxJA454uAWMWhrt7w",
    // "accountId": "2MhsBzVYuF_lB37tlfV4KoiWpevDhKjPlQDedBtKElvM",
    // "puuid": "H5Z8NlV9038dZw9ZnCvO55WsHqQqK5skSH-WeFegTH2HpTIezp2DvxfIrNnFqCqDbdW8tcsscEV5xw",
    // "profileIconId": 5089,
    // "revisionDate": 1715954627000,
    // "summonerLevel": 160 */}
    </div>
  )
}