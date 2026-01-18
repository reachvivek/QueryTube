import { SiteHeader } from "@/components/site-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
  return (
    <div className="h-screen bg-white flex flex-col">
      <SiteHeader />

      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
        {/* Hero */}
        <div className="max-w-3xl mx-auto text-center mb-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-2">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Everything you need to know about QueryTube
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto w-full">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left text-sm sm:text-base font-medium">
                Can I cancel anytime?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                Yes. Cancel anytime with one click. No questions asked.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left text-sm sm:text-base font-medium">
                What counts as a video?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                Each unique YouTube URL counts as one video. You can ask unlimited questions per video.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left text-sm sm:text-base font-medium">
                Is there a limit on video length?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                Free plan supports videos up to 2 hours. Pro plan supports up to 10 hours per video.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left text-sm sm:text-base font-medium">
                Do you offer refunds?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                Yes. If you're not satisfied within the first 14 days, we'll refund you, no questions asked.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left text-sm sm:text-base font-medium">
                Will prices increase?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                This is early access pricing. Lock in now and your rate stays the same even if we raise prices later.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-left text-sm sm:text-base font-medium">
                How accurate are the answers?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                Every answer is grounded in the actual video transcript with exact timestamps. No hallucinations or made-up information.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger className="text-left text-sm sm:text-base font-medium">
                What languages are supported?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                Currently we support English, French, and Hindi. More languages coming soon.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger className="text-left text-sm sm:text-base font-medium">
                How long does it take to process a video?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                Most videos are processed in 2-5 minutes. Pro users get 2x faster processing speeds.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9">
              <AccordionTrigger className="text-left text-sm sm:text-base font-medium">
                Can I share my videos with others?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                Currently, videos are private to your account. Team collaboration features are coming in our Teams plan.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10">
              <AccordionTrigger className="text-left text-sm sm:text-base font-medium">
                Do you store my data?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600">
                We only store the video transcript and your questions/answers. We never store the actual video file. Your data is private and secure.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
