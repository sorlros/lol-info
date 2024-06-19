import { selectMatchInfo, setMatchInfo } from "@/features/matchInfoSlice";
import { selectSummonerId } from "@/features/summonerIdSlice";
import { selectSummoner } from "@/features/summonerSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface MatchDetails {
  info: {
    participants: {
      puuid: string;
      championId: number;
      win: boolean;
    }[];
  };
}



const ChampionStats = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<{ playCount: number, winCount: number } | null>(null);
  const [matchIds, setMatchIds] = useState<string[]>([]);
  const [topChampions, setTopChampions] = useState<number[]>([]);
  const puuid = useSelector(selectSummonerId).puuid;
  // const matchIds = useSelector(selectMatchInfo).matchIds;
  const dispatch = useDispatch();
  
  
  const startDate = new Date('2024-05-15T12:00:00Z');  // 스플릿 2 시즌 시작 날짜
  const endDate = new Date('2024-09-10T23:59:59Z'); // 스플릿 2 시즌 끝 날짜

  const startTime = Math.floor(startDate.getTime() / 1000);
  const endTime = Math.floor(endDate.getTime() / 1000);

  // 성능 문제상 20개로 제한
  const fetchMatchList = async (puuid: string, startTime: number, endTime: number) => {
    try {
      const response = await fetch(`/api/season-match-list/${puuid}/${startTime}/${endTime}`)
      console.log("response", response)
      if (!response.ok) {
        throw new Error("Failed to fetch match list");
      }
      const data = await response.json();
      setMatchIds(data);
      dispatch(setMatchInfo({ matchIds: data }))
      console.log("ids", matchIds)
    } catch (error) {
      console.error("매치 리스트 fetch error")
    }
  };
  
  const fetchMatchDetails = async (matchId: string) => {
    try {
      const response = await fetch(`/api/match-info/${matchId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch match details");
      }
      const data = (await response.json()) as MatchDetails;
      return data;
    } catch (error) {
      console.error("Error fetching match details:", error);
    }
  };
  
  const getTopChampions = async () => {
    const championUsage: { [key: number]: number } = {};

    if (matchIds) {
      for (const matchId of matchIds) {
        const matchDetails = await fetchMatchDetails(matchId);
        if (matchDetails) {
          const participant = matchDetails.info.participants.find(p => p.puuid === puuid);

          if (participant) {
            const { championId } = participant;
            championUsage[championId] = (championUsage[championId] || 0) + 1;
          }
        }
      }
    }

    const sortedChampions = Object.entries(championUsage)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([championId]) => parseInt(championId));

    return sortedChampions;
  };
  
  const getChampionPlayStats = async (championId: number)=> {
    // const matchIds = await fetchMatchList(puuid, startTime, endTime);
    let playCount = 0;
    let winCount = 0;
  
    for (const matchId of matchIds) {
      const matchDetails = await fetchMatchDetails(matchId) as MatchDetails;
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

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      const list = await fetchMatchList(puuid, startTime, endTime);
      console.log("list", list)
      console.log("matchIds", matchIds);
      const champions = await getTopChampions();
      setTopChampions(champions);
      console.log("champions", champions)

      if (champions.length > 0) {
        const stats = await getChampionPlayStats(champions[0]); // 예시로 첫 번째 챔피언의 통계를 가져옴
        setStats(stats);
      }
      setIsLoading(false);
    };

    fetchStats();
  }, [puuid, startTime, endTime, dispatch]);

  if (!stats || isLoading) {
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
