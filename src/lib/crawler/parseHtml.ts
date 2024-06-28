import { load } from 'cheerio';
import { TeamsProps } from '@/types/types';
import * as cheerio from 'cheerio';

export async function parseHtml(html: string) {
  const $ = load(html);
  const results: TeamsProps[] = [];

  // Cheerio를 사용하여 원하는 요소를 선택하고 데이터 추출
  $('.css-1hs0k1j ul li a').each((index, element) => {
    const rank = $(element).find('.esports-rank').text().trim();
    const teamName = $(element).find('.esports-name').text().trim();
    const record = $(element).find('.esports-win-lose').text().trim();
    const wins = record.split('W')[0].trim();
    const losses = record.split('W')[1].split('L')[0].trim();
    const totalGames = parseInt(wins) + parseInt(losses);
    const winRate = totalGames > 0 ? ((parseInt(wins) / totalGames) * 100).toFixed(2) + '%' : '0%';

    results.push({
      rank,
      teamName,
      record,
      wins,
      losses,
      winRate,
    });
  });

  console.log("results", results)

  return results;
}
