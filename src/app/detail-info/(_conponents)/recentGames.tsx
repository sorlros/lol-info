import { Info, Match, MetaData, Participant, Perks, SpellMapping } from "@/types/types";
import { useEffect, useState } from "react";
import Image from 'next/image';
import runeInfoData from "@/json/runeInfo.json";
import MatchDetails from "./matchDetails";
import { calculateDaysAgo, calculateKillEngagementRate, formatGameDuration, getMyChampImage, getRuneImageUrl, getSpellImageUrl, totalMinions } from "@/lib/tools";
import RecentGamesSkeleton from "@/components/skeleton/recentGamesSkeleton";
import { Button } from "@/components/ui/button";


interface RecentGamesProps {
  matchInfos: Match[];
  puuid: string;
}

export const RecentGames = ({matchInfos, puuid}: RecentGamesProps) => {
  const [currentMatchInfos, setCurrentMatchInfos] = useState<Match[]>([]);
  const [isOpen, setIsOpen] = useState<boolean[]>(Array(currentMatchInfos.length).fill(false));
  const [myMatchInfoData, setMyMatchInfoData] = useState<Participant[]>([]);
  const [start, setStart] = useState<number>(20);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  function findMyData(currentMatchInfo: Match, puuid: string): Participant | undefined  {
    return currentMatchInfo.info.participants.find(participant => participant.puuid === puuid);
  }

  useEffect(() => {
    // setCurrentMatchInfos(matchInfos);
    setCurrentMatchInfos(matchInfos.filter(matchInfo => matchInfo.info.gameMode === "CLASSIC"));
  }, [matchInfos]);

  useEffect(() => {
    setIsLoading(true);
    try {
      if (currentMatchInfos.length > 0) {
        const data = currentMatchInfos.map(currentMatchInfo => findMyData(currentMatchInfo, puuid)) as Participant[];
        setMyMatchInfoData(data);
        setIsOpen(Array(currentMatchInfos.length).fill(false));
      }
    } catch (error) {
      console.error("myMatchInfoData 불러오기 오류")
    } finally {
      setIsLoading(true);
    }
  }, [currentMatchInfos, puuid]);

  const toggleIsOpen = (index: number) => {
    setIsOpen(prev => {
      const newIsOpen = [...prev];
      newIsOpen[index] = !newIsOpen[index];
      return newIsOpen;
    });
  }

  const emptyItem = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60qxkwAAAABJRU5ErkJggg=="

  const loadMoreMatches = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/matches/${puuid}?start=${start}`, {
        method: "GET"
      });
      const newMatchIds = await response.json();

      if (newMatchIds) {
        try {
          const newMatchData = await Promise.all(
            newMatchIds.map(async (newMatchId: string) => {
              const response = await fetch(`/api/match-info/${newMatchId}`, {
                method: "GET"
              });
              if (!response.ok) {
                throw new Error("매칭 정보 추가 api 오류");
              }
              const data = await response.json();
              return data;
            })
          );
          const filteredNewMatchData = newMatchData.filter(matchInfo => matchInfo.info.gameMode === "CLASSIC");

          setStart(prev => prev + 10);
          setCurrentMatchInfos(prev => [...prev, ...filteredNewMatchData]);
        } catch (error) {
          console.error("새 매칭 정보 Promise.all 오류", error);
        } finally {
          setIsLoading(false);
        }
      }  
    } catch (error) {
      setStart(20);
      console.error("매치정보 추가 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!myMatchInfoData.length || !isLoading) {
    return (
      <RecentGamesSkeleton />
    )
  }

  return (
    <div className="flex flex-col w-[694px] min-h-screen rounded-lg bg-[#1C1C1F]">
      {currentMatchInfos.map((currentMatchInfo: Match, idx: number) => (
        <div key={idx} className={myMatchInfoData[idx].win 
          ? `flex w-full h-[96px] rounded-lg px-[8px] py-[8px] pb-4 bg-[#28344E] relative ${isOpen[idx] ? "mb-[590px]" : "mb-[8px]"}` 
          : `flex w-full h-[96px] rounded-lg px-[8px] py-[8px] pb-4 bg-[#703C47] relative ${isOpen[idx] ? "mb-[590px]" : "mb-[8px]"}`}>
          <div className="flex flex-col w-[110px] h-full">
            <span className={
              myMatchInfoData[idx].win ? "text-blue-500 text-[14px]" : "text-red-500 text-[14px]"
            }>{currentMatchInfo.info.gameMode === "CLASSIC" ? "솔랭" : "아직미구현"}</span>
            <span className="text-neutral-400 text-[12px]">{calculateDaysAgo(currentMatchInfo.info.gameCreation)}</span>
            <div className="w-[48px] h-[0.5px] bg-neutral-600" />
            <span className="text-neutral-400 text-[12px] font-bold">{myMatchInfoData[idx].win ? "승리" : "패배"}</span>
            <span className="text-neutral-400 text-[12px]">{formatGameDuration(currentMatchInfo.info.gameDuration)}</span>
          </div>

          <div className="flex flex-col w-[378px] h-full">
            <div className="flex items-stretch w-full h-4/5">
              <div className="flex w-[98px]">
              <div>
                <Image 
                  src={getMyChampImage(idx, myMatchInfoData)}
                  alt="챔피언 이미지"
                  style={{ width: "auto", height: "auto" }}
                  width={48}
                  height={48}
                />
              </div>
              <div className="ml-1">
                <div>
                  <Image 
                    src={getSpellImageUrl(myMatchInfoData[idx].summoner1Id)}
                    alt="소환사 스펠"
                    width={22}
                    height={22}
                    style={{ width: "auto", height: "auto" }}
                  />
                </div>
                <div>
                  <Image 
                      src={getSpellImageUrl(myMatchInfoData[idx].summoner2Id)}
                      alt="소환사 스펠"
                      width={22}
                      height={22}
                      style={{ width: "auto", height: "auto" }}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <div className="ml-1">
                  <Image 
                    src={getRuneImageUrl(myMatchInfoData[idx].perks.styles[0].selections[0].perk)}
                    alt="메인룬 이미지"
                    width={22}
                    height={22}
                    style={{ width: "auto", height: "auto" }}
                  />
                </div>
                <div className="ml-1">
                <Image 
                    src={getRuneImageUrl(myMatchInfoData[idx].perks.styles[1].style)}
                    alt="부룬 이미지"
                    width={25}
                    height={25}
                    style={{ width: "auto", height: "auto" }}
                  />
                </div>
              </div>
              </div>

              <div className="flex w-[108px] gap-x-1 ml-2">
                <span className="text-white">{myMatchInfoData[idx].kills}</span>
                <span className="text-neutral-500">/</span>
                <span className="text-red-600">{myMatchInfoData[idx].deaths}</span>
                <span className="text-neutral-500">/</span>
                <span className="text-white">{myMatchInfoData[idx].assists}</span>
              </div>

                <div className="w-[0.5px] h-[58px] bg-neutral-600 mr-2"></div>
                <div className="flex flex-col w-[139px] items-start h-full text-[12px] text-neutral-400">
                  <div>
                    <span className="text-red-600">킬관여율</span> {calculateKillEngagementRate(idx, currentMatchInfos, myMatchInfoData)}%</div>
                  <div>제어 와드 {myMatchInfoData[idx].detectorWardsPlaced}</div>
                  <div>CS {totalMinions(idx, myMatchInfoData)} ({(totalMinions(idx, myMatchInfoData) / (currentMatchInfo.info.gameDuration / 60)).toFixed(1)})</div>
                </div>
            </div>
            
            <div className="flex flex-col w-full h-1/5">
              <div className="flex">
                <div className="flex w-full h-full gap-x-1">
                  <Image 
                    src={
                      myMatchInfoData[idx].item0 === 0
                      ? emptyItem
                      : `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${myMatchInfoData[idx].item0}.png`
                    } 
                    alt="아이템 이미지"
                    width={22}
                    height={22}
                    style={{ width: "22px", height: "22px" }}
                  />
                  <Image 
                    src={
                      myMatchInfoData[idx].item1 === 0
                      ? emptyItem
                      : `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${myMatchInfoData[idx].item1}.png`
                    } 
                    alt="아이템 이미지"
                    width={22}
                    height={22}
                    style={{ width: "22px", height: "22px" }}
                  />
                  <Image
                    src={
                      myMatchInfoData[idx].item2 === 0
                      ? emptyItem
                      : `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${myMatchInfoData[idx].item2}.png`
                    } 
                    alt="아이템 이미지"
                    width={22}
                    height={22}
                    style={{ width: "22px", height: "22px" }}
                  />
                  <Image
                    src={
                      myMatchInfoData[idx].item3 === 0
                      ? emptyItem
                      : `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${myMatchInfoData[idx].item3}.png`
                    } 
                    alt="아이템 이미지"
                    width={22}
                    height={22}
                    style={{ width: "22px", height: "22px" }}
                  />
                  <Image
                    src={
                      myMatchInfoData[idx].item4 === 0
                      ? emptyItem
                      : `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${myMatchInfoData[idx].item4}.png`
                    } 
                    alt="아이템 이미지"
                    width={22}
                    height={22}
                    style={{ width: "22px", height: "22px" }}
                  />
                  <Image
                    src={
                      myMatchInfoData[idx].item5 === 0
                      ? emptyItem
                      : `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${myMatchInfoData[idx].item5}.png`
                    } 
                    alt="아이템 이미지"
                    width={22}
                    height={22}
                    style={{ width: "22px", height: "22px" }}
                  />
                  <Image
                    src={
                      myMatchInfoData[idx].item6 === 0
                      ? emptyItem
                      : `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${myMatchInfoData[idx].item6}.png`
                    } 
                    alt="아이템 이미지"
                    width={22}
                    height={22}
                    style={{ width: "22px", height: "22px" }}
                  />

                  {myMatchInfoData[idx].pentaKills || myMatchInfoData[idx].quadraKills || myMatchInfoData[idx].tripleKills || myMatchInfoData[idx].doubleKills ? (    
                    <div className="w-max-[65px] h-[20px] items-center justify-center rounded-lg bg-red-600 whitespace-nowrap text-white text-[12px] py-0.5 px-1 ml-2">
                      {myMatchInfoData[idx].pentaKills ? "펜타킬" : myMatchInfoData[idx].quadraKills ? "쿼드라킬" : myMatchInfoData[idx].tripleKills ? "트리플킬" : myMatchInfoData[idx].doubleKills ? "더블킬" : ""}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="grid grid-flow-col grid-cols-2 grid-rows-5 w-[168px] h-[88px] pb-2">
              {
                currentMatchInfo.info.participants.map((participant, idx) => (
                  <div 
                    key={participant.puuid} 
                    className="flex w-[80px] h-[16px] gap-x-1 items-center"
                  >
                    <Image 
                      src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/${participant.championName}.png`}
                      alt="챔피언 이미지"
                      style={{ width: "auto", height: "auto" }}
                      width={16}
                      height={16}
                    />
                    <div className="whitespace-nowrap overflow-hidden overflow-ellipsis">
                      <span className="text-neutral-300 text-[12px]">
                        {participant.riotIdGameName}
                      </span>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>

          <div className="flex w-[40px] h-[80px] items-end justify-center">
            <button onClick={() => toggleIsOpen(idx)}>
              <svg
                className={`w-5 h-5 text-white transition-transform ${isOpen[idx] ? 'transform rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          <MatchDetails currentMatchInfo={currentMatchInfo} isOpen={isOpen} idx={idx} myMatchInfoData={myMatchInfoData} />
        </div>
      ))}
      <div>
        <Button onClick={loadMoreMatches} variant="default" className="w-[694px] h-[40px] bg-neutral-500 z-9999">더보기</Button>
      </div>
    </div>
  )
}