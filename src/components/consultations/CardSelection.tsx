import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";

interface SelectableCardProps {
  title: string;
  imageUrl: string;
  onSelect: (isSelected: boolean) => void;
}

const SelectableCard: React.FC<SelectableCardProps> = ({
  title,
  imageUrl,
  onSelect,
}) => {
  const [isSelected, setIsSelected] = useState(false);

  const toggleSelection = () => {
    const toBe = !isSelected;
    onSelect(toBe);
    setIsSelected(toBe);
  };

  return (
    <Card
      className={`py-4 flex flex-col justify-between ${
        isSelected ? "border-2 border-blue-500" : ""
      }`}
      onClick={toggleSelection}
    >
      <CardHeader className="flex-col items-start">
        <h4 className="font-bold text-md sm:text-sm">{title}</h4>
      </CardHeader>
      <CardContent className="overflow-hidden py-2">
        <div className="relative w-full aspect-square">
          <Image
            alt={`Card background - ${title}`}
            className="object-cover"
            src={imageUrl}
            fill
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SelectableCard;
