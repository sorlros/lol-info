"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { IoMdSearch } from "react-icons/io";

export const SummonerName = () => {
  const [inputValue, setInputValue] = useState("");
  // const [gameName, setGameName] = useState("");
  // const [tagLine, setTagLine] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  
  const handleSearch = async () => {
    try {
      const [gameName, tagLine] = inputValue.split("#");
      if (!gameName || !tagLine) {
        setError(`소환사명 혹은 태그ID가 일치하지 않습니다. 유효한 형식은 "소환사명#태그ID" 입니다.`);
        setResult(null);
        return;
      }

      const response = await fetch(`/api/account?gameName=${gameName}&tagLine=${tagLine}`);
      if (!response.ok) {
        throw new Error("fetched data 오류");
      }
      const data = await response.json();
      console.log("data", data);
    } catch (error) {
      setResult(null);
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