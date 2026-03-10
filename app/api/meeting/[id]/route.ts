import { NextRequest, NextResponse } from "next/server";
import { getMeeting } from "@/lib/meeting";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const meeting = await getMeeting(id);

    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    return NextResponse.json({ meeting });
  } catch (error) {
    console.error("Error fetching meeting:", error);
    return NextResponse.json(
      { error: "Failed to fetch meeting" },
      { status: 500 }
    );
  }
}