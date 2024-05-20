"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { IoMdSearch } from "react-icons/io";

import { useDispatch, useSelector } from 'react-redux';
import { selectPuuid, setSummoner } from "@/features/summonerSlice";

export const SummonerName = () => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  // const puuid = useSelector(selectPuuid);
  
  const handleSearch = async () => {
    try {
      const [gameName, tagLine] = inputValue.split("#");

      if (!gameName || !tagLine) {
        setError(`소환사명 혹은 태그ID가 일치하지 않습니다. 유효한 형식은 "소환사명#태그ID" 입니다.`);
        return;
      }

      const response = await fetch(`/api/account/${gameName}/${tagLine}`, {
        method: "GET"
      });

      if (!response.ok) {
        throw new Error("fetched data 오류");
      }

      const data = await response.json();
      const getSummoner = dispatch(setSummoner(data));

      if (getSummoner.payload) {
        console.log("puuid", getSummoner.payload.puuid);
        const puuid = getSummoner.payload.puuid;
        const response = await fetch(`/api/matches/${puuid}`, {
          method: "GET"
        })

        if (!response.ok) {
          throw new Error("matches fetching 오류");
        }

        const data = await response.json();
        console.log("matches", data);
      }
      // console.log("data", data);
    } catch (error) {
      setError("오류 발생");
    }
  }

  return (
    <div className="flex w-full h-[250px] justify-center items-center">
      <div className="flex w-[800px] relative items-center">
        <input 
          className="flex-grow h-[50px] justify-start rounded-lg pr-[50px] border pl-[20px]" 
          type="text"
          placeholder="챔피언 혹은 Riot ID 검색"
          onChange={(e) => setInputValue(e.target.value)}
        />

        <Button onClick={() => handleSearch()} className="absolute right-0  flex items-center justify-center w-[50px]" variant="ghost">
          <IoMdSearch size={24} />
        </Button>
      </div>
      
    </div>
  )
}