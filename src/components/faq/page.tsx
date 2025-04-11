import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import faqData from '../../../faq.json'
import { Button } from "../ui/button"
import { MoreQuestions } from "../more-questions-hover"

export default function FAQ() {
    return (
        <div className="p-4 m-4 justify-center items-center">
            <div className="flex flex-col items-center justify-center">
            <div className="text-center">
                <h1 className="font-bold tracking-tight lg:text-5xl my-8">
                    FAQ
                </h1>
            </div>
            {faqData.map((item: any, index: number) => (
                <Accordion key={index} type="single" collapsible className="w-full max-w-lg">
                    <AccordionItem value="item-1">
                        <AccordionTrigger style={{ cursor: "pointer" }}>{item.question}</AccordionTrigger>
                        <AccordionContent>
                            {item.answer}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            ))}
            <div className="mt-20">
                <h3>
                    <MoreQuestions />
                </h3>
            </div>
            </div>
        </div>
    )
}
