export interface FileField {
  label: string;
  name: string;
  type: string;
  preset: string;
  allowedFileTypes: string[];
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  required: boolean;
}
