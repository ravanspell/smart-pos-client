// components/Accordion.tsx
import React, { FC, ReactNode, useState } from "react";
import { Accordion as ShadcnAccordion, AccordionItem, AccordionContent, AccordionTrigger } from "@/components/atoms/Accordion";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
    id: string;
    title: ReactNode;
    content: ReactNode;
    prefix?: ReactNode;
    suffix?: ReactNode;
}

interface AccordionProps {
    items: AccordionItemProps[];
}

const Accordion: FC<AccordionProps> = ({ items }) => {
    // State to keep track of the expanded accordion item
    const [expandedItem, setExpandedItem] = useState<string | null>(null);

    const handleToggle = (value: string) => {
        setExpandedItem((prev) => (prev === value ? null : value)); // Toggle the same item to collapse
    };
    return (
        <ShadcnAccordion type="single" collapsible>
            {items.map((item, index) => (
                <AccordionItem key={index} value={item.id}
                    className={cn(
                        "border-l border-r border-border",
                        "overflow-hidden",
                        index === 0 ? "rounded-t-lg border-t" : "", // Top corners rounded for the header
                        (index === items.length - 1) ? "rounded-b-lg" : "", // Bottom corners rounded for the header
                    )}
                >
                    <AccordionTrigger className={cn(
                        "p-4 ",
                        expandedItem === item.id ? "border-b" : ""
                    )}
                        onClick={() => handleToggle(item.id)}
                    >
                        <div className="flex items-center space-x-2">
                            {item.prefix && <span>{item.prefix}</span>}
                            <div className="text-card-foreground">{item.title}</div>
                            {item.suffix && <span>{item.suffix}</span>}
                        </div>
                    </AccordionTrigger>
                    <AccordionContent
                        className={cn(
                            "p-4 bg-card",
                            "border-none outline-none",
                        )}
                    >
                        {item.content}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </ShadcnAccordion>
    );
};

export default Accordion;