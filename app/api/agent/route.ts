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
    name: "Chrono Drift Orchestrator",
    status: "active",
    wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
    platform: "Chrono Drift",
    version: "1.0.0"
  }, { headers: CORS_HEADERS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json({
      status: "success",
      message: "Agent interaction received",
      receivedAt: new Date().toISOString(),
      payload: body
    }, { headers: CORS_HEADERS });
  } catch (error) {
    return NextResponse.json({ error: "Invalid agent request" }, { status: 400, headers: CORS_HEADERS });
  }
}
