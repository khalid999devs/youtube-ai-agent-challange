'use server';

import { api } from '@/convex/_generated/api';
import { featureFlagEvents, FeatureFlags } from '@/features/flags';
import { getConvexClient } from '@/lib/convex';
import { client } from '@/lib/schematic';
import { currentUser } from '@clerk/nextjs/server';
import OpenAI from 'openai';

const IMAGE_SIZE = '1792x1024' as const;
const convexClient = getConvexClient();

export const dalleImageGeneration = async (prompt: string, videoId: string) => {
  const user = await currentUser();
  if (!user?.id) {
    throw new Error('User not found');
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  if (!prompt) {
    throw new Error('Failed to generate image prompt');
  }

  try {
    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: IMAGE_SIZE,
      quality: 'standard',
      style: 'vivid',
    });

    const imageUrl = imageResponse.data[0]?.url;

    if (!imageUrl) {
      throw new Error('Failed to generate image');
    }

    const postUrl = await convexClient.mutation(api.images.generateUploadUrl);

    // now downloading the image on the server
    const image: Blob = await fetch(imageUrl).then((res) => res.blob());

    // uploading the image to convex storage
    const result = await fetch(postUrl, {
      method: 'POST',
      headers: { 'Content-Type': image!.type },
      body: image,
    });

    const { storageId } = await result.json();
    await convexClient.mutation(api.images.storeImage, {
      storageId: storageId,
      videoId,
      userId: user.id,
    });

    const dbImageUrl = await convexClient.query(api.images.getImage, {
      videoId,
      userId: user.id,
    });

    await client.track({
      event: featureFlagEvents[FeatureFlags.IMAGE_GENERATION].event,
      company: {
        id: user.id,
      },
      user: {
        id: user.id,
      },
    });

    return {
      imageUrl: dbImageUrl,
    };
  } catch (error) {
    console.error('Error during image generation:', error);
    return {
      error: `Failed to generate image, ${error}`,
    };
  }
};
