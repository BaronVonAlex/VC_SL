const { exec } = require('child_process');
const fs = require('fs').promises;
const axios = require('axios');
require('dotenv').config();

const githubRepo = process.env.GITHUB_NAME_REPO;
const userEmail = process.env.GITHUB_USER_EMAIL;
const userName = process.env.GITHUB_USER_NAME;

async function pullChanges() {
  try {
    // Check if the local repository exists, if not, clone it
    const repoExists = await fs.access(githubRepo).then(() => true).catch(() => false);

    // Fetch the latest changes from the remote repository
    await exec('git fetch');

    // Reset the local repository to the latest commit on the remote repository
    await exec('git reset --hard origin/main');

    // Install or update dependencies
    await exec('npm install');

    console.log('Bot is up to date.');
  } catch (error) {
    console.error('Error updating bot from GitHub:', error.message);
  }
}

module.exports = { pullChanges };
