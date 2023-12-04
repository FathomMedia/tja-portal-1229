"use client";

import {
  OrderType,
  TAdventure,
  TConsultation,
  TOrder,
  TUser,
} from "@/lib/types";
import React, { FC } from "react";
import { DashboardSection } from "../DashboardSection";
import { useTranslations } from "next-intl";
import Image from "next/image";

type TDashboardHome = {
  user: TUser;
  latestOrders: TOrder[];
};

export const DashboardHome: FC<TDashboardHome> = ({ user, latestOrders }) => {
  const t = useTranslations("Home");
  return (
    <DashboardSection title={"My Account"}>
      <div className=" flex flex-col gap-4">
        <div className="flex gap-3">
          <div className="flex border-b divide-x">
            {/* Current Tier */}
            <div className=" flex p-4 flex-col">
              <p className="text-sm text-muted-foreground">Current Tier</p>
              <h2 className="text-2xl text-primary font-semibold">
                {user?.level.name}
              </h2>
            </div>
            {/* Days Travelled */}
            <div className=" flex p-4 flex-col">
              <p className="text-sm text-muted-foreground">Days Travelled</p>
              <h2 className="text-2xl text-primary font-semibold">{`${user?.daysTravelled} Days`}</h2>
            </div>
          </div>
          {/* Badge */}
          <div></div>
        </div>
        <div className="p-6 flex flex-col gap-4">
          {/* Up coming adventures */}
          <div className="bg-muted flex p-3 rounded-lg">
            <h1>{t("upComingAdventures")}</h1>
          </div>
          {/* Up coming adventures */}
          <div className="bg-muted flex p-3 rounded-lg">
            <h1>{t("latestsOrders")}</h1>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {latestOrders.map((order, i) => {
              const adventure: TAdventure = order.details as TAdventure;
              const consultation: TConsultation =
                order.details as TConsultation;
              return (
                <div
                  className="min-h-[10rem] rounded-md  overflow-clip"
                  key={i}
                >
                  {order.type === "adventure" && <Adventure order={order} />}
                  {order.type === "consultation" && (
                    <Consultation order={order} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div></div>
    </DashboardSection>
  );
};

const Consultation = ({ order }: { order: TOrder }) => {
  const consultation = order.details as TConsultation;
  return (
    <div className="relative flex flex-col md:flex-row md:space-x-5 space-y-3 md:space-y-0 rounded-xl shadow-lg p-3  mx-auto border border-white bg-white">
      <div className="w-full md:w-1/3 aspect-video bg-white relative grid place-items-center">
        <Image
          width={200}
          height={100}
          src="/assets/images/consultation.jpg"
          alt="tailwind logo"
          className="rounded-xl w-full h-full object-cover"
        />
      </div>
      <div className="w-full md:w-2/3 bg-white flex flex-col justify-between space-y-2 p-3">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between item-center">
            <p className="text-gray-500 font-medium hidden md:block">
              Consultation
            </p>
            <div className="flex flex-wrap md:flex-row gap-2">
              <div className="bg-gray-200  px-3 py-1 rounded-full text-xs font-medium text-gray-800 flex gap-1">
                Tier:
                <p>{consultation.tier}</p>
              </div>
              <div className="bg-gray-200  px-3 py-1 rounded-full text-xs font-medium text-gray-800 flex gap-1">
                Days:
                <p>{consultation.numberOfDays}</p>
              </div>
            </div>
          </div>
          <div className="text-xs font-medium text-foreground flex gap-1">
            Booked At:
            <p>{order.dateBooked}</p>
          </div>
        </div>
        <p className="text-xl font-black text-gray-800 ">
          {consultation.price}
          <span className="font-normal text-gray-600 text-base"> BHD</span>
        </p>
      </div>
    </div>
  );
};
const Adventure = ({ order }: { order: TOrder }) => {
  const adventure = order.details as TAdventure;
  return (
    <div className="relative flex flex-col md:flex-row md:space-x-5 space-y-3 md:space-y-0 rounded-xl shadow-lg p-3  mx-auto border border-white bg-white">
      <div className="w-full md:w-1/3 aspect-video md:aspect-square bg-white relative grid place-items-center">
        <Image
          width={200}
          height={200}
          src="/assets/images/adventure.jpg"
          alt="tailwind logo"
          className="rounded-xl w-full h-full object-cover"
        />
      </div>
      <div className="w-full md:w-2/3 bg-white flex flex-col justify-between space-y-2 p-3">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between item-center">
            <p className="text-gray-500 font-medium hidden md:block">
              Adventure
            </p>
            <div className="flex flex-wrap md:flex-row gap-2">
              <div className="bg-gray-200  px-3 py-1 rounded-full text-xs font-medium text-gray-800 flex gap-1">
                Start:
                <p>{adventure.startDate}</p>
              </div>
              <div className="bg-gray-200  px-3 py-1 rounded-full text-xs font-medium text-gray-800 flex gap-1">
                End:
                <p>{adventure.endDate}</p>
              </div>
            </div>
          </div>
          <h3 className="font-black text-gray-800 md:text-3xl text-xl">
            {adventure.title}
          </h3>
          <div className="text-xs font-medium text-foreground flex gap-1">
            Booked At:
            <p>{order.dateBooked}</p>
          </div>
          <p className="md:text-lg text-gray-500 text-base">
            {adventure.description}
          </p>
        </div>
        <p className="text-xl font-black text-gray-800 ">
          {adventure.price}
          <span className="font-normal text-gray-600 text-base"> BHD</span>
        </p>
      </div>
    </div>
  );
};
