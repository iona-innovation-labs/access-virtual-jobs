"use client";

import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";

type Props = {
  heading: string;
  children: React.ReactNode;
};

export type ViewJobContentProps = React.ComponentPropsWithoutRef<"section"> &
  Partial<Props>;

export const ViewJobContent = (props: ViewJobContentProps) => {
  const { heading, children, ...rest } = props;

  return (
    <section id="viewjob_content" className="mx-auto py-2" {...rest}>
      <div className="grid grid-cols-1">
        <div className="lg:col-span-2">
          <Card className="shadow-sm border-0 py-0">
            <div className="p-8">
              {/* Section Header */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-brand" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{heading}</h2>
              </div>
              <div className="prose prose-gray prose-lg max-w-none">
                {children}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
