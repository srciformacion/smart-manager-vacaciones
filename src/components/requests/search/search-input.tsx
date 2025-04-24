
import React from "react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = "Buscar..." }: SearchInputProps) {
  return (
    <div className="relative">
      <img 
        src="/lovable-uploads/430ee6e3-abee-48b3-ad9b-9aec46685e6e.png" 
        alt="Search" 
        width={20} 
        height={20} 
        className="absolute left-2 top-2.5 text-sidebar-foreground/70" 
      />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8 w-full md:w-auto"
      />
    </div>
  );
}
