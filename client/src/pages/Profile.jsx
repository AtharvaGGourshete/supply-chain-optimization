import React from 'react';
import { useGetProfileQuery } from '@/features/api/userApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Mail, Calendar } from 'lucide-react';

const ProfilePage = () => {
    const { data: user, error, isLoading } = useGetProfileQuery();

    if (isLoading) {
        return <ProfileSkeleton />;
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Alert variant="destructive" className="max-w-md">
                    <AlertDescription>{error.data?.message || "Failed to load profile."}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
            <Card className="w-full max-w-2xl shadow-lg rounded-2xl">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <Avatar className="w-24 h-24 border-4 border-white shadow-md">
                            <AvatarImage src={user.photoUrl} alt={user.name} />
                            <AvatarFallback className="text-3xl">
                                {user.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <CardTitle className="text-3xl font-bold text-gray-800">{user.name}</CardTitle>
                    <CardDescription className="text-md text-gray-500">Your personal account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                    <div className="flex items-center space-x-4 p-4 bg-gray-100/50 rounded-lg">
                        <Mail className="w-5 h-5 text-gray-500" />
                        <div>
                            <p className="text-sm font-medium text-gray-500">Email Address</p>
                            <p className="text-md font-semibold text-gray-800">{user.email}</p>
                        </div>
                    </div>
                     <div className="flex items-center space-x-4 p-4 bg-gray-100/50 rounded-lg">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <div>
                            <p className="text-sm font-medium text-gray-500">Member Since</p>
                            <p className="text-md font-semibold text-gray-800">
                                {new Date(user.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// Skeleton component for loading state
const ProfileSkeleton = () => (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
        <Card className="w-full max-w-2xl">
            <CardHeader className="text-center items-center flex flex-col">
                <Skeleton className="w-24 h-24 rounded-full" />
                <Skeleton className="h-8 w-48 mt-4" />
                <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
                <div className="space-y-2 p-4"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-6 w-3/4" /></div>
                <div className="space-y-2 p-4"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-6 w-3/4" /></div>
            </CardContent>
        </Card>
    </div>
);


export default ProfilePage;
