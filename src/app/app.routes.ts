import { Routes } from '@angular/router';
import { noAuthGuard } from './core/guards/no-auth-guard';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
    path: 'login',
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./features/auth/register/register').then(m => m.Register)
  },
  {
    path: 'journals',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/journal/journal-list/journal-list').then(m => m.JournalList)
  },
  {
    path: 'journals/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/journal/journal-form/journal-form').then(m => m.JournalForm)
  },
  {
    path: 'journals/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/journal/journal-detail/journal-detail').then(m => m.JournalDetail)
  },
  {
    path: 'journals/:id/edit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/journal/journal-form/journal-form').then(m => m.JournalForm)
  },
  {
    path: '**',
    redirectTo: 'login'
  }

];
