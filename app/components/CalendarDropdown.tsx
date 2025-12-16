"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";

interface CalendarDropdownProps {
    onChange: (date: Date) => void;
}

export default function CalendarDropdown({ onChange }: CalendarDropdownProps) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<Date>(new Date());

    const handleSelect = (date?: Date) => {
        if (!date) return;
        setSelected(date);
        onChange(date);
        setOpen(false);
    };

    return (
        <div className="relative">
            {/* Button */}
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                </svg>

                {format(selected, "dd MMM yyyy")}
            </button>

            {/* Calendar */}
            {open && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3">
                    <DayPicker
                        mode="single"
                        selected={selected}
                        onSelect={handleSelect}
                        disabled={{ after: new Date() }}
                    />
                </div>
            )}
        </div>
    );
}
