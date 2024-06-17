"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { selectEncryptedSummonerId, selectSummonerId, setSummonerId } from "@/features/summonerIdSlice";
import { selectSummoner, setSummoner } from "@/features/summonerSlice";

interface TopInfoProps {
  puuid: string;
  gameName: string;
  tagLine: string;
}
interface AccountDataProps {
  puuid: string;
  gameName: string;
  tagLine: string;
}

interface SummonerDataProps {
  gameName: string;
  tagLine: string;
  profileIconId: number;
  summonerLevel: number;
}

export const TopInfo = ({puuid, gameName, tagLine}: TopInfoProps) => {
  const [summonerData, setSummonerData] = useState<SummonerDataProps | null>(null);
  const [accountData, setAccountData] = useState<AccountDataProps>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const dispatch = useDispatch();
  const summonerInfo = useSelector(selectSummonerId);

  useEffect(() => {
    const fetchSummonerInfo = async () => {
      try {
        // 서버에서 소환사 정보를 가져오는 API 호출
        const summonerResponse = await fetch(`/api/summoner/${puuid}`, {
          method: "GET",
        });

        if (!summonerResponse.ok) {
          throw new Error("소환사 정보를 불러오지 못했습니다.");
        }

        const summonerData = await summonerResponse.json();

        console.log("ASDASD", summonerData)

        dispatch(setSummonerId({
          encryptedSummonerId: summonerData.id,
          encryptedAccountId: summonerData.accountId,
          puuid: summonerData.puuid,
          profileIconId: summonerData.profileIconId,
          summonerLevel: summonerData.summonerLevel,
          revisionDate: summonerData.revisionDate,
        }));

        setIsLoading(false);
      } catch (error) {
        console.error("소환사 정보를 불러오지 못했습니다.", error);
      }
    };

    fetchSummonerInfo();
  }, [puuid, dispatch]);

  if (isLoading) {
    return (
      <div className="flex w-full h-[300px] bg-neutral-800 justify-center items-center">
        <span className="text-white">Loading...</span>
      </div>
    );
  }

  const { profileIconId, summonerLevel } = summonerInfo;
  // const { gameName, tagLine } = summonerInfo2;

  return (
    <div className="flex w-full h-[300px] bg-neutral-800 justify-center">
      <div className="flex w-2/3 h-full pt-8">
        <div className="relative w-[100px] h-[100px]">
          <Image 
            src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/profileicon/${profileIconId}.png`}
            // objectFit="cover"
            width={100}
            height={100}
            style={{ width: "auto", height: "auto" }}
            // objectFit="contain"
            alt="소환사 아이콘"
            className="rounded-lg"
            priority
          />
        </div>
        <div className="w-[700px] h-full pl-4 text-2xl">
          <span className="text-white">{gameName}</span>
          <span className="text-neutral-400">#{tagLine}</span>
          <Button className="flex flex-col mt-3" variant="default">전적 갱신</Button>
          <span>Lv {summonerLevel}</span>
        </div>
      </div>
    </div>
  )
}