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
      className={`gap-4 flex flex-col justify-between p-4 ${
        isSelected ? "border-2 border-blue-500" : ""
      }`}
      onClick={toggleSelection}
    >
      <h4 className="font-bold text-md sm:text-sm">{title}</h4>

      <div className="relative w-full max-h-40 aspect-square">
        <Image
          alt={`Card background - ${title}`}
          className="object-cover rounded-md"
          src={imageUrl}
          fill
          sizes="50vw"
          priority={false}
        />
      </div>
    </Card>
  );
};

export default SelectableCard;
