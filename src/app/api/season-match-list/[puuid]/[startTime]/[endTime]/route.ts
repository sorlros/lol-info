import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { puuid: string, startTime: number, endTime: number }}) {
  const { puuid, startTime, endTime } = params;
  
  if (!puuid) {
    return NextResponse.json({error: "puuid의 값이 올바르지 않습니다."})
  } else if (!startTime) {
    return NextResponse.json({error: "startTime 값이 올바르지 않습니다."})
  } else if (!endTime) {
    return NextResponse.json({error: "endTime 값이 올바르지 않습니다."})
  }

  try {
    const response = await fetch(`https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?startTime=${startTime}&endTime=${endTime}&start=0&count=20` ,{
      method: "GET",
      headers: {
        "X-Riot-Token": process.env.NEXT_PUBLIC_LOL_DEVELOPMENT_API_KEY as string
      }
    });

    if (!response.ok) {
      throw new Error("season 매치전적 fetching 오류");
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({error: error}, {status: 500})
  }
}