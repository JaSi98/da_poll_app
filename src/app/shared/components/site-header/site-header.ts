import { Component, computed, inject, input } from '@angular/core';

import { CreateSurveyLauncher } from '../../../features/create-survey/create-survey-launcher';
import { Button } from '../button/button';
import { Logo, LogoVariant } from '../logo/logo';

export type SiteHeaderVariant = 'dark' | 'light';

@Component({
  selector: 'app-site-header',
  imports: [Button, Logo],
  styleUrl: './site-header.scss',
  templateUrl: './site-header.html',
})
export class SiteHeader {
  private readonly launcher = inject(CreateSurveyLauncher);

  readonly variant = input<SiteHeaderVariant>('dark');

  protected readonly logoVariant = computed<LogoVariant>(() =>
    this.variant() === 'dark' ? 'orange' : 'dark',
  );
  protected readonly hasCreateButton = computed<boolean>(() => this.variant() === 'light');

  /** Opens the dialog for creating a new survey. */
  protected openCreateDialog(): void {
    this.launcher.open();
  }
}
