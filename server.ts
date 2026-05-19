import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: /api/mcp
  app.get("/api/mcp", (req, res) => {
    res.json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Chrono Drift MCP Endpoint",
      status: "active",
      description: "Active MCP server for Chrono Drift Orchestrator Agent",
      capabilities: ["chrono-drift-mechanics", "temporal-navigation", "timeline-orchestration"],
      timestamp: new Date().toISOString()
    });
  });

  app.post("/api/mcp", (req, res) => {
    try {
      const body = req.body;
      const { jsonrpc, id, method } = body;

      // MCP initialization
      if (method === 'initialize') {
        res.json({
          jsonrpc: jsonrpc || "2.0",
          id: id || null,
          result: {
            protocolVersion: "2024-11-05",
            serverInfo: {
              name: "Chrono Drift Orchestrator",
              version: "1.0.0"
            },
            capabilities: { tools: {}, prompts: {}, resources: {} }
          }
        });
        return;
      }

      // MCP tools list
      if (method === 'tools/list') {
        res.json({
          jsonrpc: jsonrpc || "2.0",
          id: id || null,
          result: {
            tools: [
              { name: "get_race_status", description: "Get the current race status.", inputSchema: { type: "object", properties: {} } },
              { name: "start_race", description: "Start a new race.", inputSchema: { type: "object", properties: {} } },
              { name: "get_leaderboard", description: "Get the top racers.", inputSchema: { type: "object", properties: {} } },
              { name: "optimize_speed", description: "Optimize the time manipulation mechanics for maximum speed.", inputSchema: { type: "object", properties: {} } },
              { name: "get_track_info", description: "Get the active temporal anomalies on the track.", inputSchema: { type: "object", properties: {} } }
            ]
          }
        });
        return;
      }

      // MCP tools call
      if (method === 'tools/call') {
        const toolName = body.params?.name;
        let textResponse = "";

        switch (toolName) {
          case 'get_race_status':
            textResponse = "Race is active. Awaiting chronological navigation.";
            break;
          case 'start_race':
            textResponse = "Race started successfully.";
            break;
          case 'get_leaderboard':
            textResponse = "Top score: 0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B - 99,999 pts";
            break;
          case 'optimize_speed':
            textResponse = "Speed sequence optimized. Time burst ready.";
            break;
          case 'get_track_info':
            textResponse = "Temporal anomalies detected on loop 3. Neon track stable.";
            break;
          default:
            textResponse = `Tool ${toolName} execution completed.`;
        }

        res.json({
          jsonrpc: jsonrpc || "2.0",
          id: id || null,
          result: {
            content: [{ type: "text", text: textResponse }]
          }
        });
        return;
      }

      // Default
      res.json({
        jsonrpc: jsonrpc || "2.0",
        id: id || null,
        result: {
          status: "success",
          message: "MCP command received",
          agent: "Chrono Drift Orchestrator",
          receivedAt: new Date().toISOString(),
          payload: body
        }
      });
    } catch (error) {
      res.status(400).json({ 
        jsonrpc: "2.0",
        error: { code: -32700, message: "Parse error" },
        id: null
      });
    }
  });

  // API Route: /api/agent
  app.get("/api/agent", (req, res) => {
    res.json({
      name: "Chrono Drift Orchestrator",
      status: "active",
      wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
      platform: "Chrono Drift",
      version: "1.0.0"
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, { dotfiles: "allow" }));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
