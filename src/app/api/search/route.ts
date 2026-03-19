import { NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const type = searchParams.get('type') || 'all';
  const field = searchParams.get('field');
  const country = searchParams.get('country');
  const limit = parseInt(searchParams.get('limit') || '20');

  if (!query) {
    return NextResponse.json(
      { success: false, error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const zai = await ZAI.create();
    
    // Build search query based on filters
    let searchQuery = query;
    
    if (type === 'phd') {
      searchQuery = `${query} PhD position doctoral program`;
    } else if (type === 'postdoc') {
      searchQuery = `${query} postdoc postdoctoral position`;
    } else if (type === 'funding') {
      searchQuery = `${query} research funding grant call`;
    } else if (type === 'conference') {
      searchQuery = `${query} conference call for papers`;
    }
    
    if (field) {
      searchQuery = `${searchQuery} ${field}`;
    }
    
    if (country) {
      searchQuery = `${searchQuery} ${country}`;
    }
    
    const results = await zai.functions.invoke('web_search', {
      query: searchQuery,
      num: limit,
      recency_days: 30,
    });

    // Process and categorize results
    const processedResults = results.map((item: any, index: number) => ({
      id: `result-${index}`,
      title: item.name,
      snippet: item.snippet,
      url: item.url,
      source: item.host_name,
      date: item.date,
      category: categorizeResult(item.name + ' ' + item.snippet),
      type: determineType(item.name + ' ' + item.snippet),
    }));

    // Group results by type
    const groupedResults = {
      opportunities: processedResults.filter((r: any) => 
        ['phd', 'postdoc', 'job'].includes(r.type)
      ),
      funding: processedResults.filter((r: any) => 
        r.type === 'funding'
      ),
      conferences: processedResults.filter((r: any) => 
        r.type === 'conference'
      ),
      news: processedResults.filter((r: any) => 
        r.type === 'news'
      ),
    };

    return NextResponse.json({
      success: true,
      query,
      filters: { type, field, country },
      timestamp: new Date().toISOString(),
      results: processedResults,
      grouped: groupedResults,
      total: processedResults.length,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to perform search' },
      { status: 500 }
    );
  }
}

function categorizeResult(text: string): string {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('artificial intelligence') || lowerText.includes('machine learning')) return 'AI/ML';
  if (lowerText.includes('quantum')) return 'Quantum';
  if (lowerText.includes('climate') || lowerText.includes('environmental')) return 'Climate';
  if (lowerText.includes('biotech') || lowerText.includes('genomics')) return 'Biotech';
  if (lowerText.includes('neuroscience') || lowerText.includes('brain')) return 'Neuroscience';
  if (lowerText.includes('physics')) return 'Physics';
  if (lowerText.includes('chemistry')) return 'Chemistry';
  if (lowerText.includes('medicine') || lowerText.includes('medical')) return 'Medical';
  
  return 'General';
}

function determineType(text: string): string {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('phd') || lowerText.includes('doctoral') || lowerText.includes('dphil')) return 'phd';
  if (lowerText.includes('postdoc') || lowerText.includes('postdoctoral') || lowerText.includes('post-doc')) return 'postdoc';
  if (lowerText.includes('funding') || lowerText.includes('grant') || lowerText.includes('call for proposals')) return 'funding';
  if (lowerText.includes('conference') || lowerText.includes('call for papers') || lowerText.includes('symposium')) return 'conference';
  if (lowerText.includes('position') || lowerText.includes('job') || lowerText.includes('vacancy')) return 'job';
  if (lowerText.includes('news') || lowerText.includes('announce') || lowerText.includes('breakthrough')) return 'news';
  
  return 'research';
}
