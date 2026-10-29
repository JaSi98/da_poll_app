import { Component } from '@angular/core';

import { SiteHeader } from '../../../shared/components/site-header/site-header';

@Component({
  selector: 'app-privacy-policy',
  imports: [SiteHeader],
  styleUrl: '../legal-page.scss',
  templateUrl: './privacy-policy.html',
})
export class PrivacyPolicy {}
