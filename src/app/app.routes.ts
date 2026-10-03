import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Poll App',
    loadComponent: () => import('./features/home/home-page/home-page').then((m) => m.HomePage),
  },
  {
    path: 'surveys/:id',
    title: 'Survey – Poll App',
    loadComponent: () =>
      import('./features/survey-detail/survey-detail-page/survey-detail-page').then(
        (m) => m.SurveyDetailPage,
      ),
  },
  { path: '**', redirectTo: '' },
];
