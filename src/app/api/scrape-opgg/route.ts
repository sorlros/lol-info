import cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { TeamsProps } from '@/types/types';

export async function GET(req: NextRequest) {
  try {
  
    const url = 'https://esports.op.gg/leagues/LCK/2024/Summer';
    
    const response = await axios.get(url, {
      method: "GET"
    });
    const html = response.data;

    const $ = cheerio.load(html);

    const teams: TeamsProps[] = [];
    $('tbody tr').each((index, element) => {
      const rank = $(element).find('td').eq(0).text().trim(); // 순위
      const teamName = $(element).find('img').attr('alt') || ''; // 팀 이름
      const record = $(element).find('td').eq(2).text().trim(); // 전적
      const wins = $(element).find('td').eq(3).text().trim(); // 승리 횟수
      const losses = $(element).find('td').eq(4).text().trim(); // 패배 횟수
      const winRate = $(element).find('td').eq(5).text().trim(); // 승률
      
      // 추출한 데이터를 객체에 저장 후 배열에 추가
      teams.push({
        rank,
        teamName,
        record,
        wins,
        losses,
        winRate,
      });
    });

    return NextResponse.json(teams);
  } catch (error) {
    return NextResponse.json({error: error}, {status: 500})
  }
}