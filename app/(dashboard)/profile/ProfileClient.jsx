'use client';

import { useState, useRef } from 'react';
import { User, Phone, Shield, Camera, Lock, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfileClient({ session }) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  
  const [profilePic, setProfilePic] = useState(session.profilePicture);
  const [uploading, setUploading] = useState(false);
  
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('/api/auth/profile-picture', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setProfilePic(data.url);
        router.refresh();
      } else {
        alert(data.message || 'Failed to upload image');
      }
    } catch (error) {
      alert('An error occurred during upload');
    } finally {
      setUploading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.new !== passwordData.confirm) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.new.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    try {
      setPasswordLoading(true);
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.current,
          newPassword: passwordData.new
        })
      });

      const data = await res.json();

      if (res.ok) {
        setPasswordSuccess('Password changed successfully');
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordData({ current: '', new: '', confirm: '' });
          setPasswordSuccess('');
        }, 2000);
      } else {
        setPasswordError(data.message || 'Failed to change password');
      }
    } catch (error) {
      setPasswordError('An error occurred. Please try again.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 font-poppins">Admin Profile</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="h-32 bg-[var(--color-brand-blue)]"></div>
        <div className="px-6 pb-6 relative">
          
          <div className="absolute -top-12 left-6">
            <div 
              onClick={handleImageClick}
              className="w-24 h-24 bg-white rounded-full p-1 border-4 border-white shadow-md relative group cursor-pointer flex items-center justify-center overflow-hidden"
            >
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-gray-400" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                <Camera className="w-6 h-6 text-white" />
              </div>
              
              {uploading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-full">
                  <div className="w-6 h-6 border-2 border-[var(--color-brand-blue)] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          
          <div className="pt-16">
            <h2 className="text-2xl font-bold text-gray-900 font-poppins">{session.name}</h2>
            <p className="text-[var(--color-brand-blue)] font-medium mb-6">{session.role || 'Administrator'}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
                <div className="p-3 bg-white rounded-full text-[var(--color-brand-blue)] shadow-sm">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mobile Number</p>
                  <p className="font-semibold text-gray-900">+91 {session.mobile}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
                <div className="p-3 bg-white rounded-full text-green-600 shadow-sm">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Access Level</p>
                  <p className="font-semibold text-gray-900">{session.role || 'Full Access'}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-100 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-poppins">Account Actions</h3>
              <div className="flex space-x-4">
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <Lock size={16} />
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Change Password</h3>
              
              {passwordSuccess ? (
                <div className="bg-green-50 text-green-600 p-4 rounded-lg flex items-center gap-3 mb-4">
                  <div className="bg-green-100 p-1 rounded-full">
                    <Check size={16} />
                  </div>
                  <p className="font-medium">{passwordSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  {passwordError && (
                    <div className="bg-blue-50 text-red-600 p-3 rounded-lg text-sm">
                      {passwordError}
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input 
                      type="password" 
                      required
                      value={passwordData.current}
                      onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1b9af7] focus:border-transparent outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input 
                      type="password" 
                      required
                      value={passwordData.new}
                      onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1b9af7] focus:border-transparent outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input 
                      type="password" 
                      required
                      value={passwordData.confirm}
                      onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1b9af7] focus:border-transparent outline-none"
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button"
                      onClick={() => setShowPasswordModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={passwordLoading}
                      className="flex-1 px-4 py-2 bg-[#1b9af7] text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-70 flex justify-center items-center"
                    >
                      {passwordLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        'Save Password'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
