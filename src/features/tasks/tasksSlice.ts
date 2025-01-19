import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../../types';

export interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filters: {
    status?: Task['status'];
    priority?: Task['priority'];
  };
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
  filters: {},
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
      state.error = null;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilters: (state, action: PayloadAction<TasksState['filters']>) => {
      state.filters = action.payload;
    },
  },
});

export const {
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  setLoading,
  setError,
  setFilters,
} = tasksSlice.actions;

export default tasksSlice.reducer; 