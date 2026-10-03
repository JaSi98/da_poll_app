import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CreateSurveyDialog } from './features/create-survey/create-survey-dialog/create-survey-dialog';
import { CreateSurveyLauncher } from './features/create-survey/create-survey-launcher';
import { PublishConfirmation } from './features/create-survey/publish-confirmation/publish-confirmation';

@Component({
  imports: [RouterOutlet, CreateSurveyDialog, PublishConfirmation],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly launcher = inject(CreateSurveyLauncher);
}
