import React, { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FileText,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Type,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

// Lexical imports - Latest stable approach
import {
  $getRoot,
  $getSelection,
  $createParagraphNode,
  $createTextNode,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
} from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  $isListNode,
  ListNode,
  ListItemNode,
} from "@lexical/list";
import { $createQuoteNode, $isQuoteNode, QuoteNode } from "@lexical/rich-text";
import {
  $createHeadingNode,
  $isHeadingNode,
  HeadingNode,
  HeadingTagType,
} from "@lexical/rich-text";

// Lexical theme
const theme = {
  ltr: "ltr",
  rtl: "rtl",
  placeholder: "text-slate-400",
  paragraph: "mb-1",
  quote: "border-l-4 border-slate-300 pl-4 italic text-slate-600",
  heading: {
    h1: "text-2xl font-bold mb-2",
    h2: "text-xl font-semibold mb-2",
    h3: "text-lg font-medium mb-1",
  },
  list: {
    nested: {
      listitem: "list-none",
    },
    ol: "list-decimal list-inside",
    ul: "list-disc list-inside",
    listitem: "mb-1",
  },
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    underlineStrikethrough: "underline line-through",
  },
};

// Error handler
function onError(error: Error) {
  console.error(error);
}

// Initial config
const initialConfig = {
  namespace: "RichTextEditor",
  theme,
  onError,
  nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode],
};

// Toolbar Component - Simplified and Fixed
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [blockType, setBlockType] = useState("paragraph");

  const updateToolbar = () => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));

      // Simplified block type detection
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();

      if ($isHeadingNode(element)) {
        setBlockType(element.getTag());
      } else if ($isQuoteNode(element)) {
        setBlockType("quote");
      } else if ($isListNode(element)) {
        const listType = element.getListType();
        setBlockType(listType);
      } else {
        setBlockType("paragraph");
      }
    }
  };

  // Simplified formatting functions
  const formatHeading = (headingSize: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (selection.isCollapsed()) {
          const anchor = selection.anchor;
          const anchorNode = anchor.getNode();

          let element;
          if (anchorNode.getKey() === "root") {
            element = $createHeadingNode(headingSize);
            $getRoot().append(element);
          } else {
            element = anchorNode.getTopLevelElementOrThrow();
            const newHeading = $createHeadingNode(headingSize);
            element.replace(newHeading);
            newHeading.append(...element.getChildren());
          }
        }
      }
    });
  };

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchor = selection.anchor;
        const anchorNode = anchor.getNode();

        if (anchorNode.getKey() !== "root") {
          const element = anchorNode.getTopLevelElementOrThrow();
          if ($isHeadingNode(element) || $isQuoteNode(element)) {
            const newParagraph = $createParagraphNode();
            element.replace(newParagraph);
            newParagraph.append(...element.getChildren());
          }
        }
      }
    });
  };

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchor = selection.anchor;
        const anchorNode = anchor.getNode();

        if (anchorNode.getKey() === "root") {
          const quote = $createQuoteNode();
          $getRoot().append(quote);
        } else {
          const element = anchorNode.getTopLevelElementOrThrow();
          const newQuote = $createQuoteNode();
          element.replace(newQuote);
          newQuote.append(...element.getChildren());
        }
      }
    });
  };

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor]);

  const getBlockTypeLabel = () => {
    switch (blockType) {
      case "h1":
        return "Heading 1";
      case "h2":
        return "Heading 2";
      case "h3":
        return "Heading 3";
      case "quote":
        return "Quote";
      default:
        return "Normal";
    }
  };

  return (
    <div className="flex items-center gap-1 p-2 border-b border-border flex-wrap">
      {/* Text Style Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="min-w-24 justify-start">
            <Type className="h-4 w-4 mr-2" />
            {getBlockTypeLabel()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={formatParagraph}>
            <Type className="h-4 w-4 mr-2" />
            Normal
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => formatHeading("h1")}>
            <span className="text-xl font-bold mr-2">H1</span>
            Heading 1
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => formatHeading("h2")}>
            <span className="text-lg font-semibold mr-2">H2</span>
            Heading 2
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => formatHeading("h3")}>
            <span className="text-base font-medium mr-2">H3</span>
            Heading 3
          </DropdownMenuItem>
          <DropdownMenuItem onClick={formatQuote}>
            <Quote className="h-4 w-4 mr-2" />
            Quote
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Formatting Buttons */}
      <Toggle
        size="sm"
        pressed={isBold}
        onPressedChange={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
      >
        <Bold className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={isItalic}
        onPressedChange={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
      >
        <Italic className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={isUnderline}
        onPressedChange={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
      >
        <Underline className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* List Buttons */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        }}
      >
        <List className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        }}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* History Buttons */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
      >
        <Undo className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  );
}

