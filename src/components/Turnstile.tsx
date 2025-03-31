'use client';

import { useEffect, useRef } from 'react';

/**
 * Props interface for the Turnstile component
 * @property onVerify - Callback function that receives the verification token
 */
interface TurnstileProps {
    onVerify: (token: string) => void;
}

/**
 * Extend the Window interface to include Cloudflare's Turnstile object
 * This is needed for TypeScript to recognize the global turnstile object
 */
declare global {
    interface Window {
        turnstile: any;
    }
}

/**
 * Turnstile Component
 * Renders a Cloudflare Turnstile widget for bot protection
 * 
 * @component
 * @param {object} props - Component props
 * @param {function} props.onVerify - Callback function called when verification is complete
 */
const Turnstile: React.FC<TurnstileProps> = ({ onVerify }) => {
    // Ref to hold the container DOM element where Turnstile will be rendered
    const containerRef = useRef<HTMLDivElement>(null);
    // Ref to store the widget ID returned by Turnstile for cleanup
    const widgetIdRef = useRef<string | null>(null);

    useEffect(() => {
        // Create and load the Turnstile script dynamically
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        // Initialize Turnstile widget when the script loads
        script.onload = () => {
            if (containerRef.current && window.turnstile) {
                // Render the Turnstile widget with configuration
                widgetIdRef.current = window.turnstile.render(containerRef.current, {
                    sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
                    callback: (token: string) => {
                        onVerify(token);
                    },
                    appearance: 'always', // Always show the widget
                    'refresh-expired': 'auto', // Automatically refresh expired tokens
                    size: 'normal', // Use normal size widget
                });
            }
        };

        // Cleanup function to remove script and reset widget
        return () => {
            // Reset the Turnstile widget if it exists
            if (widgetIdRef.current && window.turnstile) {
                window.turnstile.reset(widgetIdRef.current);
            }
            // Remove the script tag from the document
            document.body.removeChild(script);
        };
    }, []);

    // Render a container div for the Turnstile widget
    return <div ref={containerRef} className="flex justify-center" />;
};

export default Turnstile; 