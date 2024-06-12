"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { selectEncryptedSummonerId, setSummonerId } from "@/features/summonerIdSlice";

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
  // const summonerName = useSelector(selectSummonerName);
  const dispatch = useDispatch();

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
        

        dispatch(setSummonerId({
          encryptedSummonerId: data.id,
          encryptedAccountId: data.accountId,
          puuid: data.puuid,
          profileIconId: data.profileIconId,
          summonerLevel: data.summonerLevel,
          revisionDate: data.revisionDate
        }));

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
      // console.log("data", accountData)
    }
  }, [summonerData]);

  return (
    <div className="flex w-full h-[300px] bg-neutral-800 justify-center">
      <div className="flex w-2/3 h-full pt-8">
        <div className="relative w-[100px] h-[100px]">
          <Image 
            src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/profileicon/${summonerData?.profileIconId}.png`}
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
          <span className="text-white">{accountData?.gameName}</span>
          <span className="text-neutral-400">#{accountData?.tagLine}</span>
          <Button className="flex flex-col mt-3" variant="default">전적 갱신</Button>
          <span>Lv {summonerData?.summonerLevel}</span>
        </div>
      </div>
    </div>
  )
}