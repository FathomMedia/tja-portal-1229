import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

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
      className={`gap-4 relative border-2 flex max-sm:flex-row-reverse sm:flex-col justify-end sm:justify-between p-4 ${
        isSelected ? " border-blue-500" : ""
      }`}
      onClick={toggleSelection}
    >
      <h4 className="font-bold text-md sm:text-sm">{title}</h4>

      <div className="relative w-full max-sm:max-w-[8rem] sm:max-h-40 aspect-square">
        <Image
          alt={`Card background - ${title}`}
          className="object-cover max-sm:aspect-square rounded-md"
          src={imageUrl}
          fill
          sizes="50vw"
          priority={false}
        />
      </div>
      {isSelected && (
        <CheckCircle2 className="w-5 h-5 fill-white text-blue-500 absolute -top-2 -right-2" />
      )}
    </Card>
  );
};

export default SelectableCard;
