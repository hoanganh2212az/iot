import React from 'react';
import ProfileCard from '../components/profile/ProfileCard';
import { useData } from '../context/DataContext';

const ProfilePage: React.FC = () => {
  const { userProfile } = useData();
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
      <ProfileCard profile={userProfile} />
    </div>
  );
};

export default ProfilePage;