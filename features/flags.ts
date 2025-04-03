export enum FeatureFlags {
  TRANSCRIPTION = 'transcription',
  IMAGE_GENERATION = 'image-generation',
  ANALYSIS_VIDEO = 'analyse-video',
  TITLE_GENERATIONS = 'title-generations',
  SCRIPT_GENERATION = 'script-generation',
}

export const featureFlagEvents: Record<FeatureFlags, { event: string }> = {
  [FeatureFlags.TRANSCRIPTION]: { event: 'transcribe' },
  [FeatureFlags.IMAGE_GENERATION]: { event: 'generate-image' },
  [FeatureFlags.ANALYSIS_VIDEO]: { event: 'analyse-video' },
  [FeatureFlags.TITLE_GENERATIONS]: { event: 'generate-title' },
  [FeatureFlags.SCRIPT_GENERATION]: { event: '' },
};
