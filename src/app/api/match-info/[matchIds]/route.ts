import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: {matchIds: string[]}}) {
  const { matchIds } = params;

  console.log("matchId", matchIds)
  if (!matchIds || !Array.isArray(matchIds)) {
    return NextResponse.json({error: "matchIds 오류"});
  }

  try {
    const fetchMatchInfo = async (matchId: string) => {
      const response = await fetch(`https://asia.api.riotgames.com/lol/match/v5/matches/${matchId}`, {
        method: "GET",
        headers: {
          "X-Riot-Token": process.env.NEXT_PUBLIC_LOL_DEVELOPMENT_API_KEY as string
        }
      })

      if (!response.ok) {
        throw new Error("matches fetching 오류 발생");
      }

      return response.json();
    }
    
    const matchInfoPromises = matchIds.map(matchId => fetchMatchInfo(matchId))
    console.log("matchInfoPromises", matchInfoPromises)
    const matchInfos = await Promise.all(matchInfoPromises);

    return NextResponse.json(matchInfos);
  } catch (error) {
    return NextResponse.json({error: error}, {status: 500})
  }
}
