import React from "react";
import { cn } from "@/lib/utils";
import PhoneInput, {
  DefaultInputComponentProps,
  Props,
  Value,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";

export interface PhoneProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value: Value;
  onChange(value?: Value | React.ChangeEvent<HTMLInputElement>): void;
}

const PhoneNumberInput = React.forwardRef<
  Props<DefaultInputComponentProps>,
  PhoneProps
>(({ className, type, ...props }) => {
  const css = `.phoneNumber input {
      background: transparent;
      height: 2.5rem;
      border-radius: 0rem 2rem 2rem 0rem;
      padding: 0rem 0.5rem;
        }
        `;
  return (
    <>
      <style>{css}</style>
      <PhoneInput
        international
        defaultCountry="BH"
        {...props}
        className={cn(
          "phoneNumber border-primary flex h-10 w-full rounded-full border pl-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        type="phone"
      />
    </>
  );
});
PhoneNumberInput.displayName = "PhoneNumberInput";

export { PhoneNumberInput };
