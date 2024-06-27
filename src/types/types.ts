export interface Match {
  metadata: MetaData;
  info: Info
}
export interface MetaData {
  dataVersion: string;
  matchId: string;
  participants: Array<string>;
}

type TeamId = 100 | 200;

export interface Participant {
  assists: number;
  bountyLevel: number;
  champExperience: number;
  championName: string;
  damageDealtToTurrets: number;
  deaths: number;
  detectorWardsPlaced: number;
  doubleKills: number;
  goldEarned: number;
  individualPosition: string;
  kills: number;
  lane: string;
  magicDamageDealtToChampions: number;
  magicDamageTaken: number;
  pentaKills: number;
  physicalDamageDealtToChampions: number;
  physicalDamageTaken: number;
  quadraKills: number;
  role: string;
  summonerName: string;
  timePlayed: number;
  totalDamageDealtToChampions: number;
  totalDamageTaken: number;
  totalHeal: number;
  tripleKills: number;
  turretKills: number;
  visionScore: number;
  wardsKilled: number;
  wardsPlaced: number;
  challenges: Challenges;
  puuid: string;
  item0: number;
  item1: number; 
  item2: number;
  item3: number; 
  item4: number;
  item5: number; 
  item6: number;
  summoner1Id: number;
  summoner2Id: number;
  win: boolean;
  perks: Perks;
  teamId: TeamId;
  totalMinionsKilled: number;
  neutralMinionsKilled: number;
  riotIdGameName: string;
  riotIdTagline: number;
}

export interface Perks {
  styles: Styles[]
}

export interface Styles {
  selections: Selections[];
  style: number;
}

export interface Selections {
  perk: number;
  var1: number;
  var2: number;
  var3: number;
}

export interface Info {
  gameMode: string;
  gameType: string;
  gameCreation: number;
  participants: Array<Participant>
  gameDuration: number;
  teams: Teams[];
}

export interface Teams {
  objectives: {
    champion: {
      kills: number,
      first: boolean
    },
    tower: {
      kills: number,
      first: boolean,
    }
  }
}

export interface Challenges {
  baronTakedowns: number;
  bountyGold: number;
  damagePerMinute: number;
  damageTakenOnTeamPercentage: number;
  dragonTakedowns: number;
  gameLength: number;
  goldPerMinute: number;
  kda: number;
  laneMinionsFirst10Minutes: number;

}

export interface SpellMapping {
  [key: number]: string;
}

export interface TierData {
  leagueId: string;
  queueType: string;
  tier: string;
  rank: string;
  summonerId: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
}

export interface TeamsProps {
  rank: string;
  teamName: string;
  record: string;
  wins: string;
  losses: string;
  winRate: string;
}