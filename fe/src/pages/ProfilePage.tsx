import React from 'react';
import ProfileCard from '../components/profile/ProfileCard';
import { UserProfile } from '../types';

const ProfilePage: React.FC = () => {
  const userProfile: UserProfile = {
    name: "Lê Hoàng Anh",
    studentId: "B21DCPT044",
    className: "B21DCPT",
    github: "https://github.com/hoanganh2212az/iot",
    pdf: "https://example.com/report.pdf",
    apiDocs: "https://example.com/api-docs",
    avatarUrl: "https://scontent.fhan15-1.fna.fbcdn.net/v/t1.6435-9/131622429_2785405175111232_4383125616284327858_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEkqhKdyXxccX5azblj-NwWhHkuzUZJuZSEeS7NRkm5lNiwb-o8mwAPVHubv7OzQgriLTBZQjqJo2lFBqZTPkkZ&_nc_ohc=Pz50lbdcrq8Q7kNvwHD1j8G&_nc_oc=AdntKy1sFa6rUZRBerEIpIkGYQx56cSCqCElpmp8IcrAxV5Hxnsufw2acub0OjCuTME&_nc_zt=23&_nc_ht=scontent.fhan15-1.fna&_nc_gid=OOCKPyJWlvQ4gRGcThXs3Q&oh=00_AfKoYX04z5Qnc91lm5_btSPsRKAXRnClKPrZ3iziyQGbIA&oe=685522ED"
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
      <ProfileCard profile={userProfile} />
    </div>
  );
};

export default ProfilePage;