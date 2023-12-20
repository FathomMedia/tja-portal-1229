// ContactIcons.js

import { useTranslations } from "next-intl";
import React from "react";

const ContactIcons = () => {
  const t = useTranslations("Help");

  return (
    <div>
      <h2>{t("ourTeamIsAwlaysHappyToHelp")}</h2>
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center">
          <img
            src="/assets/svg/phone-call.svg"
            alt="Phone Icon"
            className="icon"
          />
          <a href="tel:+97338377700" className="text-blue-500 ml-2">
            +973 3837 7700
          </a>
        </div>
        <div className="flex items-center">
          <img
            src="/assets/svg/email (2).svg"
            alt="Email Icon"
            className="icon"
          />
          <a
            href="mailto:travel@thejourneyadventures.com"
            className="text-blue-500 ml-2"
          >
            travel@thejourneyadventures.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactIcons;
