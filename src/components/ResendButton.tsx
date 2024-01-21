"use client";
import React, { FC, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type TResendButton = {
  handleClick: () => void;
  className?: string;
  defaultDisableTime?: number;
};

const ResendButton: FC<TResendButton> = ({
  handleClick,
  defaultDisableTime,
  className,
}) => {
  const t = useTranslations("Resend");

  const disableTime = defaultDisableTime ?? 40000;
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(disableTime / 1000);

  useEffect(() => {
    if (isResendDisabled) {
      const interval = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setIsResendDisabled(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isResendDisabled]);

  const handleButtonClick = () => {
    setIsResendDisabled(true);
    setTimeRemaining(disableTime / 1000);
    handleClick();
  };

  return (
    <Button
      className={cn("", className)}
      disabled={isResendDisabled}
      onClick={handleButtonClick}
      variant={"ghost"}
      size={"xs"}
      type="button"
    >
      {isResendDisabled
        ? `${t("resendIn")} ${timeRemaining}${t("seconds")}`
        : t("resend")}
    </Button>
  );
};

export default ResendButton;
