import { Match, Participant } from "@/types/types";
import Image from "next/image";
import runeInfoData from "@/json/runeInfo.json";
import { getRuneImageUrl, getSpellImageUrl } from "@/lib/tools";

interface MatchDetailProps {
  currentMatchInfo: Match;
  isOpen: boolean[];
  myMatchInfoData: Participant[];
  idx: number;
}

const MatchDetails = ({ currentMatchInfo, isOpen, idx, myMatchInfoData }: MatchDetailProps) => {
  const winEmptyItem = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60qxkwAAAABJRU5ErkJggg==";

  const loseEmptyItem = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/Z8iL5wAAAABJRU5ErkJggg==";


  const myParticipant = myMatchInfoData[idx];
  const myTeam = currentMatchInfo.info.participants.filter(participant => participant.teamId === myParticipant.teamId);
  const enemyTeam = currentMatchInfo.info.participants.filter(participant => participant.teamId !== myParticipant.teamId);

  return (
    <div className={`${isOpen[idx] ? "w-full h-[694px] absolute rounded-lg mt-2 left-0 top-[96px]" : "hidden"}`}>
      {/* 검색한 소환사의 팀 */}
      <ul className="flex w-full h-[33px] text-[14px] rounded-t-lg bg-[#28282b]">
        <li className="flex justify-center items-center w-[243px] text-[#7B7A8E]">
          {myParticipant.win ? "승리" : "패배"}
        </li>
        <li className="flex justify-center items-center w-[98px] text-[#7B7A8E]">KDA</li>
        <li className="flex justify-center items-center w-[120px] text-[#7B7A8E]">피해량</li>
        <li className="flex justify-center items-center w-[48px] text-[#7B7A8E]">와드</li>
        <li className="flex justify-center items-center w-[56px] text-[#7B7A8E]">CS</li>
        <li className="flex justify-center items-center w-[175px] text-[#7B7A8E]">아이템</li>
      </ul>
      <div className={`${myParticipant.win ? "flex w-full h-[250px] pt-2 rounded-b-lg justify-center bg-[#28344E] text-[#7B7A8E]" : "flex w-full h-[250px] pt-2 rounded-b-lg justify-center bg-[#703C47] text-[#7B7A8E]"}`}>
        <div className="flex flex-col w-full h-[210px]">
          {
            myTeam.map((participant, idx) => (
              <div key={participant.puuid} className="flex w-full h-full space-y-1 justify-center items-center text-[14px]">
                <div className="flex justify-center items-center w-[243px] h-[42px] ml-[-10px]">
                  <div className="flex w-[40px] h-[40px] rounded-full overflow-hidden mr-1">
                    <Image 
                      src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/${participant.championName}.png`}
                      alt="ChampImage"
                      style={{ width: "auto", height: "auto"}}
                      width={32}
                      height={32}
                    />
                  </div>
                  <div className="flex flex-col w-[18px] h-[42px] items-center gap-y-1">
                    <div className="w-[18px] h-[18px] rounded-full">
                      <Image 
                        src={getSpellImageUrl(participant.summoner1Id)}
                        alt="소환사 스펠"
                        width={18}
                        height={18}
                        style={{ width: "auto", height: "auto" }}
                      />
                    </div>
                    
                    <div className="w-[18px] h-[18px] rounded-full">
                      <Image 
                        src={getSpellImageUrl(participant.summoner2Id)}
                        alt="소환사 스펠"
                        width={18}
                        height={18}
                        style={{ width: "auto", height: "auto" }}

                      />
                    </div>
                    
                  </div>
                  <div className="flex flex-col w-[18px] h-full ml-1 mr-2 gap-y-1">
                    <Image 
                      src={getRuneImageUrl(participant.perks.styles[0].selections[0].perk)}
                      alt="메인룬 이미지"
                      width={18}
                      height={18}
                      style={{ width: "auto", height: "auto" }}
                    />
                      <Image 
                      src={getRuneImageUrl(participant.perks.styles[1].style)}
                      alt="부룬 이미지"
                      width={18}
                      height={18}
                      style={{ width: "auto", height: "auto" }}
                    />
                  </div>
                  <div className="flex w-[90px] h-full text-white text-[12px] overflow-ellipsis whitespace-nowrap">
                    {participant.summonerName}
                  </div>
                </div>
                <div className="flex justify-center items-center w-[98px] h-[42px]">
                  {participant.kills}/{participant.deaths}/{participant.assists}
                </div>
                <div className="flex justify-center items-center w-[120px] h-[42px]">
                  {participant.totalDamageDealtToChampions}
                </div>
                <div className="flex justify-center items-center w-[48px] h-[42px]">
                  {participant.wardsPlaced}
                </div>
                <div className="flex justify-center items-center w-[56px] h-[42px]">
                  {participant.totalMinionsKilled}
                </div>
                <div className="flex justify-center items-center w-[175px] h-[42px]">
                  <Image 
                    src={
                      participant.item0 === 0 
                      ? (participant.win ? winEmptyItem : loseEmptyItem)
                      : `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${participant.item0}.png`
                    }
                    alt={`Item ${idx}`}
                    width={22}
                    height={22}
                  />
                  <Image 
                    src={
                      participant.item1 === 0 
                      ? (participant.win ? winEmptyItem : loseEmptyItem)
                      : `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${participant.item1}.png`
                    }
                    alt={`Item ${idx}`}
                    width={22}
                    height={22}
                  />
                  <Image 
                    src={
                      participant.item2 === 0 
                      ? (participant.win ? winEmptyItem : loseEmptyItem)
                      : `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${participant.item2}.png`
                    }
                    alt={`Item ${idx}`}
                    width={22}
                    height={22}
                  />
                  <Image 
                    src={
                      participant.item3 === 0 
                      ? (participant.win ? winEmptyItem : loseEmptyItem)
                      : `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${participant.item3}.png`
                    }
                    alt={`Item ${idx}`}
                    width={22}
                    height={22}
                  />
                  <Image 
                    src={
                      participant.item4 === 0 
                      ? (participant.win ? winEmptyItem : loseEmptyItem)
                      : `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${participant.item4}.png`
                    }
                    alt={`Item ${idx}`}
                    width={22}
                    height={22}
                  />
                  <Image 
                    src={
                      participant.item5 === 0 
                      ? (participant.win ? winEmptyItem : loseEmptyItem)
                      : `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${participant.item5}.png`
                    }
                    alt={`Item ${idx}`}
                    width={22}
                    height={22}
                  />
                  <Image
                    src={
                      participant.item6 === 0 
                      ? (participant.win ? winEmptyItem : loseEmptyItem)
                      : `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${participant.item6}.png`
                    }
                    alt={`Item ${idx}`}
                    width={22}
                    height={22}
                  />
                </div>
              </div>
            ))
          }
        </div>
      </div>

      {/* 상대 팀 */}
      <ul className="flex w-full h-[33px] text-[14px] rounded-t-lg bg-[#28282b] mt-2">
      <li className="flex justify-center items-center w-[243px] text-[#7B7A8E]">
          {myParticipant.win ? "패배" : "승리"}
        </li>
        <li className="flex justify-center items-center w-[98px] text-[#7B7A8E]">KDA</li>
        <li className="flex justify-center items-center w-[120px] text-[#7B7A8E]">피해량</li>
        <li className="flex justify-center items-center w-[48px] text-[#7B7A8E]">와드</li>
        <li className="flex justify-center items-center w-[56px] text-[#7B7A8E]">CS</li>
        <li className="flex justify-center items-center w-[175px] text-[#7B7A8E]">아이템</li>
      </ul>
      
      <div className={`${myParticipant.win ? "flex w-full h-[250px] pt-2 rounded-b-lg justify-center bg-[#703C47] text-[#7B7A8E]" : "flex w-full h-[250px] pt-2 rounded-b-lg justify-center bg-[#28344E] text-[#7B7A8E]"}`}>
        <div className="flex flex-col w-full h-[210px]">
          {
            enemyTeam.map((participant, idx) => (
              <div key={participant.puuid} className="flex w-full h-full space-y-1 justify-center items-center text-[14px]">
                <div className="flex justify-center items-center w-[243px] h-[42px] ml-[-10px]">
                  <div className="flex w-[40px] h-[40px] rounded-full overflow-hidden mr-1">
                    <Image 
                      src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/${participant.championName}.png`}
                      alt="챔피언이미지"
                      style={{ width: "auto", height: "auto"}}
                      width={32}
                      height={32}
                    />
                  </div>
                  <div className="flex flex-col w-[18px] h-[42px] items-center gap-y-1">
                    <div className="w-[18px] h-[18px] rounded-full">
                      <Image 
                        src={getSpellImageUrl(participant.summoner1Id)}
                        alt="소환사 스펠"
                        width={18}
                        height={18}
                        style={{ width: "18px", height: "18px" }}

                      />
                    </div>
                    
                    <div className="w-[18px] h-[18px] rounded-full">
                      <Image 
                        src={getSpellImageUrl(participant.summoner2Id)}
                        alt="소환사 스펠"
                        width={18}
                        height={18}
                        style={{ width: "18px", height: "18px" }}

                      />
                    </div>
                    
                  </div>
                  <div className="flex flex-col w-[18px] h-full ml-1 mr-2 gap-y-1">
                    <Image 
                      src={getRuneImageUrl(participant.perks.styles[0].selections[0].perk)}
                      alt="메인룬 이미지"
                      width={18}
                      height={18}
                      style={{ width: "18px", height: "18px" }}
                    />
                      <Image 
                      src={getRuneImageUrl(participant.perks.styles[1].style)}
                      alt="부룬 이미지"
                      width={18}
                      height={18}
                      style={{ width: "18px", height: "18px" }}
                    />
                  </div>
                  <div className="flex w-[90px] h-full text-white text-[12px] overflow-ellipsis whitespace-nowrap">
                    {participant.summonerName}
                  </div>
                </div>
                <div className="flex justify-center items-center w-[98px] h-[42px]">{participant.kills}/{participant.deaths}/{participant.assists}</div>
                <div className="flex justify-center items-center w-[120px] h-[42px]">{participant.totalDamageDealtToChampions}</div>
                <div className="flex justify-center items-center w-[48px] h-[42px]">{participant.wardsPlaced}</div>
                <div className="flex justify-center items-center w-[56px] h-[42px]">{participant.totalMinionsKilled}</div>
                <div className="flex justify-center items-center w-[175px] h-[42px]">
                  <Image 
                    src={
                      participant.item0 === 0 
                      ? (participant.win ? winEmptyItem : loseEmptyItem)
                      : `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${participant.item0}.png`
                    }
                    alt={`Item ${idx}`}
                    width={22}
                    height={22}
                  />
                  <Image 
                    src={
                      participant.item1 === 0 
                      ? (participant.win ? winEmptyItem : loseEmptyItem)
                      : `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${participant.item1}.png`
                    }
                    alt={`Item ${idx}`}
                    width={22}
                    height={22}
                  />
                  <Image 
                    src={
                      participant.item2 === 0 
                      ? (participant.win ? winEmptyItem : loseEmptyItem)
                      : `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${participant.item2}.png`
                    }
                    alt={`Item ${idx}`}
                    width={22}
                    height={22}
                  />
                  <Image 
                    src={
                      participant.item3 === 0 
                      ? (participant.win ? winEmptyItem : loseEmptyItem)
                      : `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${participant.item3}.png`
                    }
                    alt={`Item ${idx}`}
                    width={22}
                    height={22}
                  />
                  <Image 
                    src={
                      participant.item4 === 0 
                      ? (participant.win ? winEmptyItem : loseEmptyItem)
                      : `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${participant.item4}.png`
                    }
                    alt={`Item ${idx}`}
                    width={22}
                    height={22}
                  />
                  <Image 
                    src={
                      participant.item5 === 0 
                      ? (participant.win ? winEmptyItem : loseEmptyItem)
                      : `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${participant.item5}.png`
                    }
                    alt={`Item ${idx}`}
                    width={22}
                    height={22}
                  />
                  <Image
                    src={
                      participant.item6 === 0 
                      ? (participant.win ? winEmptyItem : loseEmptyItem)
                      : `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${participant.item6}.png`
                    }
                    alt={`Item ${idx}`}
                    width={22}
                    height={22}
                  />
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;
