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



const ChampMastery = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<{ playCount: number, winCount: number } | null>(null);
  const [matchIds, setMatchIds] = useState<string[]>([]);
  const [topChampions, setTopChampions] = useState<number[]>([]);
  const puuid = useSelector(selectSummonerId).puuid;
  // const matchIds = useSelector(selectMatchInfo).matchIds;
  const dispatch = useDispatch();
  
  
  const startDate = new Date('2024-05-15T12:00:00Z');  // 스플릿 2 시즌 시작 날짜
  const endDate = new Date('2024-09-10T23:59:59Z'); // 스플릿 2 시즌 끝 날짜

  const startTime = Math.floor(startDate.getTime() / 1000);  // Unix 타임스탬프
  const endTime = Math.floor(endDate.getTime() / 1000);

  // 성능 문제상 20개로 제한
  const fetchMatchList = async (puuid: string) => {
    try {
      // const response = await fetch(`/api/season-match-list/${puuid}/${startTime}/${endTime}`, {
      //   method: "GET"
      // })
      const response = await fetch(`/api/matches/${puuid}`, {
        method: "GET"
      })

      if (!response.ok) {
        throw new Error("Failed to fetch match list");
      }
      const data = await response.json();
      setMatchIds(data);
      dispatch(setMatchInfo({ matchIds: data }))
      return data;
    } catch (error) {
      console.error("매치 리스트 fetch error")
      return [];
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
  
  const getTopChampions = async (matchIds: string[]) => {
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
      console.log("ready...")
      try {
        const fetchedMatchIds = await fetchMatchList(puuid);

        console.log("After fetchMatchList matchIds", fetchedMatchIds);
        
        const champions = await getTopChampions(fetchedMatchIds);
        console.log("champions", champions);
        setTopChampions(champions);
        

        if (champions.length > 0) {
          const stats = await getChampionPlayStats(champions[0]); // 예시로 첫 번째 챔피언의 통계를 가져옴
          setStats(stats);
        }
      } catch (error) {
        console.error("champMastery useEffect 에러")
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [puuid]);


  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex w-full h-full flex-col">
      {/* <div>Play Count: {stats.playCount}</div>
      <div>Win Count: {stats.winCount}</div> */}
      <div>matchids: {matchIds}</div>
      <div>
        Top Champions: {topChampions.join(', ')}
      </div>
    </div>
  );
};

export default ChampMastery;
