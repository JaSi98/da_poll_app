import { Component, DestroyRef, OnInit, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, ControlValueAccessor, NgControl } from '@angular/forms';

export type TextFieldType = 'text' | 'date';

const DEFAULT_ERROR_MESSAGE = 'This field is required.';
let nextTextFieldId = 0;

@Component({
  selector: 'app-text-field',
  styleUrl: './text-field.scss',
  templateUrl: './text-field.html',
})
export class TextField implements ControlValueAccessor, OnInit {
  private readonly ngControl = inject(NgControl, { self: true, optional: true });
  private readonly destroyRef = inject(DestroyRef);
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  readonly label = input<string | null>(null);
  readonly isOptional = input<boolean>(false);
  readonly isMultiline = input<boolean>(false);
  readonly type = input<TextFieldType>('text');
  readonly ariaLabel = input<string | null>(null);
  readonly errorMessage = input<string>(DEFAULT_ERROR_MESSAGE);

  protected readonly fieldId = `text-field-${nextTextFieldId++}`;
  protected readonly errorId = `${this.fieldId}-error`;
  protected readonly value = signal<string>('');
  protected readonly isDisabled = signal<boolean>(false);
  protected readonly hasError = signal<boolean>(false);

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  /** Watches the form control so errors also appear after markAllAsTouched(). */
  ngOnInit(): void {
    const control = this.ngControl?.control;
    if (!control) {
      return;
    }
    control.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateErrorState(control));
  }

  /** Writes a value from the form model into the field. */
  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  /** Registers the callback that reports value changes to the form. */
  registerOnChange(onChange: (value: string) => void): void {
    this.onChange = onChange;
  }

  /** Registers the callback that reports the touched state to the form. */
  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  /** Enables or disables the field when the form control does. */
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  /** Stores the typed value and reports it to the form. */
  protected updateValue(event: Event): void {
    const fieldElement = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.value.set(fieldElement.value);
    this.onChange(fieldElement.value);
  }

  /** Reports to the form that the user has left the field. */
  protected markAsTouched(): void {
    this.onTouched();
  }

  /** Shows the error only after the user has interacted with an invalid field. */
  private updateErrorState(control: AbstractControl): void {
    this.hasError.set(control.invalid && control.touched);
  }
}
