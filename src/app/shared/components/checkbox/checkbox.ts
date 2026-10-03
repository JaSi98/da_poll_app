import { Component, input, model } from '@angular/core';

export type CheckboxType = 'checkbox' | 'radio';
export type CheckboxAlignment = 'center' | 'top';

@Component({
  selector: 'app-checkbox',
  styleUrl: './checkbox.scss',
  templateUrl: './checkbox.html',
})
export class Checkbox {
  readonly checked = model<boolean>(false);
  readonly type = input<CheckboxType>('checkbox');
  readonly name = input<string | null>(null);
  readonly isDisabled = input<boolean>(false);
  readonly hasHoverEffect = input<boolean>(true);
  readonly alignment = input<CheckboxAlignment>('center');
  readonly isOnDark = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null);

  /** Syncs the checked state with the native input after a user change. */
  protected updateChecked(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.checked.set(inputElement.checked);
  }
}
