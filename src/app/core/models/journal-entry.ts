export interface JournalEntry {
   id: string;
  title: string;
  content: string;
  date: string;
}

// What you send on CREATE — no id, no timestamps (server sets these)
export interface CreateJournalEntryRequest {
  title: string;
  content?: string;
}

// What you send on UPDATE — only editable fields
export interface UpdateJournalEntryRequest {
  title: string;
  content: string;
}