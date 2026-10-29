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
  {
    path: 'legal-notice',
    title: 'Legal notice – Poll App',
    loadComponent: () =>
      import('./features/legal/legal-notice/legal-notice').then((m) => m.LegalNotice),
  },
  {
    path: 'privacy-policy',
    title: 'Privacy policy – Poll App',
    loadComponent: () =>
      import('./features/legal/privacy-policy/privacy-policy').then((m) => m.PrivacyPolicy),
  },
  { path: '**', redirectTo: '' },
];
