import { Component } from '@angular/core';

import { SiteHeader } from '../../../shared/components/site-header/site-header';

@Component({
  selector: 'app-legal-notice',
  imports: [SiteHeader],
  styleUrl: '../legal-page.scss',
  templateUrl: './legal-notice.html',
})
export class LegalNotice {}
