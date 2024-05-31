import { Info, Match, MetaData, Participant, Perks, SpellMapping } from "@/types/types";
import { useEffect, useState } from "react";
import Image from 'next/image';
import runeInfoData from "@/json/runeInfo.json";


interface RecentGamesProps {
  matchInfos: Match[];
  puuid: string;
}

export const RecentGames = ({matchInfos, puuid}: RecentGamesProps) => {
  const [isOpen, setIsOpen] = useState();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [myMatchInfoData, setMyMatchInfoData] = useState<Participant[]>([]);

  useEffect(() => {
    if (matchInfos.length > 0 && matchInfos[0].info.participants.length > 0) {
      console.log("AADD", matchInfos[0].info.participants[0].championName);
    }
  }, [matchInfos]);

  function findMyData(matchInfo: Match, puuid: string): Participant | undefined  {
    return matchInfo.info.participants.find(participant => participant.puuid === puuid);
  }

  useEffect(() => {
    setIsLoading(true);
    const data = matchInfos.map(matchInfo => findMyData(matchInfo, puuid)) as Participant[];
    setMyMatchInfoData(data);
    console.log("INFO", myMatchInfoData);
    setIsLoading(false);
  }, [matchInfos, puuid]);

  const calculateDaysAgo = (gameCreation: number) => {
    const now = new Date().getTime();
    const daysAgo = Math.floor((now - gameCreation) / (1000 * 60 * 60 * 24));
    return `${daysAgo}일 전`
  }

  const spellMapping: SpellMapping = {
    21: "SummonerBarrier",
    1: "SummonerBoost",
    14: "SummonerDot",
    3: "SummonerExhaust",
    4: "SummonerFlash",
    6: "SummonerHaste",
    7: "SummonerHeal",
    13: "SummonerMana",
    30: "SummonerPoroRecall",
    31: "SummonerPoroThrow",
    11: "SummonerSmite",
    39: "SummonerSnowURFSnowball_Mark",
    32: "SummonerSnowball",
    12: "SummonerTeleport",
    54: "Summoner_UltBookPlaceholder",
    55: "Summoner_UltBookSmitePlaceholder"
  };

  const getSpellImageUrl = (spellId: number): string => {
    const spellName = spellMapping[spellId];
    return `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/spell/${spellName}.png`;
  };

  const formatGameDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}분 ${remainingSeconds}초`;
  };

  // const getSecondRuneImageUrl = () => {
  //   const url = myMatchInfoData[idx].perks.styles[1].style;
  // }

  const runeInfoMap: Map<number, string> = new Map(runeInfoData.map(item => [item.id, item.icon]));

  const getIconFromId = (id: number): string => {
    for (const item of runeInfoData) {
        if (item.id === id) {
            return item.icon;
        }
        for (const slot of item.slots) {
            for (const rune of slot.runes) {
                if (rune.id === id) {
                    return rune.icon;
                }
            }
        }
    }
    return "";
};

  // const getMainRuneImageUrl = (runeName: string) => {
  //   return `https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/${perk.icon}`;
  // }
  const getMainRuneImageUrl = (id: number) => {
    return `https://ddragon.leagueoflegends.com/cdn/img/${getIconFromId(id)}`;
  }

  if (!myMatchInfoData.length) {
    return <div>No match data available</div>;
  }

  return (
    <div className="flex flex-col w-2/3 min-h-screen rounded-lg bg-[#28344E]">
      {matchInfos.map((matchInfo: Match, idx: number) => (
        <div key={idx} className="flex w-full h-[96px] rounded-lg py-[4px] mb-4">
          <div className="flex flex-col w-[110px] h-full">
            <span className={
              myMatchInfoData[idx].win ? "text-blue-500" : "text-red-500"
            }>{matchInfo.info.gameMode === "CLASSIC" ? "솔랭" : "아직미구현"}</span>
            <span className="text-neutral-400 text-sm">{calculateDaysAgo(matchInfo.info.gameCreation)}</span>
            <span>{myMatchInfoData[idx].win ? "승리" : "패배"}</span>
            <span>{formatGameDuration(matchInfo.info.gameDuration)}</span>
          </div>
          <div className="flex flex-col w-3/5 h-full">
            <div className="flex w-full h-4/5">
              <div>
                <Image 
                  src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/${myMatchInfoData[idx].championName}.png`}
                  alt="챔피언 이미지"
                  style={{ width: "auto", height: "auto" }}
                  width={48}
                  height={48}
                />
              </div>
              <div>
                <div className="ml-1">
                  <Image 
                    src={getSpellImageUrl(myMatchInfoData[idx].summoner1Id)}
                    alt="소환사 스펠"
                    width={22}
                    height={22}
                    style={{ width: "22px", height: "22px" }}
                    layout="fixed"
                  />
                </div>
                <div className="ml-1">
                  <Image 
                      src={getSpellImageUrl(myMatchInfoData[idx].summoner2Id)}
                      alt="소환사 스펠"
                      width={22}
                      height={22}
                      style={{ width: "22px", height: "22px" }}
                      layout="fixed"
                  />
                </div>
              </div>
              <div>
                <div className="ml-1">
                  <Image 
                    src={getMainRuneImageUrl(myMatchInfoData[idx].perks.styles[0].selections[0].perk)}
                    alt="메인룬 이미지"
                    width={22}
                    height={22}
                    style={{ width: "22px", height: "22px" }}
                    layout="fixed"
                  />
                </div>
                <div className="ml-1">
                <Image 
                    src={getMainRuneImageUrl(myMatchInfoData[idx].perks.styles[1].style)}
                    alt="부룬 이미지"
                    width={22}
                    height={22}
                    style={{ width: "22px", height: "22px", borderRadius: "50%" }}
                    layout="fixed"
                  />
                </div>
              </div>
              <div className="flex gap-x-1 ml-2 w-min-[108px]">
                <span className="text-white">{myMatchInfoData[idx].kills}</span>
                <span className="text-neutral-500">/</span>
                <span className="text-red-600">{myMatchInfoData[idx].deaths}</span>
                <span className="text-neutral-500">/</span>
                <span className="text-white">{myMatchInfoData[idx].assists}</span>
              </div>

                <div className="flex flex-col justify-end ml-3 text-[12px]">
                  <div>킬관여율</div>
                  <div>제어와드</div>
                  <div>cs(분당cs)</div>
                  <div>티어</div>
                </div>
            </div>
            
            <div className="flex flex-col w-full h-1/5">
              <div className="flex">
                <div className="flex w-full h-full gap-x-1">
                  <Image 
                    src={
                      myMatchInfoData[idx].item0 === 0
                      ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60qxkwAAAABJRU5ErkJggg=='
                      : `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${myMatchInfoData[idx].item0}.png`
                    } 
                    alt="아이템 이미지"
                    width={22}
                    height={22}
                    style={{ width: "22px", height: "22px" }}
                    layout="fixed"
                  />
                  <Image 
                    src={
                      myMatchInfoData[idx].item1 === 0
                      ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60qxkwAAAABJRU5ErkJggg=='
                      : `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${myMatchInfoData[idx].item1}.png`
                    } 
                    alt="아이템 이미지"
                    width={22}
                    height={22}
                    style={{ width: "22px", height: "22px" }}
                    layout="fixed"
                  />
                  <Image
                    src={
                      myMatchInfoData[idx].item2 === 0
                      ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60qxkwAAAABJRU5ErkJggg=='
                      : `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${myMatchInfoData[idx].item2}.png`
                    } 
                    alt="아이템 이미지"
                    width={22}
                    height={22}
                    style={{ width: "22px", height: "22px" }}
                    layout="fixed"
                  />
                  <Image
                    src={
                      myMatchInfoData[idx].item3 === 0
                      ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60qxkwAAAABJRU5ErkJggg=='
                      : `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${myMatchInfoData[idx].item3}.png`
                    } 
                    alt="아이템 이미지"
                    width={22}
                    height={22}
                    style={{ width: "22px", height: "22px" }}
                    layout="fixed"
                  />
                  <Image
                    src={
                      myMatchInfoData[idx].item4 === 0
                      ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60qxkwAAAABJRU5ErkJggg=='
                      : `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${myMatchInfoData[idx].item4}.png`
                    } 
                    alt="아이템 이미지"
                    width={22}
                    height={22}
                    style={{ width: "22px", height: "22px" }}
                    layout="fixed"
                  />
                  <Image
                    src={
                      myMatchInfoData[idx].item5 === 0
                      ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60qxkwAAAABJRU5ErkJggg=='
                      : `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${myMatchInfoData[idx].item5}.png`
                    } 
                    alt="아이템 이미지"
                    width={22}
                    height={22}
                    style={{ width: "22px", height: "22px" }}
                    layout="fixed"
                  />
                  <Image
                    src={
                      myMatchInfoData[idx].item6 === 0
                      ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60qxkwAAAABJRU5ErkJggg=='
                      : `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${myMatchInfoData[idx].item6}.png`
                    } 
                    alt="아이템 이미지"
                    width={22}
                    height={22}
                    style={{ width: "22px", height: "22px" }}
                    layout="fixed"
                  />

                  {myMatchInfoData[idx].pentaKills || myMatchInfoData[idx].quadraKills || myMatchInfoData[idx].tripleKills || myMatchInfoData[idx].doubleKills ? (    
                    <div className="w-max-[65px] h-full rounded-lg bg-red-600 whitespace-nowrap text-white py-0.5 px-1 ml-2">
                      {myMatchInfoData[idx].pentaKills ? "펜타킬" : myMatchInfoData[idx].quadraKills ? "쿼드라킬" : myMatchInfoData[idx].tripleKills ? "트리플킬" : myMatchInfoData[idx].doubleKills ? "더블킬" : ""}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
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
        </div>
      ))}
    </div>
  )
}