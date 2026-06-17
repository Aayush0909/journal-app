import { Component, inject, signal } from '@angular/core';
import { JournalService } from '../../../core/services/Journal-service/journal-service';
import { JournalEntry } from '../../../core/models/journal-entry';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-journal-list',
  imports: [DatePipe],
  templateUrl: './journal-list.html',
  styleUrl: './journal-list.css',
})
export class JournalList {

   private journalService = inject(JournalService);
  private authService = inject(AuthService);
   router = inject(Router);

  entries = signal<JournalEntry[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  today = new Date();

  // Read username signal from AuthService
  username = this.authService.username;

  ngOnInit() {
    this.loadEntries();
  }

  loadEntries() {
    this.isLoading.set(true);
    this.journalService.getAll().subscribe({
      next: (data) => {
        this.entries.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load entries.');
        this.isLoading.set(false);
      }
    });
  }

  goToCreate() {
    this.router.navigate(['/journals/new']);
  }

  goToDetail(entry: JournalEntry) {
    this.router.navigate(['/journals', entry.id]);
  }


  deleteEntry(id: string, event: Event) {
  // Stop the card click from firing (which would navigate to detail)
  event.stopPropagation();

  // Simple confirmation — no library needed yet
  const confirmed = window.confirm('Are you sure you want to delete this entry?');
  if (!confirmed) return;

  this.journalService.delete(id).subscribe({
    next: () => {
      // Remove from local signal — no need to re-fetch the whole list
      this.entries.update(entries => entries.filter(e => e.id !== id));
    },
    error: () => {
      this.errorMessage.set('Failed to delete entry.');
    }
  });
}

  logout() {
    this.authService.logout();
  }
}
