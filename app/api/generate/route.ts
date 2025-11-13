import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { BrandSnapshot, SalesStarterKit } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { brand } = await request.json();

    if (!brand || typeof brand !== 'string') {
      return NextResponse.json(
        { error: 'Brand name is required' },
        { status: 400 }
      );
    }

    // Step 1: Generate Brand Visibility Snapshot using Responses API with web_search
    // The web_search tool enables the model to fetch current information from the internet
    let brandSnapshot: BrandSnapshot;
    
    // Check if Responses API is available, otherwise use chat completions
    const responsesApi = (openai as any).beta?.responses;
    let useResponsesApi = responsesApi && typeof responsesApi.create === 'function';
    let responsesApiSucceeded = false;
    
    if (useResponsesApi) {
      try {
        // Use the Responses API with web_search
        // According to OpenAI docs: https://platform.openai.com/docs/api-reference/responses-streaming/response/web_search_call
        const brandSnapshotResponse = await responsesApi.create({
          model: 'gpt-4o-mini',
          tools: [{ type: 'web_search' }],
          input: `You are an expert B2B brand and digital marketing analyst. Analyze the brand "${brand}" by performing a web search to gather current information about them. Based on your research, provide a Brand Visibility Snapshot in the following JSON format:
{
  "whatTheyDo": "Brief description of what the brand does",
  "category": "Industry or business category",
  "primaryOfferings": ["Offering 1", "Offering 2", "Offering 3"],
  "targetSegments": ["Segment 1", "Segment 2"],
  "brandVoice": "Description of the brand's voice and tone",
  "visibilityOpportunities": ["Opportunity 1", "Opportunity 2", "Opportunity 3"]
}

Provide 2-3 visibility opportunities. Return only the JSON object, no markdown formatting. Use web search to find the most current and accurate information about "${brand}".`,
        });

        const brandSnapshotContent = brandSnapshotResponse?.output_text;
        if (!brandSnapshotContent) {
          throw new Error('Failed to generate brand snapshot - no output text');
        }

        // Extract JSON from the response (may contain additional text or citations)
        const jsonMatch = brandSnapshotContent.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error(
            'Failed to parse JSON from brand snapshot response. The model may not have returned valid JSON.'
          );
        }

        brandSnapshot = JSON.parse(jsonMatch[0]);
        responsesApiSucceeded = true;
      } catch (responsesApiError) {
        // Fallback to chat completions if Responses API fails
        console.log('Responses API error, falling back to chat completions:', responsesApiError);
      }
    }
    
    if (!responsesApiSucceeded) {
      // Use chat completions (fallback or if Responses API not available)
      const brandSnapshotResponse = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert B2B brand and digital marketing analyst. Analyze brands and provide structured insights about their business, positioning, and visibility opportunities. Always respond with valid JSON only, no additional text.',
          },
          {
            role: 'user',
            content: `Analyze the brand "${brand}" and provide a Brand Visibility Snapshot in the following JSON format:
{
  "whatTheyDo": "Brief description of what the brand does",
  "category": "Industry or business category",
  "primaryOfferings": ["Offering 1", "Offering 2", "Offering 3"],
  "targetSegments": ["Segment 1", "Segment 2"],
  "brandVoice": "Description of the brand's voice and tone",
  "visibilityOpportunities": ["Opportunity 1", "Opportunity 2", "Opportunity 3"]
}

Provide 2-3 visibility opportunities. Return only the JSON object, no markdown formatting.`,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      });

      const brandSnapshotContent = brandSnapshotResponse.choices[0]?.message?.content;
      if (!brandSnapshotContent) {
        throw new Error('Failed to generate brand snapshot');
      }

      brandSnapshot = JSON.parse(brandSnapshotContent);
    }

    // Step 2: Generate Sales Starter Kit
    const salesKitResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a B2B sales strategist with deep expertise in identifying buyer personas, pain points, and crafting effective sales messaging. Always respond with valid JSON only, no additional text.',
        },
        {
          role: 'user',
          content: `Based on this Brand Visibility Snapshot for "${brand}":
${JSON.stringify(brandSnapshot, null, 2)}

Create a Sales Starter Kit in the following JSON format:
{
  "buyerRoles": ["Role 1", "Role 2", "Role 3"],
  "painPoints": ["Pain point 1", "Pain point 2", "Pain point 3"],
  "valueAngles": ["Value angle 1", "Value angle 2", "Value angle 3"],
  "coldEmailOpener": "A compelling cold email opening line (1-2 sentences)",
  "linkedInDMMessage": "A personalized LinkedIn DM message (2-3 sentences)",
  "discoveryQuestions": ["Question 1", "Question 2", "Question 3", "Question 4"],
  "thoughtLeadershipPoint": "One thought-leadership talking point (1-2 sentences)"
}

Return only the JSON object, no markdown formatting.`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const salesKitContent = salesKitResponse.choices[0]?.message?.content;
    if (!salesKitContent) {
      throw new Error('Failed to generate sales starter kit');
    }

    const salesStarterKit: SalesStarterKit = JSON.parse(salesKitContent);

    return NextResponse.json({
      brandSnapshot,
      salesStarterKit,
    });
  } catch (error) {
    console.error('Error generating brand intelligence:', error);
    // Log more details for debugging
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate brand intelligence',
      },
      { status: 500 }
    );
  }
}

