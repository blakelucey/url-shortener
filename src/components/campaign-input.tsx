"use client";

import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

// Define ongoing campaigns
const campaigns = [
    { value: "summer_sale", label: "Summer Sale" },
    { value: "black_friday", label: "Black Friday" },
    { value: "new_year_promo", label: "New Year Promo" },
    // Add your actual campaigns here
];

interface CampaignComboInputProps {
    onSelectionChange: (selectedValues: string[]) => void;
}

export function CampaignComboInput({ onSelectionChange }: CampaignComboInputProps) {
    const [open, setOpen] = useState(false);
    const [selectedValues, setSelectedValues] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("");

    // Filter custom (new) campaigns
    const customSelected = selectedValues.filter(
        (val) => !campaigns.some((c) => c.label === val)
    );

    // Handle selection/deselection
    const handleSelect = (selectedValue: string) => {
        if (selectedValue.trim() === "") return; // Prevent empty values
        setSelectedValues((prev) => {
            if (prev.includes(selectedValue)) {
                return prev.filter((v) => v !== selectedValue);
            } else {
                return [...prev, selectedValue];
            }
        });
        setInputValue(""); // Clear input
    };

    // Notify parent of selection changes
    useEffect(() => {
        if (onSelectionChange) onSelectionChange(selectedValues);
    }, [selectedValues, onSelectionChange]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    <div className="text-gray-500">
                        {selectedValues.length > 0
                            ? `${selectedValues.length} selected`
                            : "Select campaigns..."}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Search campaign..."
                        value={inputValue}
                        onValueChange={setInputValue}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                const trimmedValue = inputValue.trim();
                                if (
                                    trimmedValue &&
                                    !campaigns.some((c) =>
                                        c.label.toLowerCase() === trimmedValue.toLowerCase()
                                    )
                                ) {
                                    handleSelect(trimmedValue);
                                    e.preventDefault();
                                }
                            }
                        }}
                    />
                    <CommandList className="max-h-[300px] overflow-y-auto">
                        {customSelected.length > 0 && (
                            <CommandGroup heading="Selected New Campaigns">
                                {customSelected.map((custom) => (
                                    <CommandItem
                                        key={custom}
                                        value={custom}
                                        onSelect={() => handleSelect(custom)}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selectedValues.includes(custom)
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        {custom}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                        <CommandGroup heading="Ongoing Campaigns">
                            {campaigns.map((campaign) => (
                                <CommandItem
                                    key={campaign.value}
                                    value={campaign.label}
                                    onSelect={() => handleSelect(campaign.label)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedValues.includes(campaign.label)
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {campaign.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        <CommandEmpty>
                            {inputValue &&
                                !campaigns.some((c) =>
                                    c.label.toLowerCase() === inputValue.toLowerCase()
                                ) ? (
                                `Press Enter to add "${inputValue}"`
                            ) : (
                                "No campaign found."
                            )}
                        </CommandEmpty>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}