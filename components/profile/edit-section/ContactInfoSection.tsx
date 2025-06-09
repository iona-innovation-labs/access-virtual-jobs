import React from "react";
import { Control, UseFieldArrayReturn } from "react-hook-form";
import { Phone, Mail, MapPin, X, Plus } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectItem,
  SelectLabel,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { EditProfileSchema } from "@/lib/validation/update-profile-form-validation";

interface ContactInfoSectionProps {
  control: Control<EditProfileSchema>;
  loading: boolean;
  phoneFields: UseFieldArrayReturn<EditProfileSchema, "phone">;
  emailFields: UseFieldArrayReturn<EditProfileSchema, "emailAddress">;
}

export const ContactInfoSection = ({
  control,
  loading,
  phoneFields,
  emailFields,
}: ContactInfoSectionProps) => {
  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center">
            <Phone className="w-4 h-4 text-brand" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Contact Information
          </h2>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Address */}
        <FormField
          control={control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Address <span className="text-red-500">*</span>
              </FormLabel>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <FormControl>
                  <Input
                    disabled={loading}
                    {...field}
                    placeholder="Enter your full address"
                    className="pl-10 border-gray-300 focus:border-brand focus:ring-brand"
                  />
                </FormControl>
              </div>
              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />

        {/* Phone Numbers */}
        <div className="space-y-4">
          <FormLabel className="text-sm font-medium text-gray-700">
            Contact Numbers <span className="text-red-500">*</span>
          </FormLabel>

          <div className="space-y-3">
            {phoneFields.fields.map((phone, index) => (
              <div key={phone.id} className="flex gap-3 items-start">
                <FormField
                  control={control}
                  name={`phone.${index}.type`}
                  render={({ field }) => (
                    <FormItem className="w-40">
                      <FormControl>
                        <Select
                          disabled={loading}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="border-gray-300 focus:border-brand">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Phone Type</SelectLabel>
                              <SelectItem value="mobile">Mobile</SelectItem>
                              <SelectItem value="work">Work</SelectItem>
                              <SelectItem value="home">Home</SelectItem>
                              <SelectItem value="main">Main</SelectItem>
                              <SelectItem value="work-fax">Work Fax</SelectItem>
                              <SelectItem value="private-fax">
                                Private Fax
                              </SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`phone.${index}.number`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          disabled={loading}
                          {...field}
                          placeholder="Enter phone number"
                          className="border-gray-300 focus:border-brand focus:ring-brand"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                {phoneFields.fields.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    disabled={loading}
                    onClick={() => phoneFields.remove(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={() => phoneFields.append({ type: "", number: "" })}
              className="border-brand/20 text-brand hover:bg-brand/5"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Phone Number
            </Button>
          </div>
        </div>

        {/* Email Addresses */}
        <div className="space-y-4">
          <FormLabel className="text-sm font-medium text-gray-700">
            Email Addresses <span className="text-red-500">*</span>
          </FormLabel>

          <div className="space-y-3">
            {emailFields.fields.map((email, index) => (
              <div key={email.id} className="flex gap-3 items-start">
                <FormField
                  control={control}
                  name={`emailAddress.${index}.type`}
                  render={({ field }) => (
                    <FormItem className="w-40">
                      <FormControl>
                        <Select
                          disabled={loading}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="border-gray-300 focus:border-brand">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Email Type</SelectLabel>
                              <SelectItem value="work">Work</SelectItem>
                              <SelectItem value="home">Personal</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`emailAddress.${index}.address`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <FormControl>
                          <Input
                            disabled={loading}
                            {...field}
                            type="email"
                            placeholder="Enter email address"
                            className="pl-10 border-gray-300 focus:border-brand focus:ring-brand"
                          />
                        </FormControl>
                      </div>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                {emailFields.fields.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    disabled={loading}
                    onClick={() => emailFields.remove(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={() => emailFields.append({ type: "", address: "" })}
              className="border-brand/20 text-brand hover:bg-brand/5"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Email Address
            </Button>
          </div>
        </div>

        {/* Date of Birth */}
        <FormField
          control={control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Date of Birth <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <DatePicker
                  disabled={loading}
                  date={field.value}
                  onChange={field.onChange}
                  placeholder="Select your date of birth"
                  className="border-gray-300 focus:border-brand"
                />
              </FormControl>
              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />

        {/* Skype ID */}
        <FormField
          control={control}
          name="skypeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Skype ID <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  disabled={loading}
                  {...field}
                  placeholder="Enter your Skype ID"
                  className="border-gray-300 focus:border-brand focus:ring-brand"
                />
              </FormControl>
              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
