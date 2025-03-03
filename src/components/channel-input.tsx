"use client";

import React, { useState } from "react";
import { Check, ChevronsUpDown, Scroll } from "lucide-react";
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


const channels = [
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "X", label: "X", },
    { value: "linkedin", label: "LinkedIn" },
    { value: "snapchat", label: "Snapchat" },
    { value: "youtube", label: "YouTube" },
    { value: "pinterest", label: "Pinterest" },
    { value: "tiktok", label: "TikTok" },
    { value: "email", label: "Email" },
    { value: "content marketing", label: "Content Marketing" },
    { value: "seo", label: "SEO" },

];

export function ChannelComboxInput() {
    const [open, setOpen] = useState(false);
    const [selectedValues, setSelectedValues] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("");

    const customSelected = selectedValues.filter(
        (val) => !channels.some((f) => f.label === val)
    );

    const handleSelect = (selectedValue: string) => {
        if (selectedValue.trim() === "") return; // Prevent adding empty values
        setSelectedValues((prev) => {
            if (prev.includes(selectedValue)) {
                return prev.filter((v) => v !== selectedValue);
            } else {
                return [...prev, selectedValue];
            }
        });
        setInputValue(""); // Clear input after selection
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    <div className="text-gray-500">{selectedValues.length > 0
                        ? `${selectedValues.length} selected`
                        : "Select channels..."}</div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Search channel..."
                        value={inputValue}
                        onValueChange={setInputValue}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                const trimmedValue = inputValue.trim();
                                if (
                                    trimmedValue &&
                                    !channels.some((f) =>
                                        f.label.toLowerCase() === trimmedValue.toLowerCase()
                                    )
                                ) {
                                    handleSelect(trimmedValue);
                                    e.preventDefault(); // Prevent default Enter behavior
                                }
                            }
                        }}
                    />

                    <CommandList className="max-h-[300px] overflow-y-auto">
                        {customSelected.length > 0 && (
                            <CommandGroup heading="Selected Custom Inputs">
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
                        <CommandGroup heading="Channels">
                            {channels.map((channel) => (
                                <CommandItem
                                    key={channel.value}
                                    value={channel.label}
                                    onSelect={() => handleSelect(channel.label)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedValues.includes(channel.label)
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {channel.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        <CommandEmpty>
                            {inputValue &&
                                !channels.some((c) =>
                                    c.label.toLowerCase() === inputValue.toLowerCase()
                                ) ? (
                                `Press Enter to add "${inputValue}"`
                            ) : (
                                "No channel found."
                            )}
                        </CommandEmpty>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}