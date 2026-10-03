import { Component, computed, input, output } from '@angular/core';

export type IconButtonVariant = 'delete' | 'edit';

const ICON_BASE_PATH = 'assets/icons/';
const ICON_SYMBOL_ID = '#icon';
const DELETE_ICON_FILE = 'delete.svg';
const EDIT_ICON_FILE = 'edit.svg';
const CONFIRM_ICON_FILE = 'check.svg';

@Component({
  selector: 'app-icon-button',
  styleUrl: './icon-button.scss',
  templateUrl: './icon-button.html',
})
export class IconButton {
  readonly variant = input.required<IconButtonVariant>();
  readonly ariaLabel = input.required<string>();
  readonly isEditing = input<boolean>(false);

  readonly buttonClick = output<void>();

  protected readonly isEditVariant = computed<boolean>(() => this.variant() === 'edit');
  protected readonly isEditingActive = computed<boolean>(
    () => this.isEditVariant() && this.isEditing(),
  );
  protected readonly iconHref = computed<string>(
    () => ICON_BASE_PATH + this.getIconFileName() + ICON_SYMBOL_ID,
  );
  protected readonly ariaPressed = computed<boolean | null>(() =>
    this.isEditVariant() ? this.isEditing() : null,
  );

  /** Forwards the click to the parent component. */
  protected emitClick(): void {
    this.buttonClick.emit();
  }

  /** Returns the icon file for the variant; edit shows a check while editing. */
  private getIconFileName(): string {
    if (!this.isEditVariant()) {
      return DELETE_ICON_FILE;
    }
    return this.isEditing() ? CONFIRM_ICON_FILE : EDIT_ICON_FILE;
  }
}
