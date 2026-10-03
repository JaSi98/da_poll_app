import { Component, ElementRef, computed, inject, input, model, signal } from '@angular/core';

import { DropdownOption, DropdownValue } from '../../models/dropdown-option';

const NO_ACTIVE_OPTION = -1;
let nextDropdownId = 0;

@Component({
  selector: 'app-dropdown',
  styleUrl: './dropdown.scss',
  templateUrl: './dropdown.html',
  host: { '(document:click)': 'closeOnOutsideClick($event)' },
})
export class Dropdown {
  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly keyActions: Record<string, () => void> = {
    ArrowDown: () => this.moveActiveOption(1),
    ArrowUp: () => this.moveActiveOption(-1),
    Enter: () => this.confirmActiveOption(),
    ' ': () => this.confirmActiveOption(),
    Escape: () => this.close(),
  };

  readonly label = input.required<string>();
  readonly options = input.required<DropdownOption[]>();
  readonly selectedValue = model<DropdownValue>(null);
  readonly isDisabled = input<boolean>(false);
  readonly ariaDescribedBy = input<string | null>(null);

  protected readonly listboxId = `dropdown-listbox-${nextDropdownId++}`;
  protected readonly isOpen = signal<boolean>(false);
  protected readonly activeIndex = signal<number>(NO_ACTIVE_OPTION);
  protected readonly activeOptionId = computed<string | null>(() => this.getActiveOptionId());
  protected readonly selectedLabel = computed<string | null>(() => this.findSelectedLabel());

  /** Returns the element id of the option at the given position. */
  protected getOptionId(index: number): string {
    return `${this.listboxId}-option-${index}`;
  }

  /** Opens the menu if it is closed, otherwise closes it. */
  protected toggle(): void {
    if (this.isOpen()) {
      this.close();
      return;
    }
    this.open();
  }

  /** Runs the keyboard action for the pressed key and suppresses the browser default. */
  protected handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      this.close();
      return;
    }
    const action = this.keyActions[event.key];
    if (!action || this.isEscapeForParent(event.key)) {
      return;
    }
    event.preventDefault();
    action();
  }

  /** Returns whether Escape should reach a surrounding dialog because the menu is already closed. */
  private isEscapeForParent(key: string): boolean {
    return key === 'Escape' && !this.isOpen();
  }

  /** Stores the selected option and closes the menu. */
  protected selectOption(option: DropdownOption): void {
    this.selectedValue.set(option.value);
    this.close();
  }

  /** Highlights the option under the pointer, like keyboard navigation does. */
  protected setActiveIndex(index: number): void {
    this.activeIndex.set(index);
  }

  /** Closes the menu when the user clicks anywhere outside of the dropdown. */
  protected closeOnOutsideClick(event: MouseEvent): void {
    const isInsideClick = this.hostElement.nativeElement.contains(event.target as Node);
    if (!isInsideClick) {
      this.close();
    }
  }

  /** Opens the menu and highlights the currently selected option. */
  private open(): void {
    const selectedIndex = this.options().findIndex(
      (option) => option.value === this.selectedValue(),
    );
    this.activeIndex.set(selectedIndex);
    this.isOpen.set(true);
  }

  /** Closes the menu and resets the highlighted option. */
  private close(): void {
    this.isOpen.set(false);
    this.activeIndex.set(NO_ACTIVE_OPTION);
  }

  /** Moves the highlight up or down; opens the menu first if it is closed. */
  private moveActiveOption(step: number): void {
    if (!this.isOpen()) {
      this.open();
      return;
    }
    const lastIndex = this.options().length - 1;
    const nextIndex = Math.min(Math.max(this.activeIndex() + step, 0), lastIndex);
    this.activeIndex.set(nextIndex);
  }

  /** Selects the highlighted option; opens the menu first if it is closed. */
  private confirmActiveOption(): void {
    const activeOption = this.options()[this.activeIndex()];
    if (!this.isOpen() || !activeOption) {
      this.toggle();
      return;
    }
    this.selectOption(activeOption);
  }

  /** Returns the id of the highlighted option for aria-activedescendant. */
  private getActiveOptionId(): string | null {
    const hasActiveOption = this.isOpen() && this.activeIndex() !== NO_ACTIVE_OPTION;
    return hasActiveOption ? this.getOptionId(this.activeIndex()) : null;
  }

  /** Returns the label of the selected option; null means nothing is shown below the trigger. */
  private findSelectedLabel(): string | null {
    if (this.selectedValue() === null) {
      return null;
    }
    const selectedOption = this.options().find((option) => option.value === this.selectedValue());
    return selectedOption?.label ?? null;
  }
}
