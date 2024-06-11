import { Match, Participant, SpellMapping } from "@/types/types";
import runeInfoData from "@/json/runeInfo.json";

export const spellMapping: SpellMapping = {
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

export const calculateDaysAgo = (gameCreation: number) => {
  const now = new Date().getTime();
  const daysAgo = Math.floor((now - gameCreation) / (1000 * 60 * 60 * 24));
  return `${daysAgo}일 전`
}

export const getSpellImageUrl = (spellId: number): string => {
  const spellName = spellMapping[spellId];
  return `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/spell/${spellName}.png`;
};

export const formatGameDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}분 ${remainingSeconds}초`;
};

export const getIconFromId = (id: number): string => {
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

export const getRuneImageUrl = (id: number) => {
  return `https://ddragon.leagueoflegends.com/cdn/img/${getIconFromId(id)}`;
}

export const getMyChampImage = (idx: number, data: Participant[]) => {
  const champName = data[idx].championName;
  const url = `https://ddragon.leagueoflegends.com/cdn/14.10.1/img/champion/${champName}.png`;
  return url;
}

export const calculateKillEngagementRate = (idx: number, matchInfo: Match[], myMatchInfo: Participant[]) => {
  let allKills;
  let rate;

  if (myMatchInfo[idx].teamId === 100) {
    allKills = matchInfo[idx].info.teams[0].objectives.champion.kills;
    rate = Math.ceil((myMatchInfo[idx].kills + myMatchInfo[idx].assists) / allKills * 100);
  } else if (myMatchInfo[idx].teamId === 200) {
    allKills = matchInfo[idx].info.teams[1].objectives.champion.kills;
    rate = Math.ceil((myMatchInfo[idx].kills + myMatchInfo[idx].assists) / allKills * 100);
  }

  if (rate !== undefined) {
    return rate.toString();
  } else {
    return "";
  }
}

export const totalMinions = (idx: number, myMatchInfo: Participant[]) => {
  const allMinions = myMatchInfo[idx].totalMinionsKilled + myMatchInfo[idx].neutralMinionsKilled;
  return allMinions;
}