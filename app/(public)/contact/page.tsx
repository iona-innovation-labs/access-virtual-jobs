"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  subject: z.string().min(1, "Please select a subject"),
  position: z.string().min(1, "Please select your role"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

const subjectOptions = [
  { value: "support", label: "General Support" },
  { value: "billing", label: "Billing & Payments" },
  { value: "staffing", label: "Staffing Requirements" },
  { value: "career", label: "Career Opportunities" },
  { value: "partnership", label: "Partnership Inquiry" },
  { value: "other", label: "Other" },
];

// const roleOptions = [
//   { value: "ceo", label: "CEO / Owner / President" },
//   { value: "director", label: "Director" },
//   { value: "hr", label: "HR Manager" },
//   { value: "recruiter", label: "Recruiter" },
//   { value: "manager", label: "Account Manager" },
//   { value: "jobseeker", label: "Job Seeker" },
//   { value: "other", label: "Other" },
// ];

interface ContactFormProps {
  className?: string;
}

export default function ContactForm({ className }: ContactFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      position: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    console.log("Form submitted:", data);
    setIsSubmitted(true);
    setIsLoading(false);
    form.reset();
    
    // Reset success state after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  if (isSubmitted) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-12 px-4 ${className}`}>
        <div className="max-w-md mx-auto">
          <Card className="shadow-none border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h3 
                className="text-2xl font-bold mb-4"
                style={{ 
                  color: '#042e67',
                  fontFamily: 'Montserrat, sans-serif'
                }}
              >
                Message Sent Successfully!
              </h3>
              <p 
                className="text-gray-600"
                style={{ fontFamily: 'Archivo, sans-serif' }}
              >
                Thank you for reaching out. We&apos;ll get back to you within 24 hours.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-12 px-4 mt-12 ${className}`}>
      <div className="max-w-4xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Contact Info */}
          <div className="space-y-8">
            <div>
              <Badge 
                variant="secondary" 
                className="mb-4 text-white hover:opacity-90"
                style={{ backgroundColor: '#00c2cb' }}
              >
                Get in Touch
              </Badge>
              <h1 
                className="text-4xl font-bold mb-6"
                style={{ 
                  color: '#042e67',
                  fontFamily: 'Archivo, sans-serif',
                  fontSize: '3rem',
                  lineHeight: '1.2',
                  fontWeight: '700'
                }}
              >
                Let&apos;s Start a Conversation
              </h1>
              <p 
                className="text-lg text-gray-600 leading-relaxed"
                style={{ 
                  fontFamily: 'Archivo, sans-serif',
                  fontSize: '1rem',
                  lineHeight: '1.5'
                }}
              >
                Ready to transform your business? We&apos;d love to hear from you. 
                Send us a message and we&apos;ll respond within 24 hours.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm">
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: '#00c2cb' }}
                >
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 
                    className="font-semibold"
                    style={{ 
                      color: '#042e67',
                      fontFamily: 'Montserrat, sans-serif'
                    }}
                  >
                    Email
                  </h3>
                  <p 
                    className="text-gray-600"
                    style={{ fontFamily: 'Archivo, sans-serif' }}
                  >
                    hello@company.com
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm">
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: '#00c2cb' }}
                >
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 
                    className="font-semibold"
                    style={{ 
                      color: '#042e67',
                      fontFamily: 'Montserrat, sans-serif'
                    }}
                  >
                    Phone
                  </h3>
                  <p 
                    className="text-gray-600"
                    style={{ fontFamily: 'Archivo, sans-serif' }}
                  >
                    +1 (555) 123-4567
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm">
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: '#00c2cb' }}
                >
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 
                    className="font-semibold"
                    style={{ 
                      color: '#042e67',
                      fontFamily: 'Montserrat, sans-serif'
                    }}
                  >
                    Office
                  </h3>
                  <p 
                    className="text-gray-600"
                    style={{ fontFamily: 'Archivo, sans-serif' }}
                  >
                    123 Business Ave, Suite 100<br />New York, NY 10001
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <Card className="shadow-none border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-8">
              <CardTitle 
                className="text-2xl font-bold"
                style={{ 
                  color: '#042e67',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '2rem',
                  lineHeight: '1.3',
                  fontWeight: '600'
                }}
              >
                Send us a Message
              </CardTitle>
              <CardDescription 
                className="text-gray-600"
                style={{ fontFamily: 'Archivo, sans-serif' }}
              >
                Fill out the form below and we&apos;ll get back to you shortly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...form}>
                <div className="space-y-6" onClick={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel 
                          className="text-gray-700 font-medium"
                          style={{ fontFamily: 'Archivo, sans-serif' }}
                        >
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your full name" 
                            className="h-12 border-gray-200 transition-all duration-200"
                            style={{
                              '--tw-ring-color': '#042e67',
                              borderColor: 'rgb(229 231 235)',
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = '#042e67';
                              e.target.style.boxShadow = '0 0 0 3px rgba(4, 46, 103, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = 'rgb(229 231 235)';
                              e.target.style.boxShadow = 'none';
                            }}
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
                          <FormLabel 
                            className="text-gray-700 font-medium"
                            style={{ fontFamily: 'Archivo, sans-serif' }}
                          >
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="email"
                              placeholder="your@email.com" 
                              className="h-12 border-gray-200 transition-all duration-200"
                              onFocus={(e) => {
                                e.target.style.borderColor = '#042e67';
                                e.target.style.boxShadow = '0 0 0 3px rgba(4, 46, 103, 0.1)';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderColor = 'rgb(229 231 235)';
                                e.target.style.boxShadow = 'none';
                              }}
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
                          <FormLabel 
                            className="text-gray-700 font-medium"
                            style={{ fontFamily: 'Archivo, sans-serif' }}
                          >
                            Phone
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="tel"
                              placeholder="+1 (555) 123-4567" 
                              className="h-12 border-gray-200 transition-all duration-200"
                              onFocus={(e) => {
                                e.target.style.borderColor = '#042e67';
                                e.target.style.boxShadow = '0 0 0 3px rgba(4, 46, 103, 0.1)';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderColor = 'rgb(229 231 235)';
                                e.target.style.boxShadow = 'none';
                              }}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className=" gap-6">
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel 
                            className="text-gray-700 font-medium"
                            style={{ fontFamily: 'Archivo, sans-serif' }}
                          >
                            Subject
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger 
                                className="h-12 border-gray-200 transition-all duration-200 w-full"
                                style={{
                                  '--tw-ring-color': '#042e67'
                                }}
                              >
                                <SelectValue placeholder="Select a topic" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subjectOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel 
                          className="text-gray-700 font-medium"
                          style={{ fontFamily: 'Archivo, sans-serif' }}
                        >
                          Message
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about your project or inquiry..."
                            className="min-h-32 border-gray-200 transition-all duration-200 resize-none"
                            onFocus={(e) => {
                              e.target.style.borderColor = '#042e67';
                              e.target.style.boxShadow = '0 0 0 3px rgba(4, 46, 103, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = 'rgb(229 231 235)';
                              e.target.style.boxShadow = 'none';
                            }}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    onClick={form.handleSubmit(onSubmit)}
                    className="w-full h-12 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    style={{ 
                      backgroundColor: '#042e67',
                      fontFamily: 'Montserrat, sans-serif'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#003b59';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#042e67';
                    }}
                  >
                    {isLoading ? (
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
                </div>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}