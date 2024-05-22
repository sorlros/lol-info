import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: {matchId: string}}) {
  const { matchId } = params;

  console.log("matchId", matchId)
  if (!matchId || typeof matchId !== "string") { 
    return new Response("matchIds 오류", { status: 400 });
  }

  try {
      console.log("in matchId", matchId);
      const response = await fetch(`https://asia.api.riotgames.com/lol/match/v5/matches/${matchId}`, {
        method: "GET",
        headers: {
          "X-Riot-Token": process.env.NEXT_PUBLIC_LOL_DEVELOPMENT_API_KEY as string
        }
      })
    
      if (!response.ok) {
        throw new Error("matches fetching 오류 발생");
      }

      const data = await response.json();
      const dataString = JSON.stringify(data);
      return new Response(dataString, { status: 200, headers: { 'Content-Type': 'application/json' } });
      // return new Response(data, { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(`Error: ${error}`, { status: 500 });
  }
}
