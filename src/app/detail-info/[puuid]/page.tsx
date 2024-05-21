"use client";

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const DetailPage = () => {
  const [matchIds, setMatchIds] = useState<string[]>([""]);
  const [matchInfos, setMatchInfos] = useState<any[]>([]);
  
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
      
      if (puuid) {
        fetchMatchIds(puuid);
      }
    }
  }, [pathname])

  useEffect(() => {
    const fetchMatchInfos = async (matchIds: string[]) => {
      try {
        const responses = await Promise.all(
          matchIds.map(matchId =>
            fetch(`/api/match-info/${matchId}`, {
              method: "GET"
            })
          )
        );

        const data = await Promise.all(
          responses.map(response => {
            if (!response.ok) {
              throw new Error("matchInfo fetching 오류");
            }
            return response.json();
          })
        );

        setMatchInfos(data);
      } catch (error) {
        console.error("error fetching match info", error);
      }
    };

    if (matchIds.length > 0) {
      fetchMatchInfos(matchIds);
      console.log("INFOS", matchInfos)
    }
  }, [matchIds]);

  return (
    <div>
      {matchInfos.map(matchInfo => (
        <div key={matchInfo.id}>{matchInfo.metadata.matchId}</div>
      ))}
    </div>
  )
}

export default DetailPage;