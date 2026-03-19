import { NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || 'research funding opportunities 2025';
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    const zai = await ZAI.create();
    
    const results = await zai.functions.invoke('web_search', {
      query: `${query} research PhD postdoc funding`,
      num: limit,
    });

    // Process and categorize results
    const processedResults = results.map((item: any) => ({
      ...item,
      category: categorizeResult(item.name + ' ' + item.snippet),
      relevanceScore: calculateRelevance(item),
    }));

    return NextResponse.json({
      success: true,
      query,
      timestamp: new Date().toISOString(),
      results: processedResults,
      total: processedResults.length,
    });
  } catch (error) {
    console.error('Research search error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch research data' },
      { status: 500 }
    );
  }
}

function categorizeResult(text: string): string {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('phd') || lowerText.includes('doctoral')) return 'PhD';
  if (lowerText.includes('postdoc') || lowerText.includes('post-doc')) return 'Postdoc';
  if (lowerText.includes('funding') || lowerText.includes('grant')) return 'Funding';
  if (lowerText.includes('job') || lowerText.includes('position')) return 'Job';
  if (lowerText.includes('conference') || lowerText.includes('call for papers')) return 'Conference';
  
  return 'Research';
}

function calculateRelevance(item: any): number {
  let score = 50;
  
  if (item.snippet && item.snippet.length > 100) score += 20;
  if (item.date && item.date !== 'N/A') score += 15;
  if (item.host_name.includes('.edu') || item.host_name.includes('.ac.')) score += 15;
  
  return Math.min(score, 100);
}
