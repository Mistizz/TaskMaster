import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../store';
import { supabase } from '../lib/supabase';
import { setTasks, setLoading, setError } from '../features/tasks/tasksSlice';
import { Task } from '../types';

const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error, filters } = useSelector(
    (state: RootState) => state.tasks
  );
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo' as Task['status'],
    priority: 'medium' as Task['priority'],
    due_date: '',
  });

  useEffect(() => {
    const fetchTasks = async () => {
      dispatch(setLoading(true));
      try {
        let query = supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false });

        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.priority) {
          query = query.eq('priority', filters.priority);
        }

        const { data, error } = await query;

        if (error) throw error;

        dispatch(setTasks(data));
      } catch (error) {
        dispatch(setError(error instanceof Error ? error.message : 'An error occurred'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchTasks();
  }, [dispatch, filters]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setLoading(true));

    try {
      const { data, error } = await supabase.from('tasks').insert([
        {
          ...newTask,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        },
      ]).select();

      if (error) throw error;

      if (data) {
        dispatch(setTasks([...tasks, ...data]));
        setShowAddTask(false);
        setNewTask({
          title: '',
          description: '',
          status: 'todo',
          priority: 'medium',
          due_date: '',
        });
      }
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'An error occurred'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBadgeColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'todo':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center">Loading tasks...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <button
          onClick={() => setShowAddTask(!showAddTask)}
          className="btn btn-primary"
        >
          {showAddTask ? 'Cancel' : 'Add Task'}
        </button>
      </div>

      {showAddTask && (
        <form onSubmit={handleAddTask} className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                id="title"
                type="text"
                required
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                className="input mt-1"
                placeholder="Enter task title"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                className="input mt-1"
                rows={3}
                placeholder="Enter task description"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  value={newTask.status}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      status: e.target.value as Task['status'],
                    })
                  }
                  className="input mt-1"
                  title="Task status"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  id="priority"
                  value={newTask.priority}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      priority: e.target.value as Task['priority'],
                    })
                  }
                  className="input mt-1"
                  title="Task priority"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input
                  id="due_date"
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) =>
                    setNewTask({ ...newTask, due_date: e.target.value })
                  }
                  className="input mt-1"
                  title="Task due date"
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Add Task
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4">
        {tasks.map((task: Task) => (
          <Link
            key={task.id}
            to={`/tasks/${task.id}`}
            className="block bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {task.title}
                </h2>
                {task.description && (
                  <p className="mt-2 text-gray-600">{task.description}</p>
                )}
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                  task.status
                )}`}
              >
                {task.status.replace('_', ' ')}
              </span>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority} priority
              </span>
              {task.due_date && (
                <>
                  <span className="mx-2">•</span>
                  <span>Due {new Date(task.due_date).toLocaleDateString()}</span>
                </>
              )}
            </div>
          </Link>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No tasks found. Create a new task to get started!
        </div>
      )}
    </div>
  );
};

export default TaskList; 