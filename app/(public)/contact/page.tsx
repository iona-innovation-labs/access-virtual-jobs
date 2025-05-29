"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, Send, CheckCircle } from "lucide-react";
import submitForm from "@/lib/send";
import { contactConfig } from "@/config/contact.config";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormSchema = z.infer<typeof formSchema>;

const subjectOptions = [
  {
    value: "first-choice",
    label: "I am an existing client and I have a concern",
  },
  { value: "second-choice", label: "Payment or Invoicing concern" },
  { value: "third-choice", label: "General support request" },
  { value: "fourth-choice", label: "I have a unique staffing requirements" },
  {
    value: "fifth-choice",
    label: "I am looking for a job and I have questions",
  },
  { value: "sixth-choice", label: "Others" },
];

export default function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
    reset,
  } = form;

  const onSubmitForm: SubmitHandler<ContactFormSchema> = async (data) => {
    const { success, errors } = await submitForm(data);

    if (errors) {
      toast({
        variant: "destructive",
        title: "Failed to submit",
        description: errors.message,
      });
      return;
    }

    if (success) {
      toast({
        variant: "default",
        title: "Success!",
        description: success,
      });
      reset();
      setValue("subject", "");
      setIsSubmitted(true);

      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card className="shadow-none border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-[#042e67] font-[Montserrat]">
                Message Sent Successfully!
              </h3>
              <p className="text-gray-600 font-[Archivo]">
                Thank you for reaching out. We&apos;ll get back to you within 24
                hours.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-12 px-4 mt-12">
      <div className="max-w-4xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Contact Info */}
          <div className="space-y-8">
            <div>
              <Badge
                variant="secondary"
                className="mb-4 text-white hover:opacity-90 bg-[#00c2cb]"
              >
                {contactConfig.badge}
              </Badge>
              <h1 className="text-5xl font-bold mb-6 text-[#042e67] font-[Archivo] leading-tight">
                {contactConfig.title}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed font-[Archivo]">
                {contactConfig.description}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm">
                <div className="p-3 rounded-lg bg-brand">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#042e67] font-[Montserrat]">
                    Email
                  </h3>
                  <p className="text-gray-600 font-[Archivo]">
                    {contactConfig.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm">
                <div className="p-3 rounded-lg bg-brand">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#042e67] font-[Montserrat]">
                    Office
                  </h3>
                  <p className="text-gray-600 font-[Archivo]">
                    {contactConfig.office}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <Card className="shadow-none border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-8">
              <CardTitle className="text-2xl font-semibold text-[#042e67] font-[Montserrat] leading-snug">
                Send us a Message
              </CardTitle>
              <CardDescription className="text-gray-600 font-[Archivo]">
                Fill out the form below and we&apos;ll get back to you shortly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...form}>
                <form
                  onSubmit={handleSubmit(onSubmitForm)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium font-[Archivo]">
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your full name"
                            className="h-12 border-gray-200 transition-all duration-200 focus:border-[#042e67] focus:ring-[#042e67] focus:ring-opacity-10"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium font-[Archivo]">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="your@email.com"
                              className="h-12 border-gray-200 transition-all duration-200 focus:border-[#042e67] focus:ring-[#042e67] focus:ring-opacity-10"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium font-[Archivo]">
                            Phone
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+1 (555) 123-4567"
                              className="h-12 border-gray-200 transition-all duration-200 focus:border-[#042e67] focus:ring-[#042e67] focus:ring-opacity-10"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium font-[Archivo]">
                          Subject
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12 border-gray-200 transition-all duration-200 w-full focus:border-[#042e67] focus:ring-[#042e67] focus:ring-opacity-10">
                              <SelectValue placeholder="Select a topic" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subjectOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium font-[Archivo]">
                          Message
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your project or inquiry..."
                            className="min-h-32 border-gray-200 transition-all duration-200 resize-none focus:border-[#042e67] focus:ring-[#042e67] focus:ring-opacity-10"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 bg-[#042e67] hover:bg-[#003b59] font-[Montserrat]"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Send className="h-4 w-4" />
                        <span>Send Message</span>
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
