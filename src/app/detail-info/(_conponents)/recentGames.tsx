import { Match } from "@/types/types";

interface RecentGamesProps {
  matchInfos: Match[];
}

export const RecentGames = ({matchInfos}: RecentGamesProps) => {
  return (
    <div className="flex w-2/3 min-h-screen rounded-lg bg-[#28344E]">
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