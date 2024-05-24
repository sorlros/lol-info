import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { puuid: string }}) {
  const { puuid } = params;
  console.log("puuid", puuid)

  if (!puuid || typeof puuid !== "string") {
    return NextResponse.json({error: "puuid 오류"});
  }
  
  try {
    const response = await fetch(`https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`, {
      method: "GET",
      headers: {
        "X-Riot-Token": process.env.NEXT_PUBLIC_LOL_DEVELOPMENT_API_KEY as string
      }
    })

    if (!response.ok) {
      throw new Error("Summoner Info fetching 오류 발생");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({error: error}, {status: 500})
  }
}