"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { selectEncryptedSummonerId, selectSummonerId, setSummonerId } from "@/features/summonerIdSlice";
import { selectSummoner, setSummoner } from "@/features/summonerSlice";
import TopInfoSkeleton from "@/components/skeleton/topInfoSkeleton";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  
  const dispatch = useDispatch();
  const summonerInfo = useSelector(selectSummonerId);

  useEffect(() => {
    const fetchSummonerInfo = async () => {
      try {
        setIsLoading(true);
        // 서버에서 소환사 정보를 가져오는 API 호출
        const summonerResponse = await fetch(`/api/summoner/${puuid}`, {
          method: "GET",
        });

        if (!summonerResponse.ok) {
          throw new Error("소환사 정보를 불러오지 못했습니다.");
        }

        const summonerData = await summonerResponse.json();

        // console.log("ASDASD", summonerData)

        dispatch(setSummonerId({
          encryptedSummonerId: summonerData.id,
          encryptedAccountId: summonerData.accountId,
          puuid: summonerData.puuid,
          profileIconId: summonerData.profileIconId,
          summonerLevel: summonerData.summonerLevel,
          revisionDate: summonerData.revisionDate,
        }));
      } catch (error) {
        console.error("소환사 정보를 불러오지 못했습니다.", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummonerInfo();
  }, [puuid, dispatch]);

  if (isLoading) {
    return (
      <TopInfoSkeleton />
    );
  }

  const { profileIconId, summonerLevel } = summonerInfo;

  const handleRefresh = () => {
    router.push(window.location.href);
  };
  

  return (
    <div className="flex w-full h-[250px] bg-neutral-800 justify-center">
      <div className="flex w-2/3 h-full pt-8">
        <div className="relative w-[100px] h-[100px]">
          <Image 
            src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/profileicon/${profileIconId}.png`}
            // objectFit="cover"
            width={100}
            height={100}
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
            // objectFit="contain"
            alt="소환사 아이콘"
            className="rounded-lg"
            priority
          />
          <span className="flex w-[40px] h-[20px] absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-[10px] rounded-lg text-white bg-neutral-500 items-center justify-center">{summonerLevel}</span>
        </div>
        <div className="w-[700px] h-full pl-4 text-2xl">
          <span className="text-white">{gameName}</span>
          <span className="text-neutral-400">#{tagLine}</span>
          <Button onClick={handleRefresh} className="flex flex-col mt-3" variant="default">전적 갱신</Button>
        </div>
      </div>
    </div>
  )
}