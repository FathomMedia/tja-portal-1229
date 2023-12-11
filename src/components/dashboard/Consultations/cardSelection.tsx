import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";

interface SelectableCardProps {
  title: string;
  imageUrl: string;
}

const SelectableCard: React.FC<SelectableCardProps> = ({ title, imageUrl }) => {
  const [isSelected, setIsSelected] = useState(false);

  const toggleSelection = () => {
    setIsSelected(!isSelected);
  };

  return (
    <Card
      className={`py-4 ${isSelected ? "border-2 border-blue-500" : ""}`}
      onClick={toggleSelection}
    >
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <h4 className="font-bold text-large">{title}</h4>
      </CardHeader>
      <CardContent className="overflow-visible py-2">
        <Image
          alt={`Card background - ${title}`}
          className="object-fill rounded-xl"
          src={imageUrl}
          width={200}
          height={200}
        />
      </CardContent>
    </Card>
  );
};

export default SelectableCard;
