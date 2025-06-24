export interface RegistrationCheckbox {
  id: string;
  label: string;
  required: boolean;
  description?: string;
}

export const registrationCheckboxes: RegistrationCheckbox[] = [
  {
    id: "individualWorker",
    label:
      "I am an individual worker and I do not represent any agency or company.",
    required: true,
    description:
      "We only accept applications from individual freelancers, not agencies.",
  },
  {
    id: "noMultipleAccounts",
    label:
      "I do not have any other accounts. I acknowledge that multiple accounts are not allowed",
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
