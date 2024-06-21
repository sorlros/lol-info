import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Image from 'next/image';
import { selectSummonerId } from "@/features/summonerIdSlice";
import { TierData } from "@/types/types";
import ChampionStats from "./champMastery";
import ChampMastery from "./champMastery";

export const UserChampInfo = () => {
  const [tierData, setTierData] = useState<TierData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const summonerData = useSelector(selectSummonerId)
  const summonerId = summonerData.encryptedSummonerId;

  useEffect(() => {
    const fetchTierInfo = async () => {
      try {
        const response = await fetch(`/api/summoner/summonerId/${summonerId}`, {
          method: "GET"
        })
  
        if (!response.ok) {
          throw new Error("소환사 정보를 불러오지 못했습니다.");
        }

        const data = await response.json();
        setTierData(data);
      } catch (error) {
        console.error("useEffect문 tierInfo fetch 오류")
      } finally {
        setIsLoading(false);
      }
    }

    if (summonerId) {
      fetchTierInfo();
    }
  }, [summonerId])

  useEffect(() => {
    console.log("tier", tierData)
  }, [tierData])

  if (isLoading) {
    return <div>isLoading...</div>;
  }

  if (!tierData) {
    return <div>소환사 정보가 없습니다.</div>;
  }

  return (
    <div className="flex flex-col w-[332px] h-[1000px] gap-y-2">
      <div className="flex flex-col w-[332px] h-[120px] rounded-lg bg-neutral-800 p-[12px] space-y-2">
        <div className="flex w-full h-[100px] gap-x-10">
          <div className="flex w-[200px] h-[100px] items-center">
            <div className="flex w-[72px] h-[72px] rounded-full bg-[#1C1C1F] items-center">
              <Image 
                src={`/Emblems/${tierData[0].tier}.png`}
                alt="랭크티어 이미지"
                width={72}
                height={72}
                style={{ width: "auto", height: "auto" }}
              />
            </div>
            <div className="flex flex-col gap-y-[0.5px] pl-5">
              <div className="flex gap-1  text-white font-bold text-[18px]">
                <span>{tierData[0].tier}</span>
                <span>{tierData[0].rank}</span>
              </div>
              <div>
                <span className="text-[12px] text-neutral-300">{tierData[0].leaguePoints} LP</span>
              </div>
            </div>
          </div>

          <div className="flex-grow" />

          <div className="flex flex-col justify-end w-[40px] h-[100px] text-neutral-300 items-center text-[12px] pr-[12px]">
            <div className="flex gap-x-0">
              <span className="w-[32px] h-[30px]">{tierData[0].wins}승</span>
              <span className="w-[32px] h-[30px]">{tierData[0].losses}패</span>
            </div>
            <div className="flex">
              <span className="w-[55px] h-[40px]">
                승률 {(tierData[0].wins / (tierData[0].wins + tierData[0].losses) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-[332px] h-[550px] rounded-lg">
          <ChampMastery />
      </div>
    </div>
  );
}
