import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import {
  Menu,
  X,
  User as UserIcon,
  LogOut,
  Ticket,
  Heart,
  PlusCircle,
  Search,
} from 'lucide-react';
import { Role } from '../types';

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentUser, logout } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) =>
    location.pathname === path
      ? 'text-white font-semibold'
      : 'text-gray-300 hover:text-white';

  return (
    <div className='min-h-screen flex flex-col bg-gray-50 font-sans'>
      {/* Navigation */}
      <nav className='bg-[#1e1e2e] text-white sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 '>
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center justify-between'>
              <Link to='/' className='flex-shrink-0 flex items-center'>
                <Ticket className='h-8 w-8 text-yellow-400 transform -rotate-45' />
                <span className='ml-2 text-2xl font-bold text-yellow-400'>
                  Eventify
                </span>
              </Link>
              <div className='hidden md:ml-10 md:flex md:item-center md:space-x-8 mx-auto'>
                <Link to='/' className={`${isActive('/')} text-sm font-medium`}>
                  Home
                </Link>
                <Link
                  to='/events'
                  className={`${isActive('/events')} text-sm font-medium`}
                >
                  Events
                </Link>
              </div>
            </div>

            <div className='hidden md:flex md:items-center md:space-x-6'>
              {currentUser?.role === Role.ORGANIZER && (
                <Link
                  to='/create-event'
                  className='text-sm font-medium text-white hover:text-yellow-400 transition-colors'
                >
                  Create Event
                </Link>
              )}

              <Link
                to='/my-tickets'
                className='flex flex-col items-center text-gray-300 hover:text-white'
              >
                <Ticket className='h-5 w-5' />
                <span className='text-[10px]'>Tickets</span>
              </Link>

              <Link
                to='/interested'
                className='flex flex-col items-center text-gray-300 hover:text-white'
              >
                <Heart className='h-5 w-5' />
                <span className='text-[10px]'>Interested</span>
              </Link>

              {currentUser ? (
                <div className='relative group'>
                  <button className='flex flex-col items-center text-gray-300 hover:text-white focus:outline-none'>
                    <UserIcon className='h-5 w-5' />
                    <span className='text-[10px]'>Profile</span>
                  </button>
                  {/* Dropdown */}
                  <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block focus:outline-none'>
                    <div className='px-4 py-2 border-b'>
                      <p className='text-sm font-medium text-gray-900 truncate'>
                        {currentUser.name}
                      </p>
                      <p className='text-xs text-gray-500 truncate'>
                        {currentUser.email}
                      </p>
                    </div>
                    {currentUser.role === Role.ORGANIZER && (
                      <Link
                        to='/organizer'
                        className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                      >
                        Dashboard
                      </Link>
                    )}
                    <Link
                      to='/profile'
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    >
                      Account Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to='/login'
                  className='flex flex-col items-center text-gray-300 hover:text-white'
                >
                  <UserIcon className='h-5 w-5' />
                  <span className='text-[10px]'>Log In</span>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className='-mr-2 flex items-center md:hidden'>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none'
              >
                {isMobileMenuOpen ? (
                  <X className='h-6 w-6' />
                ) : (
                  <Menu className='h-6 w-6' />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className='md:hidden bg-[#1e1e2e]'>
            <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
              <Link
                to='/'
                className='block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700'
              >
                Home
              </Link>
              <Link
                to='/events'
                className='block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700'
              >
                Events
              </Link>
              {currentUser?.role === Role.ORGANIZER && (
                <Link
                  to='/create-event'
                  className='block px-3 py-2 rounded-md text-base font-medium text-yellow-400 hover:bg-gray-700'
                >
                  Create Event
                </Link>
              )}
              <Link
                to='/my-tickets'
                className='block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700'
              >
                My Tickets
              </Link>
              <Link
                to='/interested'
                className='block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700'
              >
                Interested
              </Link>
            </div>
            <div className='pt-4 pb-4 border-t border-gray-700'>
              {currentUser ? (
                <div className='flex items-center px-5'>
                  <div className='flex-shrink-0'>
                    <img
                      className='h-10 w-10 rounded-full'
                      src={currentUser.avatar}
                      alt=''
                    />
                  </div>
                  <div className='ml-3'>
                    <div className='text-base font-medium leading-none text-white'>
                      {currentUser.name}
                    </div>
                    <div className='text-sm font-medium leading-none text-gray-400 mt-1'>
                      {currentUser.email}
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className='ml-auto bg-gray-800 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white'
                  >
                    <LogOut className='h-6 w-6' />
                  </button>
                </div>
              ) : (
                <div className='px-5'>
                  <Link
                    to='/login'
                    className='block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-[#1e1e2e] bg-yellow-400 hover:bg-yellow-500'
                  >
                    Log In
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className='flex-1 w-full'>{children}</main>

      {/* Footer */}
      <footer className='bg-[#1e1e2e] text-white py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
            <div className='col-span-1 md:col-span-1'>
              <h3 className='text-lg font-bold mb-4'>Categories</h3>
              <ul className='space-y-2 text-sm text-gray-400'>
                <li>
                  <Link to='#' className='hover:text-white'>
                    Concerts & Gigs
                  </Link>
                </li>
                <li>
                  <Link to='#' className='hover:text-white'>
                    Festivals & Lifestyle
                  </Link>
                </li>
                <li>
                  <Link to='#' className='hover:text-white'>
                    Business & Networking
                  </Link>
                </li>
                <li>
                  <Link to='#' className='hover:text-white'>
                    Food & Drinks
                  </Link>
                </li>
              </ul>
            </div>
            <div className='col-span-1 md:col-span-1'>
              <h3 className='text-lg font-bold mb-4'>Download The App</h3>
              <div className='space-y-3'>
                <button className='flex items-center px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors w-full'>
                  <img
                    src='https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg'
                    alt='Play Store'
                    className='h-8'
                  />
                </button>
                <button className='flex items-center px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors w-full'>
                  {/* Using a text placeholder for Apple Store as SVG might be complex */}
                  <div className='flex items-center justify-center w-full space-x-2'>
                    <span className='text-xl'></span>
                    <div className='text-left'>
                      <div className='text-[10px] leading-none'>
                        Download on the
                      </div>
                      <div className='text-sm font-bold leading-none'>
                        App Store
                      </div>
                    </div>
                  </div>
                </button>
              </div>
              <div className='mt-8'>
                <h3 className='text-lg font-bold mb-4'>Follow Us</h3>
                <div className='flex space-x-4 text-sm text-gray-400'>
                  <Link to='#' className='hover:text-white'>
                    Facebook
                  </Link>
                  <Link to='#' className='hover:text-white'>
                    Instagram
                  </Link>
                  <Link to='#' className='hover:text-white'>
                    Twitter
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-500'>
            &copy; 2023 Eventify. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
        <div
          className='fixed inset-0 transition-opacity'
          aria-hidden='true'
          onClick={onClose}
        >
          <div className='absolute inset-0 bg-gray-50 opacity-75'></div>
        </div>
        <span
          className='hidden sm:inline-block sm:align-middle sm:h-screen'
          aria-hidden='true'
        >
          &#8203;
        </span>
        <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full'>
          <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
            <div className='sm:flex sm:items-start'>
              <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full'>
                <h3
                  className='text-lg leading-6 font-medium text-gray-900'
                  id='modal-title'
                >
                  {title}
                </h3>
                <div className='mt-2'>{children}</div>
              </div>
            </div>
          </div>
          <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
            <button
              type='button'
              onClick={onClose}
              className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
