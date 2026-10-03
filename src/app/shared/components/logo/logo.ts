import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export type LogoVariant = 'orange' | 'dark';

const LOGO_BASE_PATH = 'assets/logo/';

@Component({
  selector: 'app-logo',
  imports: [RouterLink],
  styleUrl: './logo.scss',
  templateUrl: './logo.html',
})
export class Logo {
  readonly variant = input<LogoVariant>('orange');

  protected readonly imagePath = computed<string>(
    () => `${LOGO_BASE_PATH}logo-${this.variant()}.svg`,
  );
}
