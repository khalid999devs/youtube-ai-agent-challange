import React from 'react';
import SchematicEmbed from './SchematicEmbed';
import { getTemporaryAccessToken } from '@/actions/getTemporaryAccessToken';

async function SchematicComponent({ componentId }: { componentId: string }) {
  if (!componentId) {
    return null;
  }
  const accessToken = await getTemporaryAccessToken();
  if (!accessToken) {
    throw new Error('Failed to get Access Token');
  }
  return <SchematicEmbed accessToken={accessToken} componentId={componentId} />;
}

export default SchematicComponent;
