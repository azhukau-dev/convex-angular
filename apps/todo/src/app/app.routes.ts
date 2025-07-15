import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./pages/todo-list/todo-list'),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
