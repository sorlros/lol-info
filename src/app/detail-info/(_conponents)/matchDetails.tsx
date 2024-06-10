import { Match, Participant } from "@/types/types";
import Image from "next/image";

interface MatchDetailProps {
  matchInfo: Match;
  isOpen: boolean[];
  myMatchInfoData: Participant[];
  idx: number;
}

const MatchDetails = ({ matchInfo, isOpen, idx, myMatchInfoData }: MatchDetailProps) => {
  const winEmptyItem = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60qxkwAAAABJRU5ErkJggg==";

  const loseEmptyItem = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/Z8iL5wAAAABJRU5ErkJggg==";


  const myParticipant = myMatchInfoData[idx];
  const myTeam = matchInfo.info.participants.filter(participant => participant.teamId === myParticipant.teamId);
  const enemyTeam = matchInfo.info.participants.filter(participant => participant.teamId !== myParticipant.teamId);

  const getMyChampImage = (idx: number) => {
    const champName = participant[idx].championName;
    const url = `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/${champName}.png`;
    return url;
  }

  return (
    <div className={`${isOpen[idx] ? "w-full h-[541px] absolute rounded-lg mt-2 left-0 top-[96px]" : "hidden"}`}>
      {/* 검색한 소환사의 팀 */}
      <ul className="flex w-full h-[33px] text-[14px] rounded-t-lg bg-[#28282b]">
        <li className="flex justify-center items-center w-[175px] text-[#7B7A8E]">
          {myParticipant.win ? "승리" : "패배"}
        </li>
        <li className="flex justify-center items-center w-[68px] h-full text-[#7B7A8E]">OP 스코어</li>
        <li className="flex justify-center items-center w-[98px] text-[#7B7A8E]">KDA</li>
        <li className="flex justify-center items-center w-[120px] text-[#7B7A8E]">피해량</li>
        <li className="flex justify-center items-center w-[48px] text-[#7B7A8E]">와드</li>
        <li className="flex justify-center items-center w-[56px] text-[#7B7A8E]">CS</li>
        <li className="flex justify-center items-center w-[175px] text-[#7B7A8E]">아이템</li>
      </ul>
      <div className={`${myParticipant.win ? "flex w-full h-[249px] rounded-b-lg bg-[#28344E]" : "flex w-full h-[249px] rounded-b-lg bg-[#703C47]"}`}>
        <div className="flex flex-col w-full h-[210px]">
          {
            myTeam.map((participant, idx) => (
              <div key={participant.puuid} className="flex w-full">
                <div className="flex justify-center items-center w-[175px] h-[42px]">
                  <div className="w-[44px] h-[42px] rounded-lg">
                    <Image 
                      src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/${participant.championName}.png`}
                      alt="ChampImage"
                      style={{ width: "auto", height: "auto", border: "50%" }}
                      width={32}
                      height={32}
                    />
                  </div>
                  {participant.summonerName}
                </div>
                <div className="flex justify-center items-center w-[68px] h-[42px]">{/* OP 스코어 */}</div>
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

      {/* 상대 팀 */}
      <ul className="flex w-full h-[33px] text-[14px] rounded-t-lg bg-[#28282b] mt-2">
        <li className="flex justify-center items-center w-[175px] text-[#7B7A8E]">
          {myParticipant.win ? "패배" : "승리"}
        </li>
        <li className="flex justify-center items-center w-[68px] h-full text-[#7B7A8E]">OP 스코어</li>
        <li className="flex justify-center items-center w-[98px] text-[#7B7A8E]">KDA</li>
        <li className="flex justify-center items-center w-[120px] text-[#7B7A8E]">피해량</li>
        <li className="flex justify-center items-center w-[48px] text-[#7B7A8E]">와드</li>
        <li className="flex justify-center items-center w-[56px] text-[#7B7A8E]">CS</li>
        <li className="flex justify-center items-center w-[175px] text-[#7B7A8E]">아이템</li>
      </ul>
      <div className={`${myParticipant.win ? "flex w-full h-[249px] rounded-b-lg bg-[#703C47]" : "flex w-full h-[249px] rounded-b-lg bg-[#28344E]"}`}>
        <div className="flex flex-col w-full h-[210px]">
          {
            enemyTeam.map((participant, idx) => (
              <div key={participant.puuid} className="flex w-full">
                <div className="flex justify-center items-center w-[175px] h-[42px]">
                  <div className="w-[44px] h-[42px] rounded-lg">
                    <Image 
                      src={`https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/${participant.championName}.png`}
                      alt="ChampImage"
                      style={{ width: "auto", height: "auto", border: "50%" }}
                      width={32}
                      height={32}
                    />
                  </div>
                  {participant.summonerName}
                </div>
                <div className="flex justify-center items-center w-[68px] h-[42px]">{/* OP 스코어 */}</div>
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