// Initial Value Plugin
function InitialValuePlugin({ initialValue }: { initialValue: string }) {
  const [editor] = useLexicalComposerContext();
  const [isSet, setIsSet] = useState(false);

  useEffect(() => {
    if (initialValue && !isSet) {
      editor.update(() => {
        const root = $getRoot();
        root.clear();

        // Check if the initial value is HTML or plain text
        if (initialValue.includes("<") && initialValue.includes(">")) {
          // It's HTML - parse it
          const parser = new DOMParser();
          const dom = parser.parseFromString(initialValue, "text/html");
          const nodes = $generateNodesFromDOM(editor, dom);
          root.append(...nodes);
        } else {
          // It's plain text - convert newlines to paragraphs
          const lines = initialValue
            .split("\n")
            .filter((line) => line.trim() !== "");
          if (lines.length === 0) {
            // Empty content
            const paragraph = $createParagraphNode();
            root.append(paragraph);
          } else {
            lines.forEach((line) => {
              const paragraph = $createParagraphNode();
              const textNode = $createTextNode(line.trim());
              paragraph.append(textNode);
              root.append(paragraph);
            });
          }
        }
        setIsSet(true);
      });
    }
  }, [editor, initialValue, isSet]);

  return null;
}

// Auto Focus Plugin
function AutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.focus();
  }, [editor]);

  return null;
}

// Rich Text Editor Component
interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const RichTextEditor = ({
  value = "",
  onChange,
  placeholder = "Start writing...",
  disabled = false,
  className = "",
}: RichTextEditorProps) => {
  const handleChange = (editorState: any, editor: any) => {
    editorState.read(() => {
      const htmlString = $generateHtmlFromNodes(editor, null);
      onChange?.(htmlString);
    });
  };

  // Initial value setup - Simplified approach
  const editorConfig = {
    ...initialConfig,
  };

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className={`border border-input rounded-md ${className}`}>
        <ToolbarPlugin />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="min-h-32 p-3 text-sm outline-none resize-none"
                style={{ userSelect: "text" }}
                disabled={disabled}
              />
            }
            placeholder={
              <div className="absolute top-3 left-3 text-sm text-slate-400 pointer-events-none">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={handleChange} />
          <HistoryPlugin />
          <ListPlugin />
          <AutoFocusPlugin />
          <InitialValuePlugin initialValue={value} />
        </div>
      </div>
    </LexicalComposer>
  );
};

// Profile Description Schema
const ProfileDescriptionSchema = z.object({
  profileDescription: z.string().min(1, "Profile description is required"),
});

type ProfileDescriptionFormData = z.infer<typeof ProfileDescriptionSchema>;

interface ProfileDescriptionProps {
  loading?: boolean;
  initialData?: Partial<ProfileDescriptionFormData>;
}

interface InfoItemProps {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  description?: string;
}

const InfoItem = ({ label, icon, children, description }: InfoItemProps) => (
  <div className="space-y-3">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
        {description && (
          <p className="text-xs text-muted-foreground/70">{description}</p>
        )}
      </div>
    </div>
    <div className="pl-11">{children}</div>
  </div>
);

export const ProfileDescriptionSection = ({
  loading = false,
  initialData = {},
}: ProfileDescriptionProps) => {
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState<
    Partial<ProfileDescriptionFormData>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const defaultValues = useMemo(
    (): ProfileDescriptionFormData => ({
      profileDescription: "",
      ...initialData,
    }),
    [initialData]
  );
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProfileDescriptionFormData>({
    resolver: zodResolver(ProfileDescriptionSchema),
    defaultValues,
  });

  // Watch all form values to detect changes
  const watchedValues = watch();

  useEffect(() => {
    setOriginalData(defaultValues);
  }, [defaultValues]);

  useEffect(() => {
    const hasFormChanges =
      JSON.stringify(watchedValues) !== JSON.stringify(originalData);
    setHasChanges(hasFormChanges);
  }, [watchedValues, originalData]);

  // Submit function using the API route
  const onSubmit = async (data: ProfileDescriptionFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/profile/edit-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.ok) {
        setOriginalData(data);
        setHasChanges(false);
        toast({
          title: "Profile Description Updated",
          description: "Your profile description has been saved successfully.",
          variant: "success",
        });
      } else {
        throw new Error(result.message || "Failed to save profile description");
      }
    } catch (error) {
      console.error("Error saving profile description:", error);
      toast({
        title: "Error Saving Description",
        description: "Failed to save profile description. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset(originalData);
    setHasChanges(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-brand" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Profile Description
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Write a compelling description about yourself and your
                professional background
              </p>
            </div>
          </div>

          <div>
            <InfoItem
              label="About You"
              icon={<FileText className="w-4 h-4 text-muted-foreground" />}
              description="Tell employers about your experience, skills, and what makes you unique"
            >
              <Controller
                name="profileDescription"
                control={control}
                render={({ field }) => (
                  <div>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Write about your professional background, key achievements, skills, and what you're passionate about..."
                      disabled={loading || isSubmitting}
                      className={
                        errors.profileDescription ? "border-red-500" : ""
                      }
                    />
                    {errors.profileDescription && (
                      <p className="text-red-500 text-xs mt-2">
                        {errors.profileDescription.message}
                      </p>
                    )}
                    <div className="mt-3 p-3 bg-muted/50 rounded-md">
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p className="font-medium">✨ Formatting Options:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                          <p>• Use toolbar for formatting</p>
                          <p>• Select text for quick formatting</p>
                          <p>• Choose heading sizes from dropdown</p>
                          <p>• Add lists and quotes easily</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              />
            </InfoItem>
          </div>

          {/* Action Buttons */}
          {hasChanges && (
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-8 border-t border-border mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading || isSubmitting}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? "Saving..." : "Save Description"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </form>
  );
};

export { ProfileDescriptionSchema };
export type { ProfileDescriptionFormData };
