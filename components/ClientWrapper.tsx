'use client';

import { SchematicProvider } from '@schematichq/schematic-react';
import React from 'react';
import SchematicWrapped from './SchematicWrapped';
import { ConvexClientProvider } from './ConvexClientProvider';

const ClientWrapper = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const schematicPubKey = process.env.NEXT_PUBLIC_SCHEMATIC_PUBLISHABLE_KEY;
  if (!schematicPubKey) {
    throw new Error(
      'No Schematic Publishable Key found. Please add it to your .env.local file'
    );
  }
  return (
    <ConvexClientProvider>
      <SchematicProvider publishableKey={schematicPubKey}>
        <SchematicWrapped>{children}</SchematicWrapped>
      </SchematicProvider>
    </ConvexClientProvider>
  );
};

export default ClientWrapper;
