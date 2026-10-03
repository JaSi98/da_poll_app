import { Component, computed, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'filter' | 'tertiary';
export type ButtonIcon = 'none' | 'add' | 'check' | 'close';
export type ButtonType = 'button' | 'submit';

const ICON_BASE_PATH = 'assets/icons/';
const ICON_SYMBOL_ID = '#icon';
const ICON_FILE_NAMES: Record<Exclude<ButtonIcon, 'none'>, string> = {
  add: 'add-circle.svg',
  check: 'check.svg',
  close: 'close.svg',
};

@Component({
  selector: 'app-button',
  styleUrl: './button.scss',
  templateUrl: './button.html',
})
export class Button {
  readonly variant = input<ButtonVariant>('primary');
  readonly label = input.required<string>();
  readonly icon = input<ButtonIcon>('none');
  readonly type = input<ButtonType>('button');
  readonly isActive = input<boolean>(false);
  readonly isDisabled = input<boolean>(false);
  readonly isOnLight = input<boolean>(false);

  readonly buttonClick = output<void>();

  protected readonly hasIcon = computed<boolean>(() => this.icon() !== 'none');
  protected readonly modifierClasses = computed<string[]>(() => this.getModifierClasses());
  protected readonly iconHref = computed<string>(() => this.getIconHref());
  protected readonly ariaPressed = computed<boolean | null>(() => this.getAriaPressed());

  /** Forwards the click to the parent component. */
  protected emitClick(): void {
    this.buttonClick.emit();
  }

  /** Returns the BEM modifier classes for the variant, the active state and light backgrounds. */
  private getModifierClasses(): string[] {
    const classes = [`button--${this.variant()}`];
    if (this.isActive()) {
      classes.push('button--active');
    }
    if (this.isOnLight()) {
      classes.push('button--on-light');
    }
    return classes;
  }

  /** Returns the path to the SVG symbol of the selected icon. */
  private getIconHref(): string {
    const icon = this.icon();
    if (icon === 'none') {
      return '';
    }
    return ICON_BASE_PATH + ICON_FILE_NAMES[icon] + ICON_SYMBOL_ID;
  }

  /** Returns the aria-pressed value; only filter buttons act as toggles. */
  private getAriaPressed(): boolean | null {
    const isToggleButton = this.variant() === 'filter';
    return isToggleButton ? this.isActive() : null;
  }
}
