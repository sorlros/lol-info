import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

  // try {
  //   const apiKey = process.env.NEXT_PUBLIC_RAPID_API_KEY;
  //   if (!apiKey) {
  //     throw new Error("API key is not set in environment variables");
  //   }
    
  //   const leagueId = "98767991310872058"; // LCK 리그 ID
  //   // const url = `https://league-of-legends-esports.p.rapidapi.com/schedule?leagueId=${leagueId}`;

  //   const url = 'https://esportapi1.p.rapidapi.com/api/esport/tournament/16026/season/47832/matches/next/%7Bpage%7D';
  //   const options = {
  //     method: 'GET',
  //     headers: {
  //       'x-rapidapi-key': '6ba92a00fcmsh5a9d65188f14d6ep15bd6ajsn9db9be2498e3',
  //       'x-rapidapi-host': 'esportapi1.p.rapidapi.com'
  //     }
  //   };

    try {
        const url = 'https://esportapi1.p.rapidapi.com/api/esport/tournament/16026/season/47832/matches/next/%7Bpage%7D';
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '6ba92a00fcmsh5a9d65188f14d6ep15bd6ajsn9db9be2498e3',
        'x-rapidapi-host': 'esportapi1.p.rapidapi.com'
      }
    };

      const response = await fetch(url, options);
      const result = await response.text();
      console.log(result);
      return NextResponse.json(result)
    } catch (error) {
      return NextResponse.json({error: error}, {status: 500})
    }
    
  //   const response = await fetch(url, {
  //     headers: {
  //       "x-rapidapi-host": "league-of-legends-esports.p.rapidapi.com",
  //       "x-rapidapi-key": apiKey
  //     }
  //   });
  
  //   if (!response.ok) {
  //     throw new Error("matches fetching 오류 발생");
  //   }

  //   const data = await response.json();
  //   const dataString = JSON.stringify(data);
  //   return new Response(dataString, { status: 200, headers: { 'Content-Type': 'application/json' } });
  // } catch (error) {
  //   return new Response(`Error: ${error}`, { status: 500 });
  // }
}
