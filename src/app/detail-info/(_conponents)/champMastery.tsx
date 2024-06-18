import { selectSummoner } from "@/features/summonerSlice";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface MatchDetails {
  info: {
    participants: {
      puuid: string;
      championId: number;
      win: boolean;
    }[];
  };
}

const fetchMatchList = async (puuid: string, startTime: number, endTime: number): Promise<string[]> => {
  const response = await fetch(`/lol/match/v5/matches/by-puuid/${puuid}/ids?startTime=${startTime}&endTime=${endTime}`);
  const data = await response.json();
  return data;
};

const fetchMatchDetails = async (matchId: string): Promise<MatchDetails> => {
  const response = await fetch(`/lol/match/v5/matches/${matchId}`);
  const data = await response.json();
  return data;
};

const getTopChampions = async (puuid: string, startTime: number, endTime: number) => {
  const matchIds = await fetchMatchList(puuid, startTime, endTime);
  const championUsage: { [key: number]: number } = {};

  for (const matchId of matchIds) {
    const matchDetails = await fetchMatchDetails(matchId);
    const participant = matchDetails.info.participants.find(p => p.puuid === puuid);

    if (participant) {
      const { championId } = participant;
      if (championUsage[championId]) {
        championUsage[championId] += 1;
      } else {
        championUsage[championId] = 1;
      }
    }
  }

  const sortedChampions = Object.entries(championUsage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([championId]) => parseInt(championId));

  return sortedChampions;
};

const getChampionPlayStats = async (puuid: string, championId: number, startTime: number, endTime: number): Promise<{ playCount: number, winCount: number }> => {
  const matchIds = await fetchMatchList(puuid, startTime, endTime);
  let playCount = 0;
  let winCount = 0;

  for (const matchId of matchIds) {
    const matchDetails = await fetchMatchDetails(matchId);
    const participant = matchDetails.info.participants.find(p => p.puuid === puuid && p.championId === championId);

    if (participant) {
      playCount += 1;
      if (participant.win) {
        winCount += 1;
      }
    }
  }

  return { playCount, winCount };
};

const ChampionStats = () => {
  const [stats, setStats] = useState<{ playCount: number, winCount: number } | null>(null);
  const [topChampions, setTopChampions] = useState<number[]>([]);
  const puuid = useSelector(selectSummoner).puuid;
  
  const startDate = new Date('2024-05-15T12:00:00Z');  // 스플릿 2 시즌 시작 날짜
  const endDate = new Date('2024-09-10T23:59:59Z'); // 스플릿 2 시즌 끝 날짜

  const startTime = Math.floor(startDate.getTime() / 1000);
  const endTime = Math.floor(endDate.getTime() / 1000);

  useEffect(() => {
    const fetchStats = async () => {
      const champions = await getTopChampions(puuid, startTime, endTime);
      setTopChampions(champions);

      // 여기서 각 챔피언의 플레이 횟수와 승리 횟수를 가져올 수 있습니다.
      const stats = await getChampionPlayStats(puuid, champions[0], startTime, endTime); // 예시로 첫 번째 챔피언의 통계를 가져옴
      setStats(stats);
    };

    fetchStats();
  }, []);

  if (!stats) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>Play Count: {stats.playCount}</div>
      <div>Win Count: {stats.winCount}</div>
      <div>
        Top Champions: {topChampions.join(', ')}
      </div>
    </div>
  );
};

export default ChampionStats;
