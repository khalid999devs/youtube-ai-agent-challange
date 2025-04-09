'use client';

import { createOrGetVideo } from '@/actions/createOrGetVideo';
import AiAgentChat from '@/components/AiAgentChat';
import ThumbnailGeneration from '@/components/ThumbnailGeneration';
import TitleGeneration from '@/components/TitleGeneration';
import Transcription from '@/components/Transcription';
import Usage from '@/components/Usage';
import YoutubeVideoDetails from '@/components/YoutubeVideoDetails';
import { Doc } from '@/convex/_generated/dataModel';
import { FeatureFlags } from '@/features/flags';
import { useUser } from '@clerk/nextjs';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function AnalysisPage() {
  const params = useParams<{ videoId: string }>();
  const { user } = useUser();
  const [video, setVideo] = useState<Doc<'videos'> | null | undefined>(
    undefined
  );

  useEffect(() => {
    if (!user?.id) return;
    if (!params.videoId) return;

    const fetchVideo = async () => {
      const response = await createOrGetVideo(
        params.videoId as string,
        user.id
      );
      if (!response.success) {
        //toast.error(response.error)
      } else {
        setVideo(response.data);
      }
    };
    fetchVideo();
  }, [params.videoId, user]);

  const VideoTranscriptionStatus =
    video === undefined ? (
      <div className='inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full'>
        <div className='w-2 h-2 bg-gray-400 rounded-full animate-pulse' />
        <span className='text-sm text-gray-700'>Loading...</span>
      </div>
    ) : !video ? (
      <div className='inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full'>
        <div className='w-2 h-2 bg-amber-400 rounded-full animate-pulse' />
        <p className='text-sm text-amber-700'>
          This is your first time analyzing this video. <br />
          <span className='font-semibold'>
            (1 Analysis token is being used!)
          </span>
        </p>
      </div>
    ) : (
      <div className='inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full'>
        <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse' />
        <p className='text-sm text-green-700'>
          Analysis exist for this video - no additional tokens needed in future
          calls! <br />
        </p>
      </div>
    );

  return (
    <div className='xl:container mx-auto px-4 md:px-0'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        {/* left side */}
        <div className='order-2 lg:order-1 flex flex-col gap-4 bg-white lg:border-r border-gray-200 p-6'>
          {/* Analysis section */}
          <div className='rounded-xl flex flex-col gap-4 p-4 border-gray-200 border'>
            <Usage
              featureFlag={FeatureFlags.ANALYSIS_VIDEO}
              title='Analyse video'
            />
            {/* video transcription status */}
            {VideoTranscriptionStatus}
          </div>

          {/* youtube video details */}
          <YoutubeVideoDetails videoId={params.videoId} />

          {/* Thumbnail generation */}
          <ThumbnailGeneration videoId={params.videoId} />

          {/* Title generation */}
          <TitleGeneration videoId={params.videoId} />

          {/* Transcription */}
          <Transcription videoId={params.videoId} />
        </div>

        {/* right side */}
        <div className='order-1 lg:order-2 lg:sticky lg:top-20 h-[500px] md:h-[calc(100vh-6rem)]'>
          {/* AI agent chat section */}
          <AiAgentChat videoId={params.videoId} />
        </div>
      </div>
    </div>
  );
}

export default AnalysisPage;
