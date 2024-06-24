"use client";

import { Match } from '@/types/types';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { stringify } from 'querystring';
import { useEffect, useId, useState } from 'react';
import { toast } from 'sonner';
import { UserChampInfo } from '../(_conponents)/userChampInfo';
import { RecentGames } from '../(_conponents)/recentGames';
import { TopInfo } from '../(_conponents)/topInfo';
import PageSkeleton from '@/components/skeleton/pageSkeleton';

interface DataProps {
  puuid: string;
  gameName: string;
  tagLine: string;
}

const DetailPage = () => {
  const [matchIds, setMatchIds] = useState<string[]>([]);
  const [matchInfos, setMatchInfos] = useState<Match[]>([]);
  const [data, setData] = useState<DataProps | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(true);
    if (pathname) {
      const parts = pathname.split("/");
      const pathnames = parts.pop();
      if (pathnames) {
        const [puuid, gameName, tagLine] = pathnames.split("&");
        console.log(":::::", puuid, gameName, tagLine)
        if (puuid && gameName && tagLine) {
          setData({ 
            puuid, 
            gameName: decodeURIComponent(gameName), 
            tagLine 
          });
          setIsLoading(false);
        } else {
          console.error("Invalid parameters in path");
          setIsLoading(false);
          return;
        }
      }
    }
  }, [pathname]);

  useEffect(() => {
    const fetchMatchIds = async () => {
      setIsLoading(true);

      if (data?.puuid) {
        const puuid = data.puuid;
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
          console.error("matches fetching error", error);
        } finally {
          setIsLoading(false);
        }
      } 
    }
    if (data) {
      fetchMatchIds();
    }
  }, [data])
 

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

  if (isLoading) {
    return (
      <PageSkeleton />
    )
  }

  if (!data) {
    return (
      <PageSkeleton />
    )
  }

  return (
    <>
      <div className="flex flex-col min-w-full h-full bg-[#1C1C1F]">
        <TopInfo puuid={data.puuid} gameName={data.gameName} tagLine={data.tagLine} />
        <div className="flex items-center justify-center w-full h-full bg-[#1C1C1F] mt-2">
          <div className="flex w-[1080px] h-full space-x-2">
            <UserChampInfo />
            <RecentGames matchInfos={matchInfos} puuid={data.puuid}/>
          </div>
        </div>
      </div>
    </>
  )
}

export default DetailPage;