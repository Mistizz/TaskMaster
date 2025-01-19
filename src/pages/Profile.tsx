import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';
import { setError } from '../features/auth/authSlice';

const ProfilePage = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<Profile>>({});

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setProfile(data);
        setEditedProfile(data || {});
      } catch (error) {
        dispatch(setError(error instanceof Error ? error.message : 'An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, dispatch]);

  const handleUpdate = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...editedProfile,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setProfile({ ...profile, ...editedProfile } as Profile);
      setEditing(false);
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading profile...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <button
          onClick={() => setEditing(!editing)}
          className="btn btn-secondary"
        >
          {editing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        {editing ? (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={editedProfile.username || ''}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, username: e.target.value })
                }
                className="input mt-1"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label
                htmlFor="avatar_url"
                className="block text-sm font-medium text-gray-700"
              >
                Avatar URL
              </label>
              <input
                id="avatar_url"
                type="url"
                value={editedProfile.avatar_url || ''}
                onChange={(e) =>
                  setEditedProfile({
                    ...editedProfile,
                    avatar_url: e.target.value,
                  })
                }
                className="input mt-1"
                placeholder="Enter avatar URL"
              />
            </div>
            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700"
              >
                Bio
              </label>
              <textarea
                id="bio"
                value={editedProfile.bio || ''}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, bio: e.target.value })
                }
                className="input mt-1"
                rows={3}
                placeholder="Write something about yourself"
              />
            </div>
            <button onClick={handleUpdate} className="btn btn-primary w-full">
              Save Changes
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center space-x-4 mb-6">
              {profile?.avatar_url && (
                <img
                  src={profile.avatar_url}
                  alt={`${profile.username}'s avatar`}
                  className="w-20 h-20 rounded-full"
                />
              )}
              <div>
                <h2 className="text-2xl font-semibold">
                  {profile?.username || user?.email}
                </h2>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>
            {profile?.bio && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">About</h3>
                <p className="text-gray-600">{profile.bio}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage; 