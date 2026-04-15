export interface Child {
  id: string;
  name: string;
  group?: string;
  color: string;
  notes?: string;
}

export interface ScheduleEvent {
  id: string;
  childIds: string[];
  title: string;
  start: string;
  end: string;
  notes?: string;
}
