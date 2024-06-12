import { selectEncryptedSummonerId } from "@/features/summonerSlice"
import { useEffect } from "react";
import { useSelector } from "react-redux";

export const UserChampInfo = () => {
  const encryptedSummonerId = useSelector(selectEncryptedSummonerId);

  useEffect(() => {
    console.log("encryptedSummonerId: ", encryptedSummonerId)
  }, [encryptedSummonerId])
  return (
    <div className="flex w-[332px] h-[1000px] rounded-lg bg-[#28344E]">
      right
      {/* [
    {
        "leagueId": "leagueId",
        "queueType": "RANKED_SOLO_5x5",
        "tier": "GOLD",
        "rank": "IV",
        "summonerId": "encryptedSummonerId",
        "summonerName": "summonerName",
        "leaguePoints": 42,
        "wins": 50,
        "losses": 45,
        "veteran": false,
        "inactive": false,
        "freshBlood": false,
        "hotStreak": true
    }
] */}
    </div>
  )
}