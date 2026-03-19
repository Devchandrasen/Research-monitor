import { NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get('topic') || 'scientific research breakthroughs';
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    const zai = await ZAI.create();
    
    const results = await zai.functions.invoke('web_search', {
      query: `${topic} latest news 2025`,
      num: limit,
      recency_days: 7,
    });

    // Process news results
    const newsItems = results.map((item: any, index: number) => ({
      id: `news-${index}`,
      title: item.name,
      source: item.host_name || 'Unknown',
      snippet: item.snippet,
      url: item.url,
      date: item.date,
      timestamp: getTimeAgo(item.date),
    }));

    return NextResponse.json({
      success: true,
      topic,
      timestamp: new Date().toISOString(),
      news: newsItems,
      total: newsItems.length,
    });
  } catch (error) {
    console.error('News fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

function getTimeAgo(dateStr: string): string {
  if (!dateStr || dateStr === 'N/A') return 'Recently';
  
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  } catch {
    return 'Recently';
  }
}
