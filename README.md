# VC_SL

A Discord bot that tracks player stats from VEGA Conflict using the KIXEYE API. This bot allows users to look up player data via in-game ID or Kixeye user ID.

## Table of Contents
1. [Features](#features)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Usage](#usage)
5. [Commands](#commands)
6. [Technical Details](#technical-details)
7. [Troubleshooting](#troubleshooting)
8. [Contributing](#contributing)
9. [License](#license)

## Features

- **/stats {id}**: Look up player stats using the VEGA in-game ID.
- **/kix_id {kixid}**: Look up player stats using the Kixeye user ID.

## Installation

1. **Clone the repository:**
    ```sh
    git clone https://github.com/yourusername/VEGA-Conflict-KIXEYE-API-Discord-Bot.git
    cd VEGA-Conflict-KIXEYE-API-Discord-Bot
    ```

2. **Install dependencies:**
    ```sh
    npm install
    ```

3. **Set up your environment variables:**
    Create a `.env` file in the root directory and add your bot token and KIXEYE API key.
    ```env
    DISCORD_TOKEN=your_discord_bot_token
    KIXEYE_API_KEY=your_kixeye_api_key
    ```

## Configuration

1. **Bot Token**: Obtain a bot token by creating a new bot on the [Discord Developer Portal](https://discord.com/developers/applications).
2. **KIXEYE API Key**: Obtain an API key from the [KIXEYE Developer Portal](https://www.kixeye.com/developer).

## Usage

1. **Run the bot:**
    ```sh
    node index.js
    ```

2. **Invite the bot to your Discord server:**
    Use the OAuth2 URL Generator on the [Discord Developer Portal](https://discord.com/developers/applications) to generate an invite link for your bot.

## Commands

- **/stats {id}**: Looks up player stats using the VEGA in-game ID.
  - **Example**: `/stats 123456`

- **/kix_id {kixid}**: Looks up player stats using the Kixeye user ID.
  - **Example**: `/kix_id 78901234`

## Technical Details

- **Language**: JavaScript (Node.js)
- **Libraries**:
  - `discord.js`: Interacting with the Discord API.
  - `axios`: Making HTTP requests to the KIXEYE API.
  - `dotenv`: Loading environment variables from a `.env` file.

- **Structure**:
  - `index.js`: Main file that initializes the bot and handles commands.
  - `commands/`: Directory containing command handlers.
    - `stats.js`: Handler for the `/stats` command.
    - `kix_id.js`: Handler for the `/kix_id` command.
  - `utils/`: Directory containing utility functions for interacting with the KIXEYE API and Discord.

## Troubleshooting

- **API Errors**: Ensure your KIXEYE API key is valid and has the necessary permissions.
- **Bot Permissions**: Ensure the bot has the required permissions in the Discord server to send messages.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. Ensure your code follows the project's coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
