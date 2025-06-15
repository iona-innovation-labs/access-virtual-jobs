export interface RequiredFileType {
  type: string;
  label: string;
  required: boolean;
}

export const REQUIRED_FILE_TYPES: RequiredFileType[] = [
  {
    type: "resume",
    label: "Resume",
    required: true,
  },
  {
    type: "professional_picture",
    label: "Professional Photo",
    required: true,
  },
  {
    type: "internet",
    label: "Internet Speed Test",
    required: true,
  },
  {
    type: "computer_specs",
    label: "Computer Specifications",
    required: true,
  },
  {
    type: "work_station",
    label: "Workstation Setup",
    required: true,
  },
];

export const getRequiredFileTypes = (): RequiredFileType[] => {
  return REQUIRED_FILE_TYPES.filter((file) => file.required);
};

export const isFileTypeRequired = (type: string): boolean => {
  return REQUIRED_FILE_TYPES.some(
    (file) => file.type === type && file.required
  );
};

export const getFileLabel = (type: string): string => {
  const file = REQUIRED_FILE_TYPES.find((file) => file.type === type);
  return file?.label || type;
};
