export interface Survey {
  id: string;
  title: string;
  category: string;
  description: string | null;
  endDate: Date | null;
}
