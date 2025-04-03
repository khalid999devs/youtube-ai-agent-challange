'use client';

import AiAgentChat from '@/components/AiAgentChat';
import ThumbnailGeneration from '@/components/ThumbnailGeneration';
import TitleGeneration from '@/components/TitleGeneration';
import Transcription from '@/components/Transcription';
import Usage from '@/components/Usage';
import YoutubeVideoDetails from '@/components/YoutubeVideoDetails';
import { FeatureFlags } from '@/features/flags';
import { useParams } from 'next/navigation';
import React from 'react';

function AnalysisPage() {
  const params = useParams<{ videoId: string }>();

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
            {/*  */}
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
