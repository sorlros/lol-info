// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//     try {
//       const url = 'https://esportapi1.p.rapidapi.com/api/esport/tournament/16026/season/47832/matches/next/%7Bpage%7D';
//       const options = {
//         method: 'GET',
//         headers: {
//           'x-rapidapi-key': '6ba92a00fcmsh5a9d65188f14d6ep15bd6ajsn9db9be2498e3',
//           'x-rapidapi-host': 'esportapi1.p.rapidapi.com'
//         }
//       };

//       const response = await fetch(url, options);
//       const result = await response.text();
//       console.log(result);
//       return NextResponse.json(result)
//     } catch (error) {
//       return NextResponse.json({error: error}, {status: 500})
//     }
// }

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

  try {
    const apiKey = process.env.NEXT_PUBLIC_PANDASCORE_API_KEY as string;
    if (!apiKey) {
      throw new Error("API key is not set in environment variables");
    }

    const leagueId = '419'; // LCK 리그 ID
    const url = `https://api.pandascore.co/leagues/419/matches/upcoming?filter[match_type][0]=all_games_played&filter[status][0]=canceled&filter[videogame][0]=1&filter[winner_type][0]=Player&range[detailed_stats][0]=true&range[detailed_stats][1]=true&range[draw][0]=true&range[draw][1]=true&range[forfeit][0]=true&range[forfeit][1]=true&range[match_type][0]=all_games_played&range[match_type][1]=all_games_played&range[status][0]=canceled&range[status][1]=canceled&range[winner_type][0]=Player&range[winner_type][1]=Player&sort=begin_at&page=1&per_page=50`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error("matches fetching 오류 발생");
    }

    const data = await response.json();
    const dataString = JSON.stringify(data);
    console.log("string", dataString)
    return new Response(dataString, { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(`Error: ${error}`, { status: 500 });
  }
}
