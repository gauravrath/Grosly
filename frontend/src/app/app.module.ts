// src/app/app.component.ts
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
  BrowserModule,
  ReactiveFormsModule
],
  template: `<h1>Hello Angular 20 Standalone!</h1>`,
})
export class AppComponent {}
