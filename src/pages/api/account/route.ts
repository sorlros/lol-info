import { NextRequest, NextResponse } from "next/server";

export default async function handler(req: NextRequest, { params }: {params: { gameName: string, tagLine: string}}) {
  console.log("api 진입")
  const gameName = params.gameName;
  const tagLine = params.tagLine;

  // const { gameName, tagLine } = await req.query;

  if (!gameName || !tagLine) {
    return NextResponse.json({error: "소환사명 혹은 태그ID가 일치하지 않습니다."})
  }

  try {
    const response = await fetch(`https://riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`, {
      method: "GET",
      headers: {
        "X-Riot-Token": process.env.NEXT_PUBLIC_LOL_DEVELOPMENT_API_KEY as string
      }
    })

    if (!response.ok) {
      throw new Error("fetching data 오류 발생");
    }

    const data = await response.json();
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({error: error})
  }
}