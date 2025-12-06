import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Camera } from 'lucide-react';

export const Profile: React.FC = () => {
  const { currentUser, updateProfile } = useStore();
  const [activeTab, setActiveTab] = useState<'info' | 'email' | 'password'>(
    'info'
  );
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    website: '',
    company: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    pincode: '',
    avatar: '',
  });

  // Load user data
  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName:
          currentUser.firstName || currentUser.name.split(' ')[0] || '',
        lastName:
          currentUser.lastName ||
          currentUser.name.split(' ').slice(1).join(' ') ||
          '',
        website: currentUser.website || '',
        company: currentUser.company || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        city: currentUser.city || '',
        country: currentUser.country || '',
        pincode: currentUser.pincode || '',
        avatar: currentUser.avatar || '',
      });
    }
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!currentUser) return;
    setIsSaving(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    updateProfile(currentUser.id, {
      ...formData,
      name:
        `${formData.firstName} ${formData.lastName}`.trim() || currentUser.name,
    });

    setIsSaving(false);
    alert('Profile updated successfully!');
  };

  const renderSidebar = () => (
    <div className='w-full md:w-64 bg-gray-50/50 md:min-h-screen border-r border-gray-200'>
      <div className='p-6'>
        <h2 className='text-xl font-bold text-gray-800 mb-6'>
          Account Settings
        </h2>
        <nav className='space-y-1'>
          <button
            onClick={() => setActiveTab('info')}
            className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors border-l-4 ${
              activeTab === 'info'
                ? 'bg-white text-gray-900 border-[#1e1e2e] shadow-sm'
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Account Info
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors border-l-4 ${
              activeTab === 'email'
                ? 'bg-white text-gray-900 border-[#1e1e2e] shadow-sm'
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Change Email
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors border-l-4 ${
              activeTab === 'password'
                ? 'bg-white text-gray-900 border-[#1e1e2e] shadow-sm'
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Password
          </button>
        </nav>
      </div>
    </div>
  );

  const renderAccountInfo = () => (
    <div className='space-y-8 animate-fade-in'>
      <div>
        <h2 className='text-2xl font-bold text-gray-900 mb-8 border-b pb-4'>
          Account Information
        </h2>

        {/* Profile Photo */}
        <div className='mb-10'>
          <h3 className='text-lg font-medium text-gray-900 mb-4'>
            Profile Photo
          </h3>
          <div className='relative inline-block group'>
            <div className='h-32 w-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-sm bg-gray-200'>
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt='Profile'
                  className='h-full w-full object-cover'
                />
              ) : (
                <div className='h-full w-full flex items-center justify-center text-gray-400 text-4xl font-bold bg-gray-100'>
                  {formData.firstName?.[0]}
                </div>
              )}
            </div>
            <button className='absolute bottom-1 right-1 bg-white p-2.5 rounded-full shadow-lg border border-gray-200 text-gray-600 hover:text-[#1e1e2e] hover:scale-105 transition-all'>
              <Camera className='h-5 w-5' />
            </button>
          </div>
        </div>

        {/* Profile Information */}
        <div className='space-y-6 mb-12'>
          <h3 className='text-lg font-medium text-gray-900 border-b pb-2'>
            Profile Information
          </h3>

          <div className='space-y-5 max-w-3xl'>
            <div className='grid grid-cols-1 md:grid-cols-12 gap-4 items-center'>
              <label className='block text-sm font-medium text-gray-700 md:col-span-3'>
                First Name:
              </label>
              <div className='md:col-span-9'>
                <input
                  type='text'
                  name='firstName'
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder='Enter first name'
                  className='block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1e1e2e] focus:border-[#1e1e2e] px-4 py-2.5 border'
                />
              </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-12 gap-4 items-center'>
              <label className='block text-sm font-medium text-gray-700 md:col-span-3'>
                Last Name:
              </label>
              <div className='md:col-span-9'>
                <input
                  type='text'
                  name='lastName'
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder='Enter last name'
                  className='block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1e1e2e] focus:border-[#1e1e2e] px-4 py-2.5 border'
                />
              </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-12 gap-4 items-center'>
              <label className='block text-sm font-medium text-gray-700 md:col-span-3'>
                Website:
              </label>
              <div className='md:col-span-9'>
                <input
                  type='text'
                  name='website'
                  value={formData.website}
                  onChange={handleChange}
                  placeholder='Enter website'
                  className='block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1e1e2e] focus:border-[#1e1e2e] px-4 py-2.5 border'
                />
              </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-12 gap-4 items-center'>
              <label className='block text-sm font-medium text-gray-700 md:col-span-3'>
                Company:
              </label>
              <div className='md:col-span-9'>
                <input
                  type='text'
                  name='company'
                  value={formData.company}
                  onChange={handleChange}
                  placeholder='Enter company name'
                  className='block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1e1e2e] focus:border-[#1e1e2e] px-4 py-2.5 border'
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className='space-y-6'>
          <div className='border-b pb-2'>
            <h3 className='text-lg font-medium text-gray-900'>
              Contact Details
            </h3>
            <p className='text-sm text-gray-500 mt-1'>
              These details are private and only used to contact you for
              ticketing or prizes.
            </p>
          </div>

          <div className='space-y-5 max-w-3xl'>
            <div className='grid grid-cols-1 md:grid-cols-12 gap-4 items-center'>
              <label className='block text-sm font-medium text-gray-700 md:col-span-3'>
                Phone Number:
              </label>
              <div className='md:col-span-9'>
                <input
                  type='text'
                  name='phone'
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder='Enter phone number'
                  className='block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1e1e2e] focus:border-[#1e1e2e] px-4 py-2.5 border'
                />
              </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-12 gap-4 items-center'>
              <label className='block text-sm font-medium text-gray-700 md:col-span-3'>
                Address:
              </label>
              <div className='md:col-span-9'>
                <input
                  type='text'
                  name='address'
                  value={formData.address}
                  onChange={handleChange}
                  placeholder='Enter address'
                  className='block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1e1e2e] focus:border-[#1e1e2e] px-4 py-2.5 border'
                />
              </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-12 gap-4 items-center'>
              <label className='block text-sm font-medium text-gray-700 md:col-span-3'>
                City/Town:
              </label>
              <div className='md:col-span-9'>
                <input
                  type='text'
                  name='city'
                  value={formData.city}
                  onChange={handleChange}
                  placeholder='Enter city'
                  className='block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1e1e2e] focus:border-[#1e1e2e] px-4 py-2.5 border'
                />
              </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-12 gap-4 items-center'>
              <label className='block text-sm font-medium text-gray-700 md:col-span-3'>
                Country:
              </label>
              <div className='md:col-span-9'>
                <input
                  type='text'
                  name='country'
                  value={formData.country}
                  onChange={handleChange}
                  placeholder='Enter country'
                  className='block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1e1e2e] focus:border-[#1e1e2e] px-4 py-2.5 border'
                />
              </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-12 gap-4 items-center'>
              <label className='block text-sm font-medium text-gray-700 md:col-span-3'>
                Pincode:
              </label>
              <div className='md:col-span-9'>
                <input
                  type='text'
                  name='pincode'
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder='Enter pincode'
                  className='block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1e1e2e] focus:border-[#1e1e2e] px-4 py-2.5 border'
                />
              </div>
            </div>
          </div>
        </div>

        <div className='pt-8'>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className='px-8 py-3 bg-[#1e1e2e] text-white rounded-lg font-medium shadow-lg hover:bg-[#2d2d44] transition-colors disabled:opacity-70 flex items-center'
          >
            {isSaving ? (
              <>
                <span className='animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full'></span>
                Saving...
              </>
            ) : (
              'Save My Profile'
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderChangeEmail = () => (
    <div className='max-w-2xl animate-fade-in'>
      <h2 className='text-2xl font-bold text-gray-900 mb-6 pb-4 border-b'>
        Change Email
      </h2>
      <div className='space-y-6'>
        <div className='space-y-2 bg-blue-50 p-4 rounded-lg border border-blue-100 text-blue-800'>
          <label className='block text-sm font-bold'>Current Email</label>
          <div className='text-lg'>{currentUser?.email}</div>
        </div>
        <div className='space-y-1'>
          <label className='block text-sm font-medium text-gray-700'>
            New Email
          </label>
          <input
            type='email'
            placeholder='Enter new email'
            className='block w-full border-gray-300 rounded-md px-4 py-2.5 border focus:ring-[#1e1e2e] focus:border-[#1e1e2e]'
          />
        </div>
        <div className='space-y-1'>
          <label className='block text-sm font-medium text-gray-700'>
            Confirm Email
          </label>
          <input
            type='email'
            placeholder='Enter again'
            className='block w-full border-gray-300 rounded-md px-4 py-2.5 border focus:ring-[#1e1e2e] focus:border-[#1e1e2e]'
          />
        </div>
        <div className='pt-4'>
          <button className='px-6 py-2.5 bg-[#1e1e2e] text-white rounded-lg font-medium shadow hover:bg-[#2d2d44] transition-colors'>
            Save New Email
          </button>
        </div>
      </div>
    </div>
  );

  const renderPassword = () => (
    <div className='max-w-2xl animate-fade-in'>
      <h2 className='text-2xl font-bold text-gray-900 mb-6 pb-4 border-b'>
        Set Password
      </h2>
      <div className='space-y-6'>
        <div className='bg-yellow-50 border-l-4 border-yellow-400 p-4'>
          <div className='flex'>
            <div className='ml-3'>
              <p className='text-sm text-yellow-700'>
                A password has not been set for your account yet or you logged
                in via social media.
              </p>
            </div>
          </div>
        </div>
        <button className='px-6 py-2.5 bg-[#1e1e2e] text-white rounded-lg font-medium shadow hover:bg-[#2d2d44] transition-colors'>
          Set Password
        </button>
      </div>
    </div>
  );

  return (
    <div className='bg-white min-h-screen font-sans'>
      <div className='flex flex-col md:flex-row max-w-7xl mx-auto shadow-sm min-h-screen'>
        {/* Sidebar */}
        {renderSidebar()}

        {/* Main Content */}
        <div className='flex-1 p-6 md:p-12 bg-white'>
          {activeTab === 'info' && renderAccountInfo()}
          {activeTab === 'email' && renderChangeEmail()}
          {activeTab === 'password' && renderPassword()}
        </div>
      </div>
    </div>
  );
};
