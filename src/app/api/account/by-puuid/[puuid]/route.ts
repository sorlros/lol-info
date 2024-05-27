import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: {params: { puuid: string }}) {
  const { puuid } = params;

  if (!puuid) {
    return NextResponse.json({error: "소환사명 혹은 태그ID가 일치하지 않습니다."})
  }

  try {
    const response = await fetch(`https://asia.api.riotgames.com/riot/account/v1/accounts/by-puuid/${puuid}`, {
      method: "GET",
      headers: {
        "X-Riot-Token": process.env.NEXT_PUBLIC_LOL_DEVELOPMENT_API_KEY as string
      }
    })

    if (!response.ok) {
      throw new Error("fetching data 오류 발생");
    }
    console.log("response", response)
    const data = await response.json();
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({error: error}, {status: 500})
  }
}