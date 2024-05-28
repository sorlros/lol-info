import { Info, Match, MetaData } from "@/types/types";
import { useEffect, useState } from "react";
import Image from 'next/image';

interface RecentGamesProps {
  matchInfos: Match[]
}

export const RecentGames = ({matchInfos}: RecentGamesProps) => {
  const [isOpen, setIsOpen] = useState();

  useEffect(() => {
    if (matchInfos.length > 0 && matchInfos[0].info.participants.length > 0) {
      console.log("AADD", matchInfos[0].info.participants[0].championName);
    }
  }, [matchInfos]);

  return (
    <div className="flex flex-col w-2/3 min-h-screen rounded-lg bg-[#28344E]">
      {matchInfos.map((matchInfo, idx) => (
        <div key={idx} className="flex w-full h-[96px] rounded-lg py-[4px] mb-4">
          <div className="flex flex-col w-[110px] h-full">
            <span>{matchInfo.info.gameMode}</span>
            <span>몇일전</span>
            <span>승패</span>
            <span>게임 시간</span>
          </div>
          <div className="flex flex-col w-3/5 h-full">
            <div className="flex w-full h-4/5">
              <div>
                <Image 
                  src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/${matchInfo.info.participants[0].championName}.png`}
                  alt="챔피언 이미지"
                  width={48}
                  height={48}
                />
              </div>
              <div>
                <div>스펠1</div>
                <div>스펠2</div>
              </div>
              <div>
                <div>주룬</div>
                <div>부룬</div>
              </div>
              <div>
                <span>킬</span>
                <span>어시</span>
                <span>데스</span>
              </div>
              <div>
                <div>킬관여율</div>
                <div>제어와드</div>
                <div>cs(분당cs)</div>
                <div>티어</div>
              </div>
            </div>
            
            <div className="flex flex-col w-full h-1/5">
              <div className="flex">
                <div>아이템 목록 & 장신구</div>
                <div>최대킬 , 스코어</div>
              </div>
            </div>
          </div>
          <div className="flex w-1/5 h-full">
            <div>
              사람목록
            </div>
          </div>
          <div>
            <div>
              버튼 위치
            </div>
          </div>
        </div>
      ))}
      

      
      <div className="py-2">
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
      </div>
    </div>
  )
}