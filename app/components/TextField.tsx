import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  InputProps,
} from "@mui/joy";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { forwardRef } from "react";

export interface TextFieldProps extends InputProps {
  label?: string;
  helperText?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, helperText, ...props }, ref) => {
    return (
      <FormControl id={props.id} error={props.error} className="w-full">
        <FormLabel>{label}</FormLabel>
        <Input ref={ref} size="lg" {...props} />
        <FormHelperText>
          {props.error && (
            <InformationCircleIcon width={16} className="text-red" />
          )}
          {helperText}
        </FormHelperText>
      </FormControl>
    );
  }
);

TextField.displayName = "TextField";
