import React from 'react';
import { UserProfile } from '../../types';
import { Github, FileText, FileCode } from 'lucide-react';

interface ProfileCardProps {
  profile: UserProfile;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="flex flex-col md:flex-row">
        <div className="flex justify-center p-6">
          <img 
            className="h-48 w-48 object-cover rounded-full border-4 border-blue-500" 
            src={profile.avatarUrl}
            alt={profile.name} 
          />
        </div>
        <div className="p-8 flex-1">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
              <span className="mr-2">👤</span> Họ tên: {profile.name}
            </h2>
            <p className="text-gray-700 mb-2 flex items-center">
              <span className="mr-2">🆔</span> MSV: {profile.studentId}
            </p>
            <p className="text-gray-700 mb-2 flex items-center">
              <span className="mr-2">👨‍🎓</span> Lớp: {profile.className}
            </p>
          </div>
          
          <div className="space-y-4">
            <a 
              href={profile.github} 
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Github className="mr-2" size={20} />
              <span>Github</span>
            </a>
            
            <a 
              href={profile.pdf} 
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              target="_blank" 
              rel="noopener noreferrer"
            >
              <FileText className="mr-2" size={20} />
              <span>PDF</span>
            </a>
            
            <a 
              href={profile.apiDocs} 
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              target="_blank" 
              rel="noopener noreferrer"
            >
              <FileCode className="mr-2" size={20} />
              <span>APIDocs</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;