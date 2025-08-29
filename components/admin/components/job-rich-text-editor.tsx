"use client";

import React, { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
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
  namespace: "JobRichTextEditor",
  theme,
  onError,
  nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode],
};

// Toolbar Component
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

// Rich Text Editor Component
interface JobRichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const JobRichTextEditor = ({
  value = "",
  onChange,
  placeholder = "Write a detailed job description...",
  disabled = false,
  className = "",
}: JobRichTextEditorProps) => {
  const handleChange = (editorState: any, editor: any) => {
    editorState.read(() => {
      const htmlString = $generateHtmlFromNodes(editor, null);
      onChange?.(htmlString);
    });
  };

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
          <InitialValuePlugin initialValue={value} />
        </div>
      </div>
    </LexicalComposer>
  );
};
