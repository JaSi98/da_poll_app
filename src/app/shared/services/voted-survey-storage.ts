import { Injectable } from '@angular/core';

const STORAGE_KEY = 'poll-app-voted-surveys';

@Injectable({ providedIn: 'root' })
export class VotedSurveyStorage {
  /** Returns whether this browser has already taken part in the survey. */
  hasVoted(surveyId: number): boolean {
    return this.readVotedIds().includes(surveyId);
  }

  /** Remembers in this browser that the survey has been answered. */
  markAsVoted(surveyId: number): void {
    const votedIds = this.readVotedIds();
    if (votedIds.includes(surveyId)) {
      return;
    }
    this.writeVotedIds([...votedIds, surveyId]);
  }

  /** Reads the stored survey ids; returns an empty list if storage is unavailable or invalid. */
  private readVotedIds(): number[] {
    try {
      const storedValue: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
      return Array.isArray(storedValue) ? storedValue.filter(Number.isInteger) : [];
    } catch {
      return [];
    }
  }

  /** Stores the survey ids; private browser modes may block storage, then voting is simply not remembered. */
  private writeVotedIds(votedIds: number[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(votedIds));
    } catch {
      console.warn('Voted surveys could not be stored in this browser.');
    }
  }
}
