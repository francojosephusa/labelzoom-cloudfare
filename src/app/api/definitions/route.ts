import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import OpenAI from 'openai';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { term } = await req.json();

    if (!term) {
      return NextResponse.json(
        { error: 'Term is required' },
        { status: 400 }
      );
    }

    // First, check if we have this definition cached in Supabase
    const { data: cachedDefinition } = await supabase
      .from('definitions')
      .select('*')
      .eq('term', term.toLowerCase())
      .single();

    if (cachedDefinition) {
      return NextResponse.json({
        ...cachedDefinition,
        cached: true,
      });
    }

    // If not in cache, get definition from OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that provides structured information about terms found on product labels. For each term, provide: \n1. A clear, concise definition\n2. Category (ingredient, certification, warning, measurement, or other)\n3. Common usage examples\n4. Safety information (if applicable)\n5. Related terms (if any)"
        },
        {
          role: "user",
          content: term
        }
      ]
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    const response = JSON.parse(content);

    // Cache the result in Supabase with enhanced structure using admin client
    await supabaseAdmin.from('definitions').insert([
      {
        term: term.toLowerCase(),
        definition: response.definition,
        category: response.category,
        examples: response.examples,
        safety_info: response.safety_info,
        related_terms: response.related_terms,
        source: 'OpenAI',
        created_at: new Date().toISOString(),
      }
    ]);

    return NextResponse.json({
      ...response,
      source: 'OpenAI',
      cached: false,
    });

  } catch (error) {
    console.error('Definition lookup error:', error);
    return NextResponse.json(
      { error: 'Failed to get definition' },
      { status: 500 }
    );
  }
} 