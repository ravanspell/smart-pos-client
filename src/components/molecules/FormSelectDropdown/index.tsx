'use client';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem
} from '@/components/atoms/Select';

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
  name: string;
}

const FormSelectDropdown: React.FC<FormSelectDropdownProps> = ({
  label,
  placeholder = '',
  options,
  value,
  onChange,
  className = '',
  name,
}) => {
  return (
    <Select name={name} onValueChange={onChange} value={value}>
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
  );
};

export default FormSelectDropdown;
