import React from "react";
import { Control } from "react-hook-form";
import { Monitor, Wifi, Clock, DollarSign } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { IProfileResponse } from "@/types/profiles";

interface TechnicalInfoSectionProps {
  control: Control<EditProfileSchema>;
  loading: boolean;
  data: IProfileResponse;
}

export const TechnicalInfoSection = ({
  control,
  loading,
  data,
}: TechnicalInfoSectionProps) => {
  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center">
            <Monitor className="w-4 h-4 text-brand" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Technical Setup
          </h2>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Internet Provider */}
        <FormField
          control={control}
          name="internetProvider"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Internet Provider <span className="text-red-500">*</span>
              </FormLabel>
              <p className="text-xs text-gray-500 mb-2">
                What is your Internet Service Provider? Please include the plan
                details.
              </p>
              <div className="relative">
                <Wifi className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <FormControl>
                  <Input
                    disabled={loading}
                    {...field}
                    placeholder="e.g., Comcast Xfinity 100 Mbps"
                    className="pl-10 border-gray-300 focus:border-brand focus:ring-brand"
                  />
                </FormControl>
              </div>
              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />

        {/* Number of Monitors */}
        <FormField
          control={control}
          name="numberOfMonitors"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Number of Monitors <span className="text-red-500">*</span>
              </FormLabel>
              <div className="relative">
                <Monitor className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <FormControl>
                  <Input
                    disabled={loading}
                    {...field}
                    type="number"
                    min="1"
                    max="10"
                    placeholder="1"
                    className="pl-10 border-gray-300 focus:border-brand focus:ring-brand"
                  />
                </FormControl>
              </div>
              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />

        {/* Years of Experience */}
        <FormField
          control={control}
          name="numberOfExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Years of Work Experience <span className="text-red-500">*</span>
              </FormLabel>
              <div className="relative">
                <Clock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <FormControl>
                  <Input
                    disabled={loading}
                    {...field}
                    type="number"
                    min="0"
                    max="50"
                    placeholder="5"
                    className="pl-10 border-gray-300 focus:border-brand focus:ring-brand"
                  />
                </FormControl>
              </div>
              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />

        {/* Desired Salary */}
        <div className="space-y-3">
          <FormLabel className="text-sm font-medium text-gray-700">
            Desired Salary <span className="text-red-500">*</span>
          </FormLabel>

          <div className="flex gap-3">
            <FormField
              control={control}
              name="salaryUnit"
              render={({ field }) => (
                <FormItem className="w-32">
                  <FormControl>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      defaultValue={
                        field.value?.toString() ||
                        data?.profile?.salaryUnit ||
                        ""
                      }
                    >
                      <SelectTrigger className="border-gray-300 focus:border-brand">
                        <SelectValue placeholder="Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Currency</SelectLabel>
                          <SelectItem value="PHP">PHP</SelectItem>
                          <SelectItem value="COP">COP</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
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
              name="desiredSalary"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <FormControl>
                      <Input
                        disabled={loading}
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                        type="number"
                        min="0"
                        placeholder="Enter amount"
                        className="pl-10 border-gray-300 focus:border-brand focus:ring-brand"
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
          </div>
          <p className="text-xs text-gray-500">
            Please specify your monthly salary expectation
          </p>
        </div>

        {/* PayPal Account */}
        <FormField
          control={control}
          name="hasPaypal"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                PayPal Account Status <span className="text-red-500">*</span>
              </FormLabel>
              <p className="text-xs text-gray-500 mb-2">
                We pay via PayPal. Do you have a PayPal account?
              </p>
              <FormControl>
                <Select
                  disabled={loading}
                  onValueChange={field.onChange}
                  defaultValue={
                    field.value?.toString() || data?.profile?.hasPaypal || ""
                  }
                >
                  <SelectTrigger className="border-gray-300 focus:border-brand">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>PayPal Status</SelectLabel>
                      <SelectItem value="yes">Yes, I have PayPal</SelectItem>
                      <SelectItem value="no">
                        No, I don&apos;t have PayPal
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />

        {/* Number of Children */}
        <FormField
          control={control}
          name="numberOfChildren"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Number of Children <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  disabled={loading}
                  {...field}
                  type="number"
                  min="0"
                  max="20"
                  placeholder="0"
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
