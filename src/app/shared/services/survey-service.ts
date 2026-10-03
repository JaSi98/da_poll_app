import { Injectable, inject } from '@angular/core';

import { NewSurvey } from '../models/new-survey';
import { SupabaseService } from './supabase-service';

const CREATE_SURVEY_FUNCTION = 'create_survey';

@Injectable({ providedIn: 'root' })
export class SurveyService {
  private readonly supabase = inject(SupabaseService);

  /** Saves a survey with all questions and answers in one transaction and returns its id. */
  async createSurvey(newSurvey: NewSurvey): Promise<number> {
    const { data, error } = await this.supabase.client.rpc(CREATE_SURVEY_FUNCTION, {
      survey_title: newSurvey.title,
      survey_description: newSurvey.description,
      survey_end_date: newSurvey.endDate,
      survey_category_id: newSurvey.categoryId,
      survey_questions: newSurvey.questions,
    });
    if (error) {
      throw new Error(`Creating the survey failed: ${error.message}`);
    }
    return data as number;
  }
}
