import { NextRequest, NextResponse } from "next/server";
import { getParticipants, addParticipant } from "@/lib/meeting";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const participants = await getParticipants(id);
    return NextResponse.json({ participants });
  } catch (error) {
    console.error("Error fetching participants:", error);
    return NextResponse.json(
      { error: "Failed to fetch participants" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, email, availability } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const participant = await addParticipant(id, {
      name,
      email,
      availability: availability || [],
    });

    return NextResponse.json({ participant }, { status: 201 });
  } catch (error) {
    console.error("Error adding participant:", error);
    return NextResponse.json(
      { error: "Failed to add participant" },
      { status: 500 }
    );
  }
}