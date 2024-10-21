// components/atoms/CustomSelect.tsx
import React from 'react';
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectGroup, 
  SelectLabel, 
  SelectItem 
} from '@/components/atoms/Select';
import { 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage, 
  FormDescription 
} from '@/components/atoms/Form';

export interface FormSelectDropdownOption {
  label: string;
  value: string;
}

export interface FormSelectDropdownProps {
  label: string;
  description?: React.ReactNode;
  placeholder?: string;
  options: FormSelectDropdownOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  id: string;
}

const FormSelectDropdown: React.FC<FormSelectDropdownProps> = ({
  label,
  description,
  placeholder = '',
  options,
  value,
  onChange,
  className = '',
  id,
}) => {
  return (
    <FormItem id={id}>
      <FormLabel>{label}</FormLabel>
      {description && <FormDescription>{description}</FormDescription>}
      <FormControl>
        <Select onValueChange={onChange} value={value}>
          <SelectTrigger className={className}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{label}</SelectLabel>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default FormSelectDropdown;
