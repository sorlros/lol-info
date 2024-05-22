"use client";

import { useRouter, usePathname } from 'next/navigation';
import { stringify } from 'querystring';
import { useEffect, useId, useState } from 'react';
import { toast } from 'sonner';

// interface 별도로 저장할 것
interface Match {
  metadata: MetaData;
  info: Info
}
interface MetaData {
  dataVersion: string;
  matchId: string;
  participants: Array<string>;
}

interface Participant {
  assists: number;
  bountyLevel: number;
  champExperience: number;
  championName: string;
  damageDealtToTurrets: number;
  deaths: number;
  detectorWardsPlaced: number;
  doubleKills: number;
  goldEarned: number;
  individualPosition: string;
  kills: number;
  lane: string;
  magicDamageDealtToChampions: number;
  magicDamageTaken: number;
  pentaKills: number;
  physicalDamageDealtToChampions: number;
  physicalDamageTaken: number;
  quadraKills: number;
  role: string;
  summonerName: string;
  timePlayed: number;
  totalDamageDealtToChampions: number;
  totalDamageTaken: number;
  totalHeal: number;
  tripleKills: number;
  turretKills: number;
  visionScore: number;
  wardsKilled: number;
}
interface Info {
  gameMode: string;
  gameType: string;
  participants: Array<Participant>
}
const DetailPage = () => {
  const [matchIds, setMatchIds] = useState<string[]>([]);
  const [matchInfos, setMatchInfos] = useState<Match[]>([]);
  
  const pathname = usePathname();
  const id = useId();

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
        setMatchInfos(prevMatchInfos => [...prevMatchInfos, ...newDataArray]); 
        // console.log("INFOS", matchInfos)
      } catch (error) {
        console.error("error fetching match info", error);
      }
    };

    if (matchIds.length > 0) {
      fetchMatchInfos(matchIds);
    }
  }, [matchIds]);

  return (
    <div>
      {matchInfos.map((matchInfo, index) => (
        <div key={index}>
          <h2>Match {index + 1}</h2>
          <p>Match ID: {matchInfo.metadata.matchId}</p>
          <p>Game Mode: {matchInfo.info.gameMode}</p>
          <p>Participants:</p>
          <ul>
            {matchInfo.info.participants.map((participant, idx) => (
              <li key={idx}>
                <p>Summoner Name: {participant.summonerName}</p>
                <p>Champion: {participant.championName}</p>
                <p>Kills: {participant.kills}</p>
                <p>Deaths: {participant.deaths}</p>
                <p>Assists: {participant.assists}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default DetailPage;