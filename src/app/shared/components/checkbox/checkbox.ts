import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  styleUrl: './checkbox.scss',
  templateUrl: './checkbox.html',
})
export class Checkbox {
  readonly checked = model<boolean>(false);
  readonly isDisabled = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null);

  /** Syncs the checked state with the native checkbox after a user change. */
  protected updateChecked(event: Event): void {
    const checkboxElement = event.target as HTMLInputElement;
    this.checked.set(checkboxElement.checked);
  }
}
