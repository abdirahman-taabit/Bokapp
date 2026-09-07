import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { BookFormComponent } from './pages/book-form/book-form';
import { BooksComponent } from './pages/books/books';
import { LoginComponent } from './pages/login/login';
import { QuoteFormComponent } from './pages/quote-form/quote-form';
import { QuotesComponent } from './pages/quotes/quotes';
import { RegisterComponent } from './pages/register/register';

export const routes: Routes = [
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  { path: 'books', component: BooksComponent, canActivate: [authGuard] },
  { path: 'books/new', component: BookFormComponent, canActivate: [authGuard] },
  { path: 'books/:id/edit', component: BookFormComponent, canActivate: [authGuard] },
  { path: 'quotes', component: QuotesComponent, canActivate: [authGuard] },
  { path: 'quotes/new', component: QuoteFormComponent, canActivate: [authGuard] },
  { path: 'quotes/:id/edit', component: QuoteFormComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: 'books' },
];
