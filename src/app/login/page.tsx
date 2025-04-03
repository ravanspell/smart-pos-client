'use client';

import Link from 'next/link';
import LoginForm from "@/components/organisms/LoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card';


const LoginPage: React.FC = () => {
    return (
        <div className="bg-gray-100 flex flex-col items-center justify-center min-h-screen p-2 sm:p-4">
            {/* -- Logo outside of the login box -- */}
            <div className="mb-4">
                <svg className="h-12 w-12 sm:h-16 sm:w-16 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm0 21.6c-5.3 0-9.6-4.3-9.6-9.6S6.7 2.4 12 2.4 21.6 6.7 21.6 12s-4.3 9.6-9.6 9.6z" />
                </svg>
            </div>

            {/* -- Login Card -- */}
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Sign In</CardTitle>
                    <CardDescription className="text-center">
                        Please login to access the dashboard.
                    </CardDescription>
                </CardHeader>
                <CardContent className="w-full">
                    <LoginForm />
                    {/* Forgot Password Link */}
                    <div className="text-center text-sm mt-4">
                        <Link
                            className="hover:underline cursor-pointer"
                            href={{ pathname: '/password-reset' }}
                        >
                            Forgot password?
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;
