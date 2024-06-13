"use client";

import { Match } from '@/types/types';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { stringify } from 'querystring';
import { useEffect, useId, useState } from 'react';
import { toast } from 'sonner';
import { UserChampInfo } from '../(_conponents)/userChampInfo';
import { RecentGames } from '../(_conponents)/recentGames';
import { TopInfo } from '../(_conponents)/topInfo';

interface DataProps {
  puuid: string;
  gameName: string;
  tagLine: string;
}

const DetailPage = () => {
  const [matchIds, setMatchIds] = useState<string[]>([]);
  const [matchInfos, setMatchInfos] = useState<Match[]>([]);
  const [data, setData] = useState<DataProps>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const pathname = usePathname();
  // const [puuid, setPuuid] = useState<string>("");

  const searchParams = useSearchParams();
  // const params = new URL(document.location).searchParams;

  if (pathname) {
      const parts = pathname.split("/");
      console.log("parts", parts)
      const pathnames = parts.pop();
      if (pathnames) {
        const [puuid, gameName, tagLine] = pathnames.split("_");
        console.log("puuid:", puuid);
        console.log("gameName:", gameName);
        console.log("tagLine:", tagLine);
      }
    
      // setPuuid(puuid as string);
  }

  useEffect(() => {
    const fetchMatchIds = async () => {
      const puuid_gameName_tagLine = searchParams ? searchParams.get('puuid_gameName_tagLine') : null;
      console.log("searchParams", searchParams);

      if (!puuid_gameName_tagLine) {
        console.error("Invalid parameters");
        setIsLoading(false);
        return;
      }

      const [puuid, gameName, tagLine] = puuid_gameName_tagLine.split('_');
      setData({puuid, gameName, tagLine});
      console.log("DATA", data)

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
      } finally {
        setIsLoading(false);
      }
    }
  
    
    // if (pathname) {
    //   const parts = pathname.split("/");
    //   const puuid = parts.pop();
    //   setPuuid(puuid as string);

    //   if (puuid) {
    //     fetchMatchIds(puuid);
    //   }
    // }
      fetchMatchIds();
  }, [searchParams])

  
  // const puuid_gameName_tagLine = searchParams ? searchParams.get('puuid_gameName_tagLine') : null;

  // if (!puuid_gameName_tagLine) {
  //   return <div>Invalid parameters</div>;
  // }

  // const [puuid, gameName, tagLine] = puuid_gameName_tagLine.split('_');
  
  // const pathname = usePathname();

 

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
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Invalid parameters</div>;
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