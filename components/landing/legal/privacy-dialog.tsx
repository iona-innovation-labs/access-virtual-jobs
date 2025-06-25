import { legalConfig } from "@/config/legal.config";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function PrivacyDialog({ children = "Privacy Policy" }) {
  const { privacy } = legalConfig;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="underline hover:no-underline text-inherit">
          {children}
        </button>
      </DialogTrigger>
      <DialogContent
        className="max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-5xl w-[95vw] sm:w-[90vw] md:w-[85vw] p-0 gap-0"
        style={{
          height:
            window.innerHeight <= 600
              ? "90vh"
              : window.innerWidth < 640
                ? "85vh"
                : window.innerWidth < 768
                  ? "80vh"
                  : "75vh",
          maxHeight: "90vh",
        }}
      >
        <DialogHeader className="p-3 sm:p-4 md:p-6 border-b space-y-1 sm:space-y-2">
          <DialogTitle className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-blue-800 text-center leading-tight">
            {privacy.title}
          </DialogTitle>
          <div className="text-center space-y-1">
            <p className="text-xs sm:text-sm text-gray-500">
              Effective Date: {privacy.effectiveDate}
            </p>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-prose mx-auto">
              Your privacy is important to us. This policy explains how we
              collect, use, and protect your personal data.
            </p>
          </div>
        </DialogHeader>

        <ScrollArea
          className="flex-1"
          style={{
            height:
              window.innerHeight <= 600
                ? "calc(90vh - 120px)"
                : window.innerWidth < 640
                  ? "calc(85vh - 140px)"
                  : window.innerWidth < 768
                    ? "calc(80vh - 160px)"
                    : "calc(75vh - 180px)",
          }}
        >
          <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6">
            {privacy.content.map((section, i) => (
              <section
                key={i}
                className="border-l-2 sm:border-l-4 border-blue-100 pl-2 sm:pl-3 md:pl-4 py-1 sm:py-2"
              >
                <h4 className="font-semibold text-blue-900 mb-1 sm:mb-2 text-xs sm:text-sm md:text-base">
                  {section.heading}
                </h4>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed text-xs sm:text-sm md:text-base">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
