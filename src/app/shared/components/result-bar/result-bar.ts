import { Component, computed, input } from '@angular/core';

const FULL_PERCENTAGE = 100;

@Component({
  selector: 'app-result-bar',
  styleUrl: './result-bar.scss',
  templateUrl: './result-bar.html',
})
export class ResultBar {
  readonly optionLetter = input.required<string>();
  readonly votes = input.required<number>();
  readonly totalVotes = input.required<number>();

  protected readonly percentage = computed<number>(() => this.calculatePercentage());

  /** Returns the share of votes as a whole-number percentage; 0 if nobody has voted yet. */
  private calculatePercentage(): number {
    const totalVotes = this.totalVotes();
    if (totalVotes === 0) {
      return 0;
    }
    return Math.round((this.votes() / totalVotes) * FULL_PERCENTAGE);
  }
}
