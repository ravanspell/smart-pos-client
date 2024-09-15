/**
 *  --- Accordion component ---
 *  the warapper component of shadcn accirdon related components
 */
import React, { FC, ReactNode, useState } from "react";
import { Accordion as ShadcnAccordion, AccordionItem, AccordionContent, AccordionTrigger } from "@/components/atoms/Accordion";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
    /**
     * A unique identifier for the accordion item.
     * This `id` is used to track the expanded/collapsed state and must be unique for each item.
     */
    id: string;
    /**
     * The title or header of the accordion item.
     */
    title: ReactNode;
    /**
     * The content displayed when the accordion item is expanded.
     * This can include any valid React elements, such as text, HTML, or even components.
     */
    content: ReactNode;
    /**
     * An optional element to display before the title in the accordion header.
     */
    prefix?: ReactNode;
    /**
     * An optional element to display after the title in the accordion header.
     */
    suffix?: ReactNode;
}


interface AccordionProps {
    /**
     * The id of the accordion component, as a unique identifier of the component
     */
    id: string;
    /**
     * Accordion items data.
     */
    items: AccordionItemProps[];
}

const AccordionCmp: FC<AccordionProps> = ({ items, id }) => {
    // State to keep track of the expanded accordion item
    const [expandedItem, setExpandedItem] = useState<string | null>(null);

    const handleToggle = (value: string) => {
        setExpandedItem((prev) => (prev === value ? null : value)); // Toggle the same item to collapse
    };
    return (
        <ShadcnAccordion id={id} type="single" collapsible>
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
                        "p-4",
                        expandedItem === item.id ? "border-b" : "" // add header bottom border when accordion expand
                    )}
                        onClick={() => handleToggle(item.id)}
                    >
                        <div className="flex items-center space-x-2">
                            {item.prefix && <span>{item.prefix}</span>}
                            <div className="text-card-foreground">{item.title}</div>
                            {item.suffix && <span>{item.suffix}</span>}
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-0 bg-card">
                        {item.content}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </ShadcnAccordion>
    );
};

export default AccordionCmp;