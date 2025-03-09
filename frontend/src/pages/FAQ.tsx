import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "How is my data stored?",
    answer:
      "The only data collected and stored in the database are the associated accounts (steam, microsoft, etc...) that you choose to provide us to help us give you a personalized enjoyable experience if you so choose. Otherwise we don't collect any personal data.",
    value: "item-1",
  },
  {
    question: "Is this just another AI wrapper?",
    answer:
      "No, I personally create the custom models for both the personalized and general reviews to ensure highly precise and accurate quality. Currently Chat GPT APIs or similar are not being used.",
    value: "item-2",
  },
  {
    question: "What are the testimonials?",
    answer:
      "If you enjoy the application and the service provided (or not) you can give your own testimonial, new testimonials are publically shared on the landing page for transparency. Testimonials are also stored so we can review and iteratively improve the service provided.",
    value: "item-3",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="container py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Frequently Asked{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Questions
        </span>
      </h2>

      <Accordion type="single" collapsible className="w-full AccordionRoot">
        {FAQList.map(({ question, answer, value }: FAQProps) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h3 className="font-medium mt-4">
        Still have questions?{" "}
        <a
          rel="noreferrer noopener"
          href="#"
          className="text-primary transition-all border-primary hover:border-b-2"
        >
          Contact us
        </a>
      </h3>
    </section>
  );
};
