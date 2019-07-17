module.exports = {
  apps: [
    {
      name: 'bb-user-api',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
