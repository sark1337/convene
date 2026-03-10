import { NextRequest, NextResponse } from "next/server";
import { getMeeting, getParticipants, finalizeMeetingSlot } from "@/lib/meeting";
import { sendEmail } from "@/lib/email";
import { generateMeetingICS } from "@/lib/calendar";
import { render } from "@react-email/components";
import { ConfirmationEmail } from "@/components/email/ConfirmationEmail";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { slotStart, slotEnd, hostName } = body;

    // Validate
    if (!slotStart || !slotEnd || !hostName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get meeting
    const meeting = await getMeeting(id);
    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    // Check if host
    // TODO: Add proper host verification

    // Get participants
    const participants = await getParticipants(id);

    // Finalize the meeting
    const finalizedSlot = {
      start: new Date(slotStart),
      end: new Date(slotEnd),
    };
    await finalizeMeetingSlot(id, finalizedSlot);

    // Generate ICS
    const icsContent = await generateMeetingICS(
      meeting,
      finalizedSlot,
      participants.map((p) => ({ name: p.name, email: p.email })),
      hostName
    );

    // Send emails to all participants
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://convene.scoutos.live";
    const meetingUrl = `${baseUrl}/meeting/${id}`;

    const emailPromises = participants.map(async (participant) => {
      const emailHtml = await render(
        ConfirmationEmail({
          meetingTitle: meeting.title,
          hostName,
          startTime: finalizedSlot.start,
          endTime: finalizedSlot.end,
          participants: participants.map((p) => ({ name: p.name })),
          meetingUrl,
          calendarUrl: icsContent,
        })
      );

      return sendEmail({
        to: participant.email,
        subject: `Meeting Confirmed: ${meeting.title}`,
        html: emailHtml,
        attachments: [
          {
            filename: `${meeting.title.replace(/[^a-z0-9]/gi, "-")}.ics`,
            content: icsContent,
            contentType: "text/calendar",
          },
        ],
      });
    });

    await Promise.all(emailPromises);

    return NextResponse.json({
      success: true,
      meeting: {
        ...meeting,
        finalizedSlot,
      },
    });
  } catch (error) {
    console.error("Error finalizing meeting:", error);
    return NextResponse.json(
      { error: "Failed to finalize meeting" },
      { status: 500 }
    );
  }
}