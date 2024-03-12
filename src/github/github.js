const axios = require('axios');
const { exec } = require('child_process');
require('dotenv').config();

const githubRepo = process.env.GITHUB_NAME_REPO;
const githubToken = process.env.GITUHB_TOKEN;

async function pullChanges() {
    try {
        console.log('Pulling changes from GitHub...');

        // Fetch the latest commit hash from GitHub
        const latestCommit = await getLatestCommit();
        if (!latestCommit) {
            console.error('Unable to fetch the latest commit.');
            return;
        }

        // Check the current commit hash
        const currentCommit = await getCurrentCommit();
        if (currentCommit === latestCommit) {
            console.log('No new changes.');
            return;
        }

        // Pull changes
        await executeShellCommand('git pull');

        console.log('Changes pulled successfully.');
    } catch (error) {
        console.error('Error pulling changes:', error);
    }
}

async function getLatestCommit() {
    const response = await axios.get(`https://api.github.com/repos/${githubRepo}/commits/main`, {
        headers: {
            Authorization: `Bearer ${githubToken}`,
        },
    });
    return response.data.sha;
}

async function getCurrentCommit() {
    const { stdout } = await executeShellCommand('git rev-parse HEAD');
    return stdout.trim();
}

function executeShellCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve({ stdout, stderr });
            }
        });
    });
}

module.exports = { pullChanges };
