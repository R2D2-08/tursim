import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import './Profile.css';
import { profileAPI } from '../services/api';

interface User {
  name: string;
  email: string;
}

const Profile: React.FC = () => {
  const [profileData, setProfileData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileAPI.get();
        setProfileData(data);
      } catch (err) {
        setError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <Layout>
      <div className="profile">
        <div className="profile-box">
          <h2>Profile</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : profileData ? (
            <div className="profile-info">
              <div className="info-item">
                <label>Name:</label>
                <span>{profileData.name}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{profileData.email}</span>
              </div>
            </div>
          ) : (
            <p>No profile data available.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
