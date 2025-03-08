import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
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
import { DASHBOARD_ROUTE } from '@/constants/routes';
import Turnstile from '@/components/Turnstile';

// Define Zod schema for validation
const loginSchema = z.object({
    email: z.string().email('Please enter a valid email').min(1, 'Email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters').min(1, 'Password is required'),
});

// Infer TypeScript types from Zod schema
type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginFormComponent: React.FC = () => {
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

    const [login] = useLoginMutation();
    const [isLoginInProgress, setIsLoginInProgress] = useState(false);
    const router = useRouter();

    // Initialize react-hook-form with Shadcn Form
    const form = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    /**
     * Handle the turnstile token verification.
     * 
     * @param token - The turnstile token.
     */
    const handleTurnstileVerify = (token: string) => {
        setTurnstileToken(token);
    }

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
            // get the FCM token to send web push notifications.
            // the token will be attached to the login request at this point.
            const fcmToken = await getNotificationPermissionAndToken();
            const loginData: UserCredentials = {
                ...data,
                turnstileToken: turnstileToken ?? '',
            }
            if (fcmToken) {
                loginData.notificationToken = fcmToken;
            }
            await login(loginData).unwrap();
            setIsLoginInProgress(false);
            // Navigate to dashboard after successful login
            router.push(DASHBOARD_ROUTE);
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
                    {/* Turnstile for captcha verification */}
                    <Turnstile onVerify={handleTurnstileVerify} />
                    {/* Submit Button */}
                    <SubmitButton
                        label="Login"
                        isLoading={isLoginInProgress}
                        className="w-full mt-4"
                        disabled={!turnstileToken}
                    />
                </form>
            </Form>
        </>
    );
};

export default LoginFormComponent;