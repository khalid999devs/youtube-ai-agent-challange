'use server';

import { currentUser } from '@clerk/nextjs/server';
import { SchematicClient } from '@schematichq/schematic-typescript-node';

const key = process.env.SCHEMATIC_API_KEY;
if (!key) {
  throw new Error('Schematic API key is not defined');
}

const client = new SchematicClient({
  apiKey: key,
});

export async function getTemporaryAccessToken() {
  const user = await currentUser();
  if (!user) {
    return null;
  }
  const response = await client.accesstokens.issueTemporaryAccessToken({
    resourceType: 'company',
    lookup: {
      id: user.id,
    },
  });
  return response.data.token;
}
