"use client";

import { Match } from '@/types/types';
import { useRouter, usePathname } from 'next/navigation';
import { stringify } from 'querystring';
import { useEffect, useId, useState } from 'react';
import { toast } from 'sonner';
import { UserChampInfo } from '../(_conponents)/userChampInfo';
import { RecentGames } from '../(_conponents)/recentGames';
import { TopInfo } from '../(_conponents)/topInfo';

const DetailPage = () => {
  const [matchIds, setMatchIds] = useState<string[]>([]);
  const [matchInfos, setMatchInfos] = useState<Match[]>([]);
  const [puuid, setPuuid] = useState<string>("");
  
  const pathname = usePathname();

  useEffect(() => {
    const fetchMatchIds = async (puuid: string) => {
      try {
        const response = await fetch(`/api/matches/${puuid}`, {
          method: "GET"
        })

        if (!response.ok) {
          throw new Error("matches fetching 오류");
        }

        const data = await response.json();
        setMatchIds(data);
      } catch (error) {
        console.error("error fetching matches", error);
      }
    }
    
    if (pathname) {
      const parts = pathname.split("/");
      const puuid = parts.pop();
      setPuuid(puuid as string);

      if (puuid) {
        fetchMatchIds(puuid);
      }
    }
  }, [pathname])

  useEffect(() => {
    const fetchMatchInfos = async (matchIds: string[]) => {
      try {
        const newDataArray = await Promise.all(
          matchIds.map(async (matchId) => {
            const response = await fetch(`/api/match-info/${matchId}`, {
              method: "GET"
            });
            if (!response.ok) {
              throw new Error("matchInfo fetching 오류");
            }
            const data = await response.json();
            return data;
          })
        );
        setMatchInfos(newDataArray);
      } catch (error) {
        console.error("error fetching match info", error);
      }
    };

    if (matchIds.length > 0) {
      fetchMatchInfos(matchIds);
    }
  }, [matchIds]);

  useEffect(() => {
    console.log("INFOS", matchInfos)
  }, [matchInfos])
  return (
    <>
    <div className="flex flex-col min-w-full h-full bg-[#1C1C1F]">
      <TopInfo puuid={puuid}/>
      <div className="flex items-center justify-center w-full h-full bg-[#1C1C1F] mt-2">
        <div className="flex w-2/3 h-full space-x-2">
          
          <UserChampInfo />
          <RecentGames matchInfos={matchInfos} puuid={puuid}/>
        </div>
      </div>
    </div>
    </>
  )
}

export default DetailPage;