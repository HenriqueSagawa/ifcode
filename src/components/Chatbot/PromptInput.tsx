'use client';

import { useRef, useEffect, useState } from "react";
import { PaperclipIcon, ArrowUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IoSparklesOutline } from "react-icons/io5";

export function PromptInput() {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [inputValue, setInputValue] = useState<string>("");
    const maxHeight = 144;

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
        }
    };

    const handleInput = () => {
        adjustHeight();
        setInputValue(textareaRef.current?.value || "");
    };

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "1.5em";
        }
    }, []);

    return (
        <div className="mx-auto p-2 sm:p-4 max-w-3xl w-[95%] sm:w-[90%] md:w-full border border-gray-500 rounded-xl bg-black">
            <div className="w-full">
                <textarea
                    ref={textareaRef}
                    placeholder="Pergunte-me algo..."
                    onInput={handleInput}
                    rows={1}
                    className="w-full resize-none text-gray-400 text-sm border-none bg-transparent outline-none overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 !scrollbar-track-transparent"
                    style={{
                        minHeight: "1.5em",
                        maxHeight: `${maxHeight}px`,
                        lineHeight: "1.5",
                    }}
                />
            </div>
            <div className="flex items-center justify-between mt-2">
                <Button variant="ghost" className="rounded-full h-7 w-7 sm:h-8 sm:w-8 p-0">
                    <PaperclipIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <div className="flex items-center">
                    <Button variant="ghost" className="rounded-full h-7 w-7 sm:h-8 sm:w-8 p-0">
                        <IoSparklesOutline className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button className="rounded-full h-7 w-7 sm:h-8 sm:w-8 p-0 ml-2">
                        <ArrowUpIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}