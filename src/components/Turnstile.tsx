import React, { useEffect } from 'react';

interface TurnstileProps {
    onVerify: (token: string) => void;
}
/**
 * Turnstile component for captcha verification.
 * @param onVerify - The callback function to handle the turnstile token verification.
 * 
 */
const Turnstile: React.FC<TurnstileProps> = ({ onVerify }) => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        script.async = true;
        script.onload = () => {
            // Initialize Turnstile
            window.turnstile.render('turnstile-container', {
                sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
                callback: onVerify,
            });
        };
        document.body.appendChild(script);
        // Cleanup the turnstile container when the component unmounts
        return () => {
            window.turnstile.remove('turnstile-container');
        };
    }, [onVerify]);

    return (
        <div
            id="turnstile-container"
            data-size="flexible"
        />
    );
};

export default Turnstile; 