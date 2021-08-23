export type TTask = {
  id?: number;
  name: string;
  description: string;
  startDate: Date;
  finishDate?: Date;
  taskListId: number;
  parentTaskId?: number;
  assignedUserIds?: number[];
  childrenTasks?: TTask[];
  isDone?: boolean;
};
