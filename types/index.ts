// Meeting Types

export interface Meeting {
  id: string;
  title: string;
  hostEmail: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  timeRange: {
    start: string; // "HH:MM" format
    end: string;
  };
  createdAt: Date;
  expiresAt: Date;
  finalizedSlot?: {
    start: Date;
    end: Date;
  };
}

export interface Participant {
  id: string;
  meetingId: string;
  name: string;
  email: string;
  availability: string[]; // ISO strings of available slots
  submittedAt: Date;
}

// Input Types

export interface CreateMeetingInput {
  title: string;
  hostEmail: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  timeRange: {
    start: string;
    end: string;
  };
}

export interface AddParticipantInput {
  name: string;
  email: string;
  availability?: string[];
}