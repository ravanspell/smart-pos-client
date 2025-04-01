"use client";

import React, { useEffect, useState } from 'react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/atoms/Form';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FormSelectDropdown from '@/components/molecules/FormSelectDropdown';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { SubmitButton } from '@/components/molecules/SubmitButton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/atoms/Dialog';

interface Country {
    name: string;
    code: string;
}

// Base schema without File validation
const baseSchema = {
    firstName: z
        .string()
        .min(3, 'First name must be at least 3 characters')
        .max(255, 'First name must be at most 255 characters'),
    lastName: z
        .string()
        .min(3, 'Last name must be at least 3 characters')
        .max(255, 'Last name must be at most 255 characters'),
    email: z.string().email('Invalid email address'),
    gender: z.enum(['Male', 'Female', 'Other'], {
        errorMap: () => ({ message: 'Gender is required' }),
    }),
    contactNumber: z
        .string()
        .min(7, 'Contact number must be at least 7 digits')
        .max(15, 'Contact number must be at most 15 digits')
        .regex(/^\d+$/, 'Contact number must contain only digits'),
    portfolio: z
        .string()
        .url('Portfolio must be a valid URL')
        .optional()
        .or(z.literal('').transform(() => undefined)),
    address: z
        .string()
        .min(10, 'Address must be at least 10 characters')
        .max(255, 'Address must be at most 255 characters'),
    country: z.string().min(1, 'Country is required'),
};

// Function to create the full schema with File validation
const createCandidateSchema = () => z.object({
    ...baseSchema,
    resume: z.custom<File>((file) => file instanceof File, {
        message: 'Resume is required',
    }).refine((file) => file instanceof File && file.size > 0, {
        message: 'Resume is required',
    }),
});

type CandidateForm = z.infer<ReturnType<typeof createCandidateSchema>>;

const CreateCandidateModal: React.FC = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [countries, setCountries] = useState<Country[]>([]);
    const [defaultCountry, setDefaultCountry] = useState<string>('');

    // const [createCandidate, { isLoading, isSuccess, isError, error }] = useCreateCandidateMutation();

    const form = useForm<CandidateForm>({
        resolver: zodResolver(createCandidateSchema()),
        defaultValues: {
            country: '',
        },
    });

    useEffect(() => {
        // Fetch countries from an API, e.g., restcountries.com
        const fetchCountries = async () => {
            try {
                const response = await fetch(
                    'https://restcountries.com/v3.1/all?fields=name,cca2'
                );
                const countryData: Country[] = (await response.json()).map((country: any) => ({
                    name: country.name.common,
                    code: country.cca2,
                }));
                setCountries(countryData.sort((a: Country, b: Country) => a.name.localeCompare(b.name)));

                // Set default country based on user's locale or IP
                // Here we'll default to 'US' for simplicity
                setDefaultCountry('US');
                form.setValue('country', 'US');
            } catch (err) {
                console.error('Error fetching countries:', err);
            }
        };

        fetchCountries();
    }, [form]);

    const onSubmit: SubmitHandler<CandidateForm> = async (data: CandidateForm) => {
        const formData: FormData = new FormData();
        formData.append('firstName', data.firstName);
        formData.append('lastName', data.lastName);
        formData.append('email', data.email);
        formData.append('gender', data.gender);
        formData.append('contactNumber', data.contactNumber);
        if (data.portfolio) formData.append('portfolio', data.portfolio);
        formData.append('address', data.address);
        formData.append('resume', data.resume as Blob, (data.resume as File).name);
        formData.append('country', data.country);

        try {
            // await createCandidate(formData).unwrap();
            form.reset();
            setOpen(false);
            // Optionally, display success message or trigger side effects
        } catch (err: any) {
            console.error('Failed to create candidate:', err);
            // Optionally, display error message
        }
    };

    const renderFormField = <K extends keyof CandidateForm>(
        name: K,
        label: string,
        inputType: string = 'text',
        placeholder: string = '',
        additionalProps?: Partial<React.InputHTMLAttributes<HTMLInputElement>>
    ) => (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input
                            onChange={field.onChange}
                            value={field.value as string}
                            type={inputType}
                            placeholder={placeholder}
                            {...additionalProps}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );

    return (
        <>
            <Button onClick={() => setOpen(true)}>Create Candidate</Button>

            <Dialog modal open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-full md:w-2/3">
                    <DialogHeader>
                        <DialogTitle>Create Candidate</DialogTitle>
                        <DialogDescription>
                            Please fill out the form to create a new candidate.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {renderFormField('firstName', 'First Name', 'text', 'First Name')}
                            {renderFormField('lastName', 'Last Name', 'text', 'Last Name')}
                            {renderFormField('email', 'Email', 'email', 'Email')}

                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormSelectDropdown
                                        onChange={field.onChange}
                                        value={field.value}
                                        id="dropdown"
                                        label='Gender'
                                        options={[
                                            {
                                                label: 'Male',
                                                value: 'MALE',
                                            },
                                            {
                                                label: 'Female',
                                                value: 'FEMALE',
                                            }
                                        ]} />
                                )}
                            />

                            {renderFormField('contactNumber', 'Contact Number', 'text', 'Contact Number')}

                            <FormField
                                control={form.control}
                                name="portfolio"
                                render={({ field }) => (
                                    <FormItem className="relative">
                                        <FormLabel>Portfolio</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="url"
                                                placeholder="https://example.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <textarea placeholder="Address" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="resume"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Resume</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    const file = e.target.files?.[0];
                                                    field.onChange(file);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                    <FormSelectDropdown
                                        id="country-dropdown"
                                        label='Country selection'
                                        options={countries.map((country: Country) => (
                                            {
                                                label: country.name,
                                                value: country.code
                                            }
                                        ))}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <SubmitButton
                                    type='submit'
                                    onClick={() => { }}
                                    label='Save'
                                />
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CreateCandidateModal;
