import { Button, ButtonProps } from "@/components/atoms/Button"
import { Icons } from "@/lib/icons"

interface SubmitButtonProps extends ButtonProps {
  /**
   * Label of the button
   */
  label: string
  /**
   * Loading state until side effect resolve
   */
  isLoading?: boolean
}

export function SubmitButton(props: SubmitButtonProps) {
  const {
    isLoading = false,
    label,
    disabled,
    ...rest
  } = props;
  return (
    <Button disabled={isLoading || disabled} {...rest}>
      {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
      {label}
    </Button>
  )
}