const { exec } = require('child_process');
const fs = require('fs').promises;
const axios = require('axios');
require('dotenv').config();

const githubRepo = process.env.GITHUB_NAME_REPO;
const userEmail = process.env.GITHUB_USER_EMAIL;
const userName = process.env.GITHUB_USER_NAME;

async function pullChanges() {
    try {
        console.log('Pulling changes from GitHub...');

        // Check if the directory is a Git repository
        const isGitRepo = await isGitRepository();
        if (!isGitRepo) {
            console.log('Initializing Git repository...');
            await executeShellCommand('git init');
            await executeShellCommand(`git remote add origin https://github.com/${githubRepo}.git`);
            await executeShellCommand('git config pull.rebase true'); // Set default pull behavior to rebase
            console.log('Git repository initialized.');
        }

        // Set user email and name
        await executeShellCommand(`git config user.email "${userEmail}"`);
        await executeShellCommand(`git config user.name "${userName}"`);

        // Fetch changes from the 'main' branch and rebase
        const result = await executeShellCommand('git pull --rebase origin main');

        // Check if conflicts occurred
        if (result.stderr.includes('Automatic merge failed')) {
            console.log('Conflicts detected. Please resolve conflicts and run the command again.');
            return;
        }

        console.log('Changes pulled successfully.');
    } catch (error) {
        console.error('Error pulling changes:', error);
    }
}

async function isGitRepository() {
    try {
        await fs.access('.git');
        return true;
    } catch (error) {
        return false;
    }
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
