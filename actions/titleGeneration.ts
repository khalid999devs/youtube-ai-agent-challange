'use server';

import { api } from '@/convex/_generated/api';
import { featureFlagEvents, FeatureFlags } from '@/features/flags';
import { getConvexClient } from '@/lib/convex';
import { client } from '@/lib/schematic';
import { currentUser } from '@clerk/nextjs/server';
import OpenAI from 'openai';

const convexClient = getConvexClient();

export async function titleGeneration(
  videoId: string,
  videoSummary: string,
  considerations: string
) {
  const user = await currentUser();

  if (!user?.id) {
    throw new Error('User not found');
  }

  const schematicCtx = {
    company: { id: user.id },
    user: { id: user.id },
  };
  const isTitleGenerationEnabled = await client.checkFlag(
    schematicCtx,
    FeatureFlags.TITLE_GENERATIONS
  );

  if (!isTitleGenerationEnabled) {
    return {
      error: 'Title generation is not enabled, the user must upgrade',
    };
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful Youtube video creator assistant that creates high quality SEO friendly concise video titles.',
        },
        {
          role: 'user',
          content: `Please provide ONE concise YouTube title (and nothing else) for this video. Focus on the main points and key takeaways, it should be SEO friendly and 100 characters or less:\n\n${videoSummary}\n\n${considerations}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const title =
      response.choices[0]?.message?.content || 'Unable to generate title';

    if (!title) {
      return { error: 'Failed to generate title (System error)' };
    }

    await convexClient.mutation(api.titles.generate, {
      videoId,
      userId: user.id,
      title,
    });

    await client.track({
      event: featureFlagEvents[FeatureFlags.TITLE_GENERATIONS].event,
      company: {
        id: user.id,
      },
      user: {
        id: user.id,
      },
    });

    return title;
  } catch (error) {
    console.error('Error generating title:', error);
    return { error: 'Failed to generate title (API error) ' + error };
  }
}
