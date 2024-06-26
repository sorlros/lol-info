import { setMatchInfo } from "@/features/matchInfoSlice";
import { selectSummonerId } from "@/features/summonerIdSlice";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import championData from "@/json/champion.json"
import ChampMasterySkeleton from "@/components/skeleton/champMasterySkeleton";
import { cn } from "@/lib/utils";
interface MatchDetails {
  info: {
    participants: {
      puuid: string;
      championId: number;
      win: boolean;
      championName: string;
      totalMinionsKilled: number;
      kills: number;
      deaths: number;
      assists: number;
      timePlayed: number;
    }[];
  };
}



const ChampMastery = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<{ championId: number, championName: string, playCount: number, winCount: number, avgKills: number, avgAssists: number, avgDeaths: number, avgMinionsKilled: number, timePlayed: number }[]>([]);
  const [matchIds, setMatchIds] = useState<string[]>([]);
  const [topChampions, setTopChampions] = useState<number[]>([]);
  const puuid = useSelector(selectSummonerId).puuid;

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
        throw new Error("fetchMatchList response 오류");
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
        throw new Error("fetchMatchDetails response 오류");
      }
      const data = (await response.json()) as MatchDetails;
      return data;
    } catch (error) {
      console.error("fetchMatchDetails 오류:", error);
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
    let kills = 0;
    let assists = 0;
    let deaths = 0;
    let totalMinionsKilled = 0;
    let timePlayed = 0;
  
    for (const matchId of matchIds) {
      const matchDetails = await fetchMatchDetails(matchId) as MatchDetails;
      const participant = matchDetails.info.participants.find(p => p.puuid === puuid && p.championId === championId);
      // console.log(`puuid: ${puuid}, championId: ${championId}`)
      // console.log(`Match ID: ${matchId}, Participant:`, participant);

      if (participant) {
        const timePlayed = participant.timePlayed;
        if (timePlayed < 300) {
          continue;
        }

        playCount += 1;
        if (participant.win) {
          winCount += 1;
        }
        kills += participant.kills;
        assists += participant.assists;
        deaths += participant.deaths;
        totalMinionsKilled += participant.totalMinionsKilled;
        championName = participant.championName;
      }
    }

    const avgKills = playCount > 0 ? parseFloat((kills / playCount).toFixed(1)) : 0;
    const avgAssists = playCount > 0 ? parseFloat((assists / playCount).toFixed(1)) : 0;
    const avgDeaths = playCount > 0 ? parseFloat((deaths / playCount).toFixed(1)) : 0;
    const avgMinionsKilled = playCount > 0 ? parseFloat((totalMinionsKilled / playCount).toFixed(1)) : 0;
    
    // console.log(`championName = ${championName}, ${championId}: playCount = ${playCount}, winCount = ${winCount}`);
    
    console.log(`totalMinion: ${totalMinionsKilled}`)

    return { championId, playCount, timePlayed, winCount, championName, avgKills, avgAssists, avgDeaths, avgMinionsKilled };
  };  

  const getKoreanName = (englishName: string): string | undefined => {
    const champion = championData.find((champ) => champ.english === englishName);
    return champion ? champion.korean : undefined;
  }

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const fetchedMatchIds = await fetchMatchList(puuid);

        // console.log("After fetchMatchList matchIds", fetchedMatchIds);
        
        const champions = await getTopChampions(fetchedMatchIds);
        // console.log("champions", champions);
        setTopChampions(champions);
        

        if (champions.length > 0) {
          const statsPromises = champions.map(championId => getChampionPlayStats(championId, fetchedMatchIds));
          const allStats = await Promise.all(statsPromises)
          setStats(allStats);
          // console.log("allStats", allStats);
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
      {stats.map(stat => {
        let kda = (stat.avgKills + stat.avgAssists) / stat.avgDeaths;
        if (stat.avgDeaths === 0) {
          kda = (stat.avgKills + stat.avgAssists);
        }
        const winRate = ((stat.winCount / stat.playCount) * 100);
        return (
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
          <div className="flex w-[100px] h-[15px] flex-col items-start justify-center pl-[3px]">
            <span className="text-white text-[12px] font-bold">{getKoreanName(stat.championName)}</span>
            <span className="text-neutral-400 text-[12px]">CS {stat.avgMinionsKilled}</span>
          </div>
          <div className="flex flex-col w-[96px] h-[15px] text-[12px] text-neutral-400 items-center justify-center">
            <span className={cn({
              "text-green-400 font-bold": kda >= 3,
              "text-red-500 font-bold": kda <= 1,
              "font-bold text-neutral-300": kda > 1 && kda < 3
            })}>{kda.toFixed(2)} 평점</span>
            <span>{`${stat.avgKills} / ${stat.avgDeaths} / ${stat.avgAssists}`}</span>
          </div>
          <div className="flex flex-col w-[70px] h-[48px] text-[12px] items-end justify-center text-neutral-400">
            <span className={cn({
              "text-red-500" : winRate >= 60,
            })}>{winRate.toFixed(0)}%</span>
            <span>{stat.playCount} 게임</span>
          </div>
        </div>
      
      )})}
    </div>
  );
};

export default ChampMastery;
