export interface RegistrationCheckbox {
  id: string;
  label: string;
  required: boolean;
  description?: string;
}

export const registrationCheckboxes: RegistrationCheckbox[] = [
  {
    id: "filipinoWorker",
    label:
      "I am Filipino. I understand Onlinejobs.ph is only for Filipino workers.",
    required: true,
    description:
      "This platform is specifically designed for Filipino remote workers.",
  },
  {
    id: "individualWorker",
    label:
      "I am an individual worker and do not represent any agency or company.",
    required: true,
    description:
      "We only accept applications from individual freelancers, not agencies.",
  },
  {
    id: "noMultipleAccounts",
    label:
      "I do not have an account. I know multiple accounts are not allowed.",
    required: true,
    description: "Each person is allowed only one account on this platform.",
  },
  {
    id: "agreeToTerms",
    label: "I agree to the Terms of Service and Privacy Policy",
    required: true,
    description:
      "You must agree to our terms and privacy policy to create an account.",
  },
];

export const getCheckboxById = (
  id: string
): RegistrationCheckbox | undefined => {
  return registrationCheckboxes.find((checkbox) => checkbox.id === id);
};

export const getRequiredCheckboxes = (): RegistrationCheckbox[] => {
  return registrationCheckboxes.filter((checkbox) => checkbox.required);
};
