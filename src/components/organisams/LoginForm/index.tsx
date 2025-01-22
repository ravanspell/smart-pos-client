import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
// import { useRouter } from 'next/router';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/atoms/Form';
import { SubmitButton } from '@/components/molecules/SubmitButton';
import { useLoginMutation, UserCredentials } from '@/redux/api/authManagementAPI';
import { Input } from '@/components/atoms/Input';
import { fetchToken } from '@/lib/firebaseClient';

// Define Zod schema for validation
const loginSchema = z.object({
    email: z.string().email('Please enter a valid email').min(1, 'Email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters').min(1, 'Password is required'),
});

// Infer TypeScript types from Zod schema
type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginFormComponent: React.FC = () => {
    const [login] = useLoginMutation();
    const [isLoginInProgress, setIsLoginInProgress] = useState(false);
    // const router = useRouter();

    // Initialize react-hook-form with Shadcn Form
    const form = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const getNotificationPermissionAndToken = async () => {
        // Step 1: Check if Notifications are supported in the browser.
        if (!("Notification" in window)) {
            console.info("This browser does not support desktop notification");
            return null;
        }
        console.log("Notification.permission--->", Notification.permission);

        // Step 2: If permission granted, generate FCM token
        if (Notification.permission === "granted") {
            return await fetchToken();
        }

        console.log("Notification permission not granted.");
        return null;
    }

    const onSubmit = async (data: LoginFormInputs) => {
        try {
            setIsLoginInProgress(true);
            const fcmToken = await getNotificationPermissionAndToken();
            console.log("fcmToken--->", fcmToken);
            const loginData: UserCredentials = {
                ...data,
            }
            if (fcmToken) {
                loginData.notificationToken = fcmToken;
            }
            await login(loginData).unwrap();
            setIsLoginInProgress(false);
            // Navigate to /dashboard after successful login
            // router.push('/dashboard');
        } catch (error) {
            setIsLoginInProgress(false);
            console.error('Login error:', error);
        }
    };

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    {/* Email Field */}
                    <FormField
                        name="email"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    {/* Password Field */}
                    <FormField
                        name="password"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Enter your password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    {/* Submit Button */}
                    <SubmitButton
                        label="Login"
                        isLoading={isLoginInProgress}
                        className="w-full mt-4" />
                </form>
            </Form>
        </>
    );
};

export default LoginFormComponent;