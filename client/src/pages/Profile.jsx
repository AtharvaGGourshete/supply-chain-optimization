import Footer from "@/components/Footer";
import SleekNavbar from "@/components/Navbar";
import React, { useState } from "react";
// Assuming you have an Icon library like 'lucide-react' or similar.
// I'll use simple text/placeholder icons.

const Profile = () => {
  // Mock User data structure, based on a common model:
  const initialUserData = {
    profilePicture: "/path/to/default-avatar.jpg", // Placeholder
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex.johnson@example.com",
    bio: "Passionate developer and lifelong learner. I enjoy building things that live on the internet.",
    location: "San Francisco, CA",
  };

  const [userData, setUserData] = useState(initialUserData);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // 1. **Database Update Logic goes here**
    // e.g., an API call: await updateProfile(userData);
    console.log("Saving new profile data:", userData);
    // 2. Set editing mode to false
    setIsEditing(false);
    // 3. Show success notification (not implemented here)
    // NOTE: In a real app, you would only update initialUserData on success.
    // For this example, it's fine.
  };

  // Modern Input Component for re-use
  const ModernInput = ({ label, name, value, onChange, disabled = false, type = 'text' }) => (
    <div className="sm:col-span-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`block w-full rounded-md border ${disabled ? 'bg-gray-50 text-gray-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} shadow-sm p-3 sm:text-sm transition-colors duration-150`}
        />
      </div>
    </div>
  );

  return (
    <>
      <SleekNavbar />
      <div className="min-h-screen bg-gray-50 py-10 mt-20">
        {/* Main Content Container (Full Width) */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Page Header */}
          <header className="mb-8 text-center sm:text-left">
            <h1 className="text-3xl font-extrabold leading-tight text-gray-900">
              Your Profile
            </h1>
            <p className="mt-2 text-md text-gray-500">
              View and update your personal account information.
            </p>
          </header>

          {/* Main Form Content */}
          <div className="space-y-8">
            <form onSubmit={handleSave} className="space-y-6">
              
              {/* Profile Photo Section (Card) */}
              {/* <div className="shadow-lg sm:rounded-xl bg-white p-6 border border-gray-100">
                <h2 className="text-xl font-semibold leading-6 text-gray-900 mb-5">Profile Photo</h2>
                <div className="flex items-center space-x-5">
                  <div className="flex-shrink-0">
                    <img
                      className="h-24 w-24 rounded-full object-cover border-4 border-indigo-500/50 shadow-md"
                      src={userData.profilePicture}
                      alt="Profile"
                    />
                  </div>
                  <div className="space-y-2">
                    <button
                      type="button"
                      className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                      onClick={() => alert("Upload logic here!")}
                      disabled={!isEditing}
                    >
                      Change Photo
                    </button>
                    <p className="text-xs text-gray-500">JPG, GIF or PNG. Max size 5MB.</p>
                  </div>
                </div>
              </div> */}

              {/* Personal Information Section (Card) */}
              <div className="shadow-lg sm:rounded-xl bg-white p-6 border border-gray-100">
                <h2 className="text-xl font-semibold leading-6 text-gray-900 mb-5 border-b pb-3">Personal Details</h2>
                
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
                  <ModernInput
                    label="First Name"
                    name="firstName"
                    value={userData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  <ModernInput
                    label="Last Name"
                    name="lastName"
                    value={userData.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  <ModernInput
                    label="Email Address"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    disabled={true} // Read-only via form here
                    type="email"
                  />
                  <ModernInput
                    label="Location"
                    name="location"
                    value={userData.location}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />

                  <div className="sm:col-span-2">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                      Bio / About You
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        value={userData.bio}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`block w-full rounded-md border ${!isEditing ? 'bg-gray-50 text-gray-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} shadow-sm p-3 sm:text-sm transition-colors duration-150`}
                        placeholder="Tell us a little about your role or interests."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end pt-4 space-x-4">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                          setUserData(initialUserData); // Reset to original data
                          setIsEditing(false);
                      }}
                      className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;