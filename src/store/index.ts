import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import tasksReducer from '../features/tasks/tasksSlice';
import { AuthState } from '../features/auth/authSlice';
import { TasksState } from '../features/tasks/tasksSlice';

export interface RootState {
  auth: AuthState;
  tasks: TasksState;
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
  },
});

export type AppDispatch = typeof store.dispatch; 