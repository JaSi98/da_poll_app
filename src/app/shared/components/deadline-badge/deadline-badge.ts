import { Component, computed, input } from '@angular/core';

const SINGLE_DAY = 1;

@Component({
  selector: 'app-deadline-badge',
  styleUrl: './deadline-badge.scss',
  templateUrl: './deadline-badge.html',
})
export class DeadlineBadge {
  readonly daysLeft = input.required<number>();
  readonly isHighlighted = input<boolean>(false);

  protected readonly isEnded = computed<boolean>(() => this.daysLeft() <= 0);
  protected readonly dayUnit = computed<string>(() => this.getDayUnit());

  /** Returns the singular or plural day unit for the remaining days. */
  private getDayUnit(): string {
    return this.daysLeft() === SINGLE_DAY ? 'Day' : 'Days';
  }
}
