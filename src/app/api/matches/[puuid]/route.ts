import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { puuid: string }}) {
  const { puuid } = params;
  const start = req.nextUrl.searchParams.get('start');
  // console.log("start", start)

  if (!puuid || typeof puuid !== "string") {
    return NextResponse.json({error: "puuid의 값이 올바르지 않습니다."})
  }

  try {
    const startTime = 1715793600;
    const endTime = 1726003199;

    if (start) {
      // console.log("추가 정보 api")
      const response = await fetch(`https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?startTime=${startTime}&endTime=${endTime}&start=${start}&count=10`, {
        method: "GET",
        headers: {
          "X-Riot-Token": process.env.NEXT_PUBLIC_LOL_DEVELOPMENT_API_KEY as string
        }
      })

      if (!response.ok) {
        throw new Error("matches fetching 오류 발생");
      }

      const data = await response.json();
      return NextResponse.json(data);
    }
    
    // console.log("초기 정보 api")
    const response = await fetch(`https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?startTime=${startTime}&endTime=${endTime}&start=0&count=20`, {
      method: "GET",
      headers: {
        "X-Riot-Token": process.env.NEXT_PUBLIC_LOL_DEVELOPMENT_API_KEY as string
      }
    })

    if (!response.ok) {
      throw new Error("matches fetching 오류 발생");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({error: error}, {status: 500})
  }
}