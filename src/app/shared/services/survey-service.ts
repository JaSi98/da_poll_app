import { Injectable, inject, signal } from '@angular/core';
import { RealtimePostgresUpdatePayload } from '@supabase/supabase-js';

import { AnswerRow, SurveyDetailRow, SurveyRow } from '../models/database-rows';
import { NewSurvey } from '../models/new-survey';
import { Survey, SurveyDetail } from '../models/survey';
import { toSurvey, toSurveyDetail } from '../utils/survey-mapper';
import { SupabaseService } from './supabase-service';

const SURVEY_TABLE = 'surveys';
const SURVEY_COLUMNS = 'id, title, description, end_date, category_id, categories (name)';
const SURVEY_DETAIL_COLUMNS = `${SURVEY_COLUMNS}, questions (id, position, text, is_multiple_choice, answers (id, position, text, votes))`;
const CREATE_SURVEY_FUNCTION = 'create_survey';
const SUBMIT_VOTES_FUNCTION = 'submit_votes';
const ANSWER_TABLE = 'answers';
let nextVoteChannelId = 0;

export type VotesChangeHandler = (answerId: number, votes: number) => void;

@Injectable({ providedIn: 'root' })
export class SurveyService {
  private readonly supabase = inject(SupabaseService);
  private readonly surveyList = signal<Survey[]>([]);

  readonly surveys = this.surveyList.asReadonly();

  /** Loads all surveys without their questions, for the overview lists. */
  async loadSurveys(): Promise<void> {
    const { data, error } = await this.supabase.client
      .from(SURVEY_TABLE)
      .select(SURVEY_COLUMNS)
      .returns<SurveyRow[]>();
    if (error) {
      throw new Error(`Loading the surveys failed: ${error.message}`);
    }
    this.surveyList.set((data ?? []).map(toSurvey));
  }

  /** Loads one survey with all questions and answers. */
  async loadSurvey(surveyId: number): Promise<SurveyDetail> {
    const { data, error } = await this.supabase.client
      .from(SURVEY_TABLE)
      .select(SURVEY_DETAIL_COLUMNS)
      .eq('id', surveyId)
      .returns<SurveyDetailRow>()
      .single();
    if (error) {
      throw new Error(`Loading survey ${surveyId} failed: ${error.message}`);
    }
    return toSurveyDetail(data);
  }

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

  /** Counts one vote for each chosen answer. */
  async submitVotes(answerIds: number[]): Promise<void> {
    const { error } = await this.supabase.client.rpc(SUBMIT_VOTES_FUNCTION, {
      answer_ids: answerIds,
    });
    if (error) {
      throw new Error(`Submitting the votes failed: ${error.message}`);
    }
  }

  /** Reports every vote change in real time; call the returned function to stop listening. */
  watchVotes(onVotesChange: VotesChangeHandler): () => void {
    const channel = this.supabase.client
      .channel(`answer-votes-${nextVoteChannelId++}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: ANSWER_TABLE },
        (payload: RealtimePostgresUpdatePayload<AnswerRow>) =>
          onVotesChange(payload.new.id, payload.new.votes),
      )
      .subscribe();
    return () => void this.supabase.client.removeChannel(channel);
  }
}
