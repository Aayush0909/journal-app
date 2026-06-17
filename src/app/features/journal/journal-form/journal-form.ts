import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JournalService } from '../../../core/services/Journal-service/journal-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-journal-form',
  imports: [ReactiveFormsModule],
  templateUrl: './journal-form.html',
  styleUrl: './journal-form.css',
})
export class JournalForm {

  private journalService = inject(JournalService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // If this has a value — we are in EDIT mode
  // If null — we are in CREATE mode
  entryId = signal<string | null>(null);

  isLoading = signal(false);
  isFetching = signal(false);
  errorMessage = signal('');

  journalForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(1)]),
    content: new FormControl('')
  });

  get title() { return this.journalForm.get('title'); }

  ngOnInit() {
    // Check if :id exists in the URL
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      // EDIT mode — load existing entry into form
      this.entryId.set(id);
      this.loadEntry(id);
    }
    // else CREATE mode — form stays empty
  }

  loadEntry(id: string) {
    this.isFetching.set(true);
    this.journalService.getById(id).subscribe({
      next: (entry) => {
        // Pre-fill the form with existing values
        this.journalForm.patchValue({
          title: entry.title,
          content: entry.content
        });
        this.isFetching.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load entry.');
        this.isFetching.set(false);
      }
    });
  }

  onSubmit() {
    this.journalForm.markAllAsTouched();
    if (this.journalForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    const data = {
      title: this.journalForm.value.title!,
      content: this.journalForm.value.content || ''
    };

    if (this.entryId()) {
      // EDIT mode — call update
      this.journalService.update(this.entryId()!, data).subscribe({
        next: () => this.router.navigate(['/journals']),
        error: () => {
          this.isLoading.set(false);
          this.errorMessage.set('Failed to update entry.');
        }
      });
    } else {
      // CREATE mode — call create
      this.journalService.create(data).subscribe({
        next: () => this.router.navigate(['/journals']),
        error: () => {
          this.isLoading.set(false);
          this.errorMessage.set('Failed to create entry.');
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/journals']);
  }

}
