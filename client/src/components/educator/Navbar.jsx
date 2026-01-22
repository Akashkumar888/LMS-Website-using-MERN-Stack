import React from 'react';
import { UserButton, useUser } from '@clerk/clerk-react';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user } = useUser();

  return (
    <div className="flex items-center justify-between px-6 md:px-10 py-3 border-b bg-white">
      {/* Left: Logo */}
      <Link to="/">
        <img src={assets.logo} alt="Logo" className="w-28 lg:w-32" />
      </Link>

      {/* Center: Title / Greeting */}
      <p className="text-sm md:text-base font-medium text-gray-700">
        Hi! {user ? user.fullName : "Developers"}
      </p>

      {/* Right: Profile */}
      <div className="flex items-center gap-3">
        {user ? (
          <UserButton />
        ) : (
          <img className="w-8 h-8 rounded-full" src={assets.profile_img} />
        )}
      </div>
    </div>
  );
};

export default Navbar;
