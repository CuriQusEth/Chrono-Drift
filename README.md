# Chrono Drift

Chrono Drift is a stylish, high-speed time-manipulation racing game. You subvert the laws of physics as a Chrono Racer, bending time while drifting through expansive neon tracks. Master chronological mechanics to achieve perfect drifts, assert your dominance on the leaderboards, and maneuver through temporal anomalies.

## Project Details

- **Platform:** Chrono Drift
- **Agent Name:** Chrono Drift Orchestrator
- **Description:** An ERC-8004 compliant AI Agent that orchestrates time drift mechanics, chronological navigation, temporal anomaly management, and multi-timeline orchestration.
- **Protocol Support:** EIP-8004 (Trustless Agents), EIP-8021 (Transaction Attribution)

## Features

- **Time Mechanics**: Time-slow for perfect cornering, rewind to recover from crashes, and burst forward with massive speed boosts.
- **Temporal Momentum**: Execute extensive drifts in slow motion to maximize your multiplier.
- **On-chain Integrations**: Fully integrated on-chain Leaderboards and SIWE (Sign-In with Ethereum).
- **Model Context Protocol (MCP)**: Native integration for interacting with agents inside game state.

## Technical Stack

- **Game Engine & Renderer**: React 19 + TypeScript + Custom HTML5 Canvas
- **Styling**: Tailwind CSS, Framer Motion
- **Web3 Ecosystem**: Wagmi, Viem
- **State Management**: Zustand
- **Backend Infrastructure**: MCP Endpoints utilizing App Router logic format.

## Agent & MCP Endpoints Integration

The specific backend integration targets these paths designed for agent communication and commands:
- **A2A / Registration:** `https://chrono-drift.vercel.app/.well-known/agent-card.json`
- **MCP API:** `https://chrono-drift.vercel.app/api/mcp`
- **Agent Action API:** `https://chrono-drift.vercel.app/api/agent`

**Available MCP Tools:**
- `get_race_status`: Get the current race status.
- `start_race`: Start a new race.
- `get_leaderboard`: Get the top racers.
- `optimize_speed`: Optimize the time manipulation mechanics for maximum speed.
- `get_track_info`: Get the active temporal anomalies on the track.

## How to Run Locally

If you are running the project locally:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. The game will be available at `http://localhost:3000`.

## License

All rights reserved. (c) Chrono Drift.
