import { FormControl, FormLabel, Input, FormErrorMessage, Textarea } from "@chakra-ui/react";
import { useField } from "formik";
import React from "react";

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  placeholder: string;
  type: string;
  textarea?: boolean;
};

export const InputField: React.FC<InputFieldProps> = ({label, textarea, size:_, ...props}) => {
  let Component: any = Input;
  if (textarea) {
    Component = Textarea;
  }
  
  const [field, {error}] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Component {...field} {...props} id={field.name} type={props.type} placeholder={props.placeholder} />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
}