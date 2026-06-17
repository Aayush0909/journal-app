import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { JournalEntry } from '../../models/journal-entry';

@Injectable({
  providedIn: 'root',
})
export class JournalService {
  


  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/journal`;

  // GET /journal — fetch all entries for logged-in user
  getAll() {
    return this.http.get<JournalEntry[]>(this.apiUrl);
  }

  // GET /journal/id/:id — fetch one entry
  getById(id: string) {
    return this.http.get<JournalEntry>(`${this.apiUrl}/id/${id}`);
  }

  // POST /journal — create new entry
  create(data: { title: string; content: string }) {
    return this.http.post<JournalEntry>(this.apiUrl, data);
  }

  // PUT /journal/id/:id — update existing entry
  update(id: string, data: { title: string; content: string }) {
    return this.http.put<JournalEntry>(`${this.apiUrl}/id/${id}`, data);
  }

  // DELETE /journal/id/:id — delete entry
  delete(id: string) {
    return this.http.delete(`${this.apiUrl}/id/${id}`);
  }
}
