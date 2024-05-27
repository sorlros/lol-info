"use client";

import { selectPuuid, selectSummonerName } from "@/features/summonerSlice";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import Image from 'next/image';
import { Button } from '@/components/ui/button';

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

interface AccountDataProps {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export const TopInfo = ({puuid}: TopInfoProps) => {
  const [summonerData, setSummonerData] = useState<SummonerDataProps>();
  const [accountData, setAccountData] = useState<AccountDataProps>();
  const summonerName = useSelector(selectSummonerName);

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
    const fetchAccountInfo = async (puuid: string) => {
      try {
        const response = await fetch(`/api/account/by-puuid/${puuid}`, {
          method: "GET"
        })

        if (!response.ok) {
          throw new Error("account fetching 오류");
        }

        const accountData = await response.json();
        setAccountData(accountData);

      } catch (error) {
        console.error("소환사 정보를 불러오지 못했습니다.");
      }
    }

    if (puuid) {
      fetchAccountInfo(puuid);
    }
  }, [puuid])

  useEffect(() => {
    if (summonerData) {
      console.log("summonerData", summonerData);
      console.log("data", accountData)
    }
  }, [summonerData]);

  return (
    <div className="flex w-full h-[300px] bg-[#28344E] justify-center">
      <div className="flex w-2/3 h-full pt-8">
        <div className="relative w-[100px] h-[100px]">
          <Image 
            src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/profileicon/${summonerData?.profileIconId}.png`}
            layout="fill"
            // objectFit="contain"
            alt="소환사 아이콘"
            className="rounded-lg"
          />
        </div>
        <div className="w-[700px] h-full pl-4 text-2xl">
          <span className="text-white">{accountData?.gameName}</span><span className="text-neutral-400">#{accountData?.tagLine}</span>
          <Button className="flex flex-col mt-3" variant="default">전적 갱신</Button>
          <span>Lv {summonerData?.summonerLevel}</span>
        </div>
      </div>
      
      {/* {summonerData?.profileIconId} */}
      
      
    {/* // "id": "9vSkX-_v6-tzzZjjNySaIlODXkawxnxJA454uAWMWhrt7w",
    // "accountId": "2MhsBzVYuF_lB37tlfV4KoiWpevDhKjPlQDedBtKElvM",
    // "puuid": "H5Z8NlV9038dZw9ZnCvO55WsHqQqK5skSH-WeFegTH2HpTIezp2DvxfIrNnFqCqDbdW8tcsscEV5xw",
    // "profileIconId": 5089,
    // "revisionDate": 1715954627000,
    // "summonerLevel": 160 */}
    </div>
  )
}