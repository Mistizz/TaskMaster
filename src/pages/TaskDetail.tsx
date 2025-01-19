import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { supabase } from '../lib/supabase';
import { Task } from '../types';
import { setError } from '../features/tasks/tasksSlice';

const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        setTask(data);
        setEditedTask(data);
      } catch (error) {
        dispatch(setError(error instanceof Error ? error.message : 'An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, dispatch]);

  const handleUpdate = async () => {
    if (!editedTask) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('tasks')
        .update(editedTask)
        .eq('id', id);

      if (error) throw error;

      setTask(editedTask);
      setEditing(false);
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id);

      if (error) throw error;

      navigate('/tasks');
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading task...</div>;
  }

  if (!task) {
    return <div className="text-center">Task not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Task Details</h1>
        <div className="space-x-2">
          <button
            onClick={() => setEditing(!editing)}
            className="btn btn-secondary"
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
          <button onClick={handleDelete} className="btn bg-red-600 text-white hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>

      {editing && editedTask ? (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="space-y-4">
            <div>
              <label htmlFor="edit_title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                id="edit_title"
                type="text"
                value={editedTask.title}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, title: e.target.value })
                }
                className="input mt-1"
                placeholder="Enter task title"
              />
            </div>
            <div>
              <label htmlFor="edit_description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="edit_description"
                value={editedTask.description || ''}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, description: e.target.value })
                }
                className="input mt-1"
                rows={3}
                placeholder="Enter task description"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="edit_status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="edit_status"
                  value={editedTask.status}
                  onChange={(e) =>
                    setEditedTask({
                      ...editedTask,
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
                <label htmlFor="edit_priority" className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  id="edit_priority"
                  value={editedTask.priority}
                  onChange={(e) =>
                    setEditedTask({
                      ...editedTask,
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
                <label htmlFor="edit_due_date" className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input
                  id="edit_due_date"
                  type="date"
                  value={editedTask.due_date || ''}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, due_date: e.target.value })
                  }
                  className="input mt-1"
                  title="Task due date"
                />
              </div>
            </div>
            <button onClick={handleUpdate} className="btn btn-primary w-full">
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              {task.title}
            </h2>
            {task.description && (
              <p className="mt-2 text-gray-600">{task.description}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <p className="mt-1 text-lg text-gray-900">
                {task.status.replace('_', ' ')}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Priority</h3>
              <p className="mt-1 text-lg text-gray-900">{task.priority}</p>
            </div>
            {task.due_date && (
              <div className="col-span-2">
                <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
                <p className="mt-1 text-lg text-gray-900">
                  {new Date(task.due_date).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetail; 