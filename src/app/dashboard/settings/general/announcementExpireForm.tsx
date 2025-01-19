'use client'
import React from 'react';
import { z } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/atoms/Form';
import { Input } from '@/components/ui/input';
import { SubmitButton } from '@/components/molecules/SubmitButton';

const schema = z.object({
    expireDays: z.number().min(1, 'Expire days must be at least 1').max(3650, 'Maximum 3650 days allowed'),
});

type AnnouncementExpireFormValues = z.infer<typeof schema>;

export const AnnouncementExpireForm: React.FC = () => {
    const form = useForm<AnnouncementExpireFormValues>({
        resolver: zodResolver(schema),
        defaultValues: { expireDays: 365 },
    });

    const onSubmit: SubmitHandler<AnnouncementExpireFormValues> = (values) => {
        console.log('Announcement Expire Days:', values);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    name="expireDays"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Default Expire Days</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <SubmitButton
                    label='Save Changes'
                    type="submit"
                />
            </form>
        </Form>
    );
};