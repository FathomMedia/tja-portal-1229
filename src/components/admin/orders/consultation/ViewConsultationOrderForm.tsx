"use client";

import React, { FC } from "react";

import { Input } from "@/components/ui/input";
import { useLocale, useTranslations } from "next-intl";
import { TConsultationBooking } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  accommodationTypes,
  adventureToYouIs,
} from "@/components/consultations/consultation-constants";

type TConsultationBookingForm = {
  consultationBooking: TConsultationBooking;
};

export const ViewConsultationOrderForm: FC<TConsultationBookingForm> = ({
  consultationBooking,
}) => {
  const locale = useLocale();
  const t = useTranslations("Consultation");

  return (
    <div className=" flex flex-col gap-12 @container bg-primary-foreground p-4 rounded-sm">
      {/* Checkout Details */}
      <div className="">
        <h2 className="text-lg text-primary font-semibold border-s-4 border-primary ps-2 mb-4">
          {t("customerDetails")}
        </h2>
        <div className=" grid grid-cols-1 @lg:grid-cols-2 gap-8">
          <div>
            <Label>{t("name")}</Label>
            <Input disabled value={consultationBooking.customer.name ?? ""} />
          </div>
          <div>
            <Label>{t("email")}</Label>
            <Input disabled value={consultationBooking.customer.email ?? ""} />
          </div>
          <div>
            <Label>{t("phone")}</Label>
            <Input disabled value={consultationBooking.customer.phone ?? ""} />
          </div>
        </div>
      </div>

      {/* Consultation Details */}
      <div>
        <h2 className="text-lg text-primary font-semibold border-s-4 border-primary ps-2 my-4">
          {t("packageDetails")}
        </h2>
        <div className=" grid grid-cols-1 @lg:grid-cols-2 gap-8">
          <div>
            <Label>{t("package")}</Label>
            <Input
              disabled
              value={consultationBooking.consultation.tier.toUpperCase() ?? ""}
            />
          </div>
          <div>
            <Label>{t("numberOfDays")}</Label>
            <Input
              disabled
              value={consultationBooking.consultation.numberOfDays ?? ""}
            />
          </div>
          <div>
            <Label>{t("price")}</Label>
            <Input
              disabled
              value={consultationBooking.consultation.priceWithCurrency ?? ""}
            />
          </div>
        </div>
      </div>

      {/* Form Details */}
      <div>
        <h2 className="text-lg text-primary font-semibold border-s-4 border-primary ps-2 my-4">
          {t("formDetails")}
        </h2>
        <div className=" flex flex-col gap-8">
          <div className="grid grid-cols-1 @lg:grid-cols-2 gap-8">
            <div>
              <Label>{t("startDate")}</Label>
              <Input disabled value={consultationBooking.startDate ?? ""} />
            </div>
            <div>
              <Label>{t("endDate")}</Label>
              <Input disabled value={consultationBooking.endDate ?? ""} />
            </div>
            <div>
              <Label>{t("dateBooked")}</Label>
              <Input disabled value={consultationBooking.dateBooked ?? ""} />
            </div>
          </div>
          {/* <div>
            <Label>Invoice</Label>
            <Input disabled value={consultationBooking.invoice ?? ""} />
          </div> */}
          <div>
            <Label>{t("travelClass")}</Label>
            <Input disabled value={consultationBooking.class ?? ""} />
          </div>
          <div>
            <Label>{t("whichAirport")}</Label>
            <Input
              disabled
              value={consultationBooking.departureAirport ?? ""}
            />
          </div>
          <div>
            <Label>{t("plusOne")}</Label>
            <Input
              type="number"
              disabled
              value={consultationBooking.numberOfTravelers ?? ""}
            />
          </div>
          <div>
            <Label>{t("budgetAmount")}</Label>
            <Input disabled value={consultationBooking.budget ?? ""} />
          </div>
          <div>
            <Label>{t("budgetPriority")}</Label>

            <div className="flex flex-col gap-2 p-3 rounded-md text-sm text-black  bg-background border opacity-50">
              <p>{t(consultationBooking.budgetPriority)}</p>
            </div>
          </div>
          <div>
            <Label> {t("budgetToInclude")}</Label>
            <Input disabled value={consultationBooking.invoice ?? "N/A"} />
          </div>
          <div>
            <Label>{t("vacationType")}</Label>
            {/* <Input disabled value={consultationBooking.vacationType ?? ""} /> */}
            <div className="flex flex-col gap-2 p-3 rounded-md text-sm text-black  bg-background border opacity-50">
              <p>{t(consultationBooking.vacationType)}</p>
            </div>
          </div>
          <div>
            <Label>{t("whichTypeOfAccomidation")}</Label>
            <Input
              disabled
              value={consultationBooking.accommodationType ?? ""}
            />
          </div>
          <div>
            <Label>{t("ToyouAdventureIs")}</Label>
            <div className="flex flex-col gap-2 p-3 rounded-md text-sm text-black  bg-background border opacity-50">
              {consultationBooking.adventureMeaning.map((id, i) => (
                <p key={i}>
                  {t(adventureToYouIs.find((f) => f.id === id)?.label)}
                </p>
              ))}
            </div>
          </div>
          <div>
            <Label>{t("whichTypeOfActivities")}</Label>
            <Input disabled value={consultationBooking.activities ?? ""} />
          </div>
          <div>
            <Label>
              {
                "If you had to wake up at 5 am to chase a program/activity, which one would you wake up that early for?"
              }
            </Label>
            {/* <Input disabled value={consultationBooking.morningActivity ?? ""} /> */}
            <div className="flex flex-col gap-2 p-3 rounded-md text-sm text-black  bg-background border opacity-50">
              <p>{t(consultationBooking.morningActivity)}</p>
            </div>
          </div>
          <div>
            <Label>{t("whatIsTheBestTravelExperience")}</Label>
            <Input
              disabled
              value={consultationBooking.bestTravelExperience ?? "N/A"}
            />
          </div>
          <div>
            <Label> {t("doYouHaveFears")}</Label>
            <Input disabled value={consultationBooking.phobias ?? "N/A"} />
          </div>
          <div>
            <Label>{t("coupon")}</Label>
            <Input disabled value={consultationBooking.coupon?.code ?? "N/A"} />
          </div>
        </div>
      </div>
    </div>
  );
};
