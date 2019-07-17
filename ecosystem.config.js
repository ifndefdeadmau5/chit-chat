module.exports = {
  apps: [
    {
      name: 'chit-chat',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
