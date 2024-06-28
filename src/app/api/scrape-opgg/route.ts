import * as cheerio from 'cheerio';
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { TeamsProps } from '@/types/types';
import puppeteer from 'puppeteer-core';
import { fetchHtml } from '@/lib/crawler/fetchHtml';
import { parseHtml } from '@/lib/crawler/parseHtml';

export async function GET(req: NextRequest) {
  try {
    const url = 'https://www.op.gg';
    const html = await fetchHtml(url);
    const teams = await parseHtml(html);

    console.log("teams", teams)
    return NextResponse.json(teams);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
