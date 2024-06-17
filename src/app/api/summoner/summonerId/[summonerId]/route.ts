import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { summonerId: string }}) {
  const { summonerId } = params;

  if (!summonerId || typeof summonerId !== "string") {
    return NextResponse.json({error: "summonerId 검색 오류"});
  }
  
  try {
    const response = await fetch(`https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`, {
      method: "GET",
      headers: {
        "X-Riot-Token": process.env.NEXT_PUBLIC_LOL_DEVELOPMENT_API_KEY as string
      }
    })

    if (!response.ok) {
      throw new Error("tier info fetching error");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({error: error}, {status: 500})
  }
}