import { setMatchInfo } from "@/features/matchInfoSlice";
import { selectSummonerId } from "@/features/summonerIdSlice";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import championData from "@/json/champion.json"
import ChampMasterySkeleton from "@/components/skeleton/champMasterySkeleton";
interface MatchDetails {
  info: {
    participants: {
      puuid: string;
      championId: number;
      win: boolean;
      championName: string;
    }[];
  };
}



const ChampMastery = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<{ championId: number, championName: string, playCount: number, winCount: number }[]>([]);
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
  
  const getChampionPlayStats = async (championId: number, matchIds: string[])=> {
   
    let playCount = 0;
    let winCount = 0;
    let championName = "";
  
    for (const matchId of matchIds) {
      const matchDetails = await fetchMatchDetails(matchId) as MatchDetails;
      const participant = matchDetails.info.participants.find(p => p.puuid === puuid && p.championId === championId);
  
      if (participant) {
        playCount += 1;
        if (participant.win) {
          winCount += 1;
        }
        championName = participant.championName;
      }
    }
    
    console.log(`championName = ${championName}, ${championId}: playCount = ${playCount}, winCount = ${winCount}`);
    return { championId, playCount, winCount, championName };
  };  

  const getKoreanName = (englishName: string): string | undefined => {
    const champion = championData.find((champ) => champ.english === englishName);
    return champion ? champion.korean : undefined;
  }

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      console.log("ready...")
      try {
        const fetchedMatchIds = await fetchMatchList(puuid);

        // console.log("After fetchMatchList matchIds", fetchedMatchIds);
        
        const champions = await getTopChampions(fetchedMatchIds);
        console.log("champions", champions);
        setTopChampions(champions);
        

        if (champions.length > 0) {
          const statsPromises = champions.map(championId => getChampionPlayStats(championId, fetchedMatchIds));
          const allStats = await Promise.all(statsPromises)
          setStats(allStats);
          console.log("allStats", allStats);
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
    return (
      <ChampMasterySkeleton />
    )
  }

  return (
    <div className="flex w-full h-full flex-col">
      {stats.map(stat => (
        <div key={stat.championId} className="flex w-full h-[48px] mb-1 bg-neutral-800 rounded-lg p-[12px] items-center">
          <div className="flex w-[44px] h-[40px]">
            <div className="flex w-[40px] h-[40px] rounded-full overflow-hidden mr-1">
              <Image 
                src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/${stat.championName}.png`}
                alt="챔피언이미지"
                style={{ width: "auto", height: "auto"}}
                width={32}
                height={32}
              />
            </div>
          </div>
          <div>
            <span className="text-white text-[12px] font-bold">{getKoreanName(stat.championName)}</span>
          </div>
          <div>Play Count: {stat.playCount}</div>
          <div>Win Count: {stat.winCount}</div>
        </div>
      ))}
    </div>
  );
};

export default ChampMastery;
