"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { IoMdSearch } from "react-icons/io";

import { useDispatch, useSelector } from 'react-redux';
import { selectPuuid, setSummoner } from "@/features/summonerSlice";
import { useRouter } from "next/navigation";
import { setSummonerId } from "@/features/summonerIdSlice";
import { setMatchInfo } from "@/features/matchInfoSlice";

export const SummonerName = () => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useDispatch();
  const router = useRouter();
  
  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const [gameName, tagLine] = inputValue.split("#");

      if (!gameName || !tagLine) {
        setError(`소환사명 혹은 태그ID가 일치하지 않습니다. 유효한 형식은 "소환사명#태그ID" 입니다.`);
        return;
      }

      const response = await fetch(`/api/account/by-name/${gameName}/${tagLine}`, {
        method: "GET"
      });

      if (!response.ok) {
        throw new Error("fetched data 오류");
      }

      const data = await response.json();
      const getSummoner = dispatch(setSummoner(data));

      if (getSummoner.payload) {
        const puuid = getSummoner.payload.puuid;
        const gameName = getSummoner.payload.gameName;
       
        router.push(`/detail-info/${puuid}&${gameName}&${tagLine}`)
      }
      // console.log("data", data);
    } catch (error) {
      setError("오류 발생");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex w-full h-[250px] justify-center items-center">
      <div className="flex w-[800px] relative items-center">
        <input 
          className="flex-grow h-[50px] justify-start rounded-lg pr-[50px] border pl-[20px]" 
          type="text"
          placeholder="챔피언 혹은 Riot ID 검색 ex)hide on bush#kr1"
          onChange={(e) => setInputValue(e.target.value)}
        />

        <Button onClick={() => handleSearch()} className="absolute right-0  flex items-center justify-center w-[50px]" variant="ghost">
          <IoMdSearch size={24} />
        </Button>
      </div>
    </div>
  )
}