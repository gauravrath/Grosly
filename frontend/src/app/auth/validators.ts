import { AbstractControl, ValidationErrors } from '@angular/forms';


export function passwordStrength(control: AbstractControl): ValidationErrors | null {
const val = control.value || '';
const min = /.{8,}/.test(val);
const upper = /[A-Z]+/.test(val);
const lower = /[a-z]+/.test(val);
const digit = /[0-9]+/.test(val);
const special = /[^A-Za-z0-9]+/.test(val);
return min && upper && lower && digit && special ? null : { weakPassword: true };
}