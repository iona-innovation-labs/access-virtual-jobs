"use client";

import { MDXRemote } from "next-mdx-remote";
import Image from "next/image";
import Link from "next/link";

const mdxComponents = {
  h1: ({ children }: any) => (
    <h1 className="text-xl md:text-2xl font-semibold text-foreground mb-4 mt-8">
      {children}
    </h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="text-lg md:text-xl font-medium text-foreground mb-3 mt-6">
      {children}
    </h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="text-base md:text-lg font-medium text-foreground mb-2 mt-4">
      {children}
    </h3>
  ),
  h4: ({ children }: any) => (
    <h4 className="text-sm md:text-base font-medium text-foreground mb-2 mt-3">
      {children}
    </h4>
  ),
  h5: ({ children }: any) => (
    <h5 className="text-sm font-medium text-foreground mb-1 mt-3">
      {children}
    </h5>
  ),
  h6: ({ children }: any) => (
    <h6 className="text-xs font-medium text-muted-foreground mb-1 mt-2 uppercase">
      {children}
    </h6>
  ),
  p: ({ children }: any) => (
    <p className="text-sm md:text-base text-foreground leading-relaxed mb-4">
      {children}
    </p>
  ),
  ul: ({ children }: any) => (
    <ul className="list-disc ml-4 mb-4 text-sm md:text-base">{children}</ul>
  ),
  ol: ({ children }: any) => (
    <ol className="list-decimal ml-4 mb-4 text-sm md:text-base">{children}</ol>
  ),
  li: ({ children }: any) => (
    <li className="text-foreground mb-1">{children}</li>
  ),
  blockquote: ({ children }: any) => (
    <blockquote className="border-l border-border pl-3 my-4 text-sm md:text-base text-muted-foreground">
      {children}
    </blockquote>
  ),
  code: ({ children }: any) => (
    <code className="bg-muted px-1 text-xs font-mono">{children}</code>
  ),
  pre: ({ children }: any) => (
    <pre className="bg-muted p-3 text-xs font-mono overflow-x-auto my-4">
      {children}
    </pre>
  ),
  a: ({ href, children }: any) => (
    <Link
      href={href}
      className="underline"
      target={href?.startsWith("http") ? "_blank" : undefined}
    >
      {children}
    </Link>
  ),
  img: ({ src, alt }: any) => (
    <div className="my-4">
      <Image
        src={src}
        alt={alt}
        width={600}
        height={300}
        className="w-full h-auto"
      />
    </div>
  ),
  table: ({ children }: any) => (
    <div className="my-4 overflow-x-auto">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  th: ({ children }: any) => (
    <th className="border-b px-2 py-1 text-left font-medium">{children}</th>
  ),
  td: ({ children }: any) => <td className="border-b px-2 py-1">{children}</td>,
  hr: () => <hr className="my-6 border-border" />,
  strong: ({ children }: any) => (
    <strong className="font-medium">{children}</strong>
  ),
  em: ({ children }: any) => <em>{children}</em>,
};

interface MDXContentProps {
  content: any;
}

export function MDXContent({ content }: MDXContentProps) {
  return (
    <div className="text-sm leading-relaxed mt-12">
      <MDXRemote {...content} components={mdxComponents} />
    </div>
  );
}
