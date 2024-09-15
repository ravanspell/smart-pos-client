"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/atoms/Button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/atoms/Command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/atoms/PopOver"
import { ChevronsUpDown, CheckIcon } from "lucide-react"

interface ComboBoxProps {
  label: string;
  helperText?: string;
  status?: 'error' | 'success' | 'default';
  frameworks: { value: string; label: string }[];
  searchEnabled?: boolean;
}

export function ComboBox({
  label,
  helperText,
  status = 'default',
  frameworks,
  searchEnabled = true,
}: ComboBoxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  const getBorderColor = () => {
    switch (status) {
      case 'error':
        return 'border-red-500 focus:ring-red-500';
      case 'success':
        return 'border-green-500 focus:ring-green-500';
      default:
        return 'border-gray-300 focus:ring-blue-500';
    }
  };

  const getHelperTextColor = () => {
    switch (status) {
      case 'error':
        return 'text-red-500';
      case 'success':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="flex flex-col mb-4">
      {/* Label */}
      <label htmlFor="framework-combobox" className="text-sm font-medium mb-1">
        {label}
      </label>
      
      {/* ComboBox */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`w-[200px] justify-between ${getBorderColor()} mt-2`}
          >
            {value
              ? frameworks.find((framework) => framework.value === value)?.label
              : "Select framework..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            {/* Optional search input */}
            {searchEnabled && (
              <CommandInput placeholder="Search framework..." className="h-9" />
            )}
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {frameworks.map((framework) => (
                  <CommandItem
                    key={framework.value}
                    value={framework.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    {framework.label}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === framework.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Helper Text */}
      {helperText && (
        <p className={`mt-1 text-sm ${getHelperTextColor()}`}>
          {helperText}
        </p>
      )}
    </div>
  )
}