if (!process.env.CLERK_ISSUE_URL) {
  throw new Error('No Clerk Issue URL found in the environment variables.');
}

const authConfig = {
  providers: [
    {
      domain: process.env.CLERK_ISSUE_URL,
      applicationID: 'convex',
    },
  ],
};

export default authConfig;
