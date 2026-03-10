import { NextRequest, NextResponse } from "next/server";
import { createMeeting } from "@/lib/meeting";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, hostEmail, dateRange, timeRange } = body;

    // Validate required fields
    if (!title || !hostEmail || !dateRange || !timeRange) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create meeting
    const meeting = await createMeeting({
      title,
      hostEmail,
      dateRange: {
        start: new Date(dateRange.start),
        end: new Date(dateRange.end),
      },
      timeRange,
    });

    return NextResponse.json({ meeting }, { status: 201 });
  } catch (error) {
    console.error("Error creating meeting:", error);
    return NextResponse.json(
      { error: "Failed to create meeting" },
      { status: 500 }
    );
  }
}