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
    {/* <div>
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
                <p>게임시간: {participant.timePlayed}</p>
                <p>Champion: {participant.championName}</p>
                <p>Kills: {participant.kills}</p>
                <p>Deaths: {participant.deaths}</p>
                <p>Assists: {participant.assists}</p>
                <p>총 피해량: {participant.totalDamageDealtToChampions}</p>
                <p>더블킬: {participant.doubleKills}</p>
                <p>트리플킬: {participant.tripleKills}</p>
                <p>쿼드라킬: {participant.quadraKills}</p>
                <p>팬타킬: {participant.pentaKills}</p>
                <p>시야점수: {participant.visionScore}</p>
                <p>현상금: {participant.challenges.bountyGold}</p>
                <p>분당 데미지: {participant.challenges.damagePerMinute}</p>
                <p>분당 얻은 골드: {participant.challenges.goldPerMinute}</p>
                <p>KDA: {participant.challenges.kda}</p>
                <p>첫 10분 미니언 처치수: {participant.challenges.laneMinionsFirst10Minutes}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div> */}
    <div className="flex flex-col min-w-full min-h-full">
      <TopInfo puuid={puuid}/>
      <div className="flex items-center justify-center w-full h-full bg-[#282830] mt-2">
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