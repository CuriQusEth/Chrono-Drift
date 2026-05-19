import { NextResponse } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  return NextResponse.json({
    protocol: "MCP",
    version: "1.0.0",
    name: "Chrono Drift MCP Endpoint",
    status: "active",
    description: "Active MCP server for Chrono Drift Orchestrator Agent",
    capabilities: ["chrono-drift-mechanics", "temporal-navigation", "timeline-orchestration"],
    timestamp: new Date().toISOString()
  }, { headers: CORS_HEADERS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { jsonrpc, id, method } = body;

    if (method === 'initialize') {
      return NextResponse.json({
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
      }, { headers: CORS_HEADERS });
    }

    if (method === 'tools/list') {
      return NextResponse.json({
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
      }, { headers: CORS_HEADERS });
    }

    if (method === 'tools/call') {
      const toolName = body.params?.name;
      let textResponse = "";

      switch (toolName) {
        case 'get_race_status': textResponse = "Race is active. Awaiting chronological navigation."; break;
        case 'start_race': textResponse = "Race started successfully."; break;
        case 'get_leaderboard': textResponse = "Top score: 0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B - 99,999 pts"; break;
        case 'optimize_speed': textResponse = "Speed sequence optimized. Time burst ready."; break;
        case 'get_track_info': textResponse = "Temporal anomalies detected on loop 3. Neon track stable."; break;
        default: textResponse = `Tool ${toolName} execution completed.`;
      }

      return NextResponse.json({
        jsonrpc: jsonrpc || "2.0",
        id: id || null,
        result: {
          content: [{ type: "text", text: textResponse }]
        }
      }, { headers: CORS_HEADERS });
    }

    // Default MCP fallback or custom response
    return NextResponse.json({
        jsonrpc: jsonrpc || "2.0",
        id: id || null,
        result: {
            status: "success",
            message: "MCP command received",
            agent: "Chrono Drift Orchestrator",
            receivedAt: new Date().toISOString(),
            payload: body
        }
    }, { headers: CORS_HEADERS });

  } catch (error) {
    return NextResponse.json({ 
        jsonrpc: "2.0",
        error: { code: -32700, message: "Parse error" },
        id: null
    }, { status: 400, headers: CORS_HEADERS });
  }
}
