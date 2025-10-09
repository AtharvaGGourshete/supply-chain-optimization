// path: frontend/src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/features/api/userApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Calendar, Edit3, Save, X } from 'lucide-react';

// A simple, lightweight spinner component
const Spinner = () => (
    <svg
        className="animate-spin h-5 w-5 text-current"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
        />
        <path
            className="opacity-75"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            fill="currentColor"
        />
    </svg>
);


const ProfilePage = () => {
    const { data: user, error, isLoading } = useGetProfileQuery();
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({ name: '', photoUrl: '' });

    useEffect(() => {
        if (user) {
            setFormData({ name: user.name, photoUrl: user.photoUrl || '' });
        }
    }, [user]);

    if (isLoading) {
        return <ProfileSkeleton />;
    }

    if (error) {
        return (
            <main className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
                <Alert variant="destructive" className="max-w-lg w-full">
                    <AlertDescription>{error.data?.message || "Failed to load profile."}</AlertDescription>
                </Alert>
            </main>
        );
    }

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSave = async () => {
        try {
            await updateProfile(formData).unwrap();
            toast.success("Profile updated successfully!");
            setIsEditMode(false);
        } catch (err) {
            toast.error(err.data?.message || "Failed to update profile.");
        }
    };

    const ProfileDetail = ({ icon, label, value }) => (
        <div className="flex items-start space-x-4 p-4 bg-slate-50/70 rounded-xl border border-slate-200/80">
            {icon}
            <div className="flex flex-col">
                <p className="text-sm font-semibold text-slate-600">{label}</p>
                <p className="text-md font-medium text-slate-900 select-text">{value}</p>
            </div>
        </div>
    );

    return (
        <main className="flex justify-center items-center min-h-screen bg-slate-50 p-4 sm:p-6">
            <Card className="w-full max-w-lg rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
                <CardHeader className="text-center relative bg-white pt-8 pb-6 px-8">
                    {/* --- Edit/Save Buttons --- */}
                    <div className="absolute top-6 right-6">
                        {isEditMode ? (
                            <div className="flex space-x-2">
                                <Button size="icon" variant="outline" onClick={handleSave} disabled={isUpdating} aria-label="Save Profile" className="w-20 cursor-pointer">
                                    {/* Conditionally render spinner or save icon */}
                                    {isUpdating ? <Spinner /> :<><p>Save</p><Save className="w-5 h-5 text-black" /></> }
                                </Button>
                                <Button size="icon" variant="ghost" onClick={() => setIsEditMode(false)} aria-label="Cancel Edit" disabled={isUpdating}>
                                    <X className="w-5 h-5 text-slate-500 hover:text-slate-800 transition-colors" />
                                </Button>
                            </div>
                        ) : (
                            <Button size="icon" variant="outline" onClick={() => setIsEditMode(true)} aria-label="Edit Profile">
                                <Edit3 className="w-5 h-5 text-slate-600 hover:text-indigo-600 transition-colors" />
                            </Button>
                        )}
                    </div>

                    {/* --- Avatar --- */}
                    <Avatar 
                      className="w-28 h-28 mx-auto mb-4 rounded-full border-4 border-white shadow-lg" 
                      aria-label="User profile photo">
                        <AvatarImage src={formData.photoUrl || user.photoUrl} alt={`${user.name}'s profile picture`} />
                        <AvatarFallback className="text-4xl font-semibold bg-indigo-100 text-indigo-600">
                            {user.name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    {/* --- User Name (View/Edit) --- */}
                    {isEditMode ? (
                         <Input 
                            id="name" 
                            value={formData.name} 
                            onChange={handleInputChange} 
                            className="text-3xl font-bold text-center h-auto p-1 bg-transparent border-slate-300 focus-visible:ring-indigo-500" 
                            aria-label="Edit name"
                         />
                    ) : (
                        <CardTitle className="text-3xl font-bold text-slate-900 tracking-tight">{user.name}</CardTitle>
                    )}
                    <CardDescription className="text-base text-slate-500 mt-1.5">
                        {isEditMode ? 'Update your personal details below' : 'Personal Account'}
                    </CardDescription>
                </CardHeader>
                
                {/* --- Main Content --- */}
                <CardContent className="space-y-4 bg-slate-50/50 p-6 sm:p-8">
                    {isEditMode && (
                        <div className="space-y-2 pb-2">
                            <Label htmlFor="photoUrl" className="text-sm font-semibold text-slate-700">Photo URL</Label>
                            <Input 
                              id="photoUrl" 
                              value={formData.photoUrl} 
                              onChange={handleInputChange} 
                              placeholder="https://example.com/profile.png" 
                              className="shadow-sm focus-visible:ring-indigo-500"
                              aria-label="Edit photo URL"
                            />
                        </div>
                    )}
                    <ProfileDetail 
                      icon={<Mail className="w-6 h-6 text-indigo-500 mt-1" />} 
                      label="Email Address" 
                      value={user.email} 
                    />
                    <ProfileDetail 
                      icon={<Calendar className="w-6 h-6 text-indigo-500 mt-1" />} 
                      label="Member Since" 
                      value={new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} 
                    />
                </CardContent>
            </Card>
        </main>
    );
};

// Skeleton component with modernized styling
const ProfileSkeleton = () => (
    <main className="flex justify-center items-center min-h-screen bg-slate-50 p-4 sm:p-6">
        <Card className="w-full max-w-lg rounded-2xl shadow-lg border border-slate-200/60 animate-pulse">
            <CardHeader className="flex flex-col items-center space-y-4 py-8 px-8">
                <Skeleton className="w-28 h-28 rounded-full bg-slate-200" />
                <Skeleton className="w-48 h-8 mt-2 rounded-md bg-slate-200" />
                <Skeleton className="w-64 h-5 rounded-md bg-slate-200" />
            </CardHeader>
            <CardContent className="space-y-4 p-6 sm:p-8">
                <Skeleton className="w-full h-20 rounded-xl bg-slate-200" />
                <Skeleton className="w-full h-20 rounded-xl bg-slate-200" />
            </CardContent>
        </Card>
    </main>
);

export default ProfilePage;
