import Image from "next/image";
import Link from "next/link";
import type { MDXComponents } from "mdx/types";

/**
 * MDX Components configuration for Next.js
 *
 * This file is required by Next.js when using @next/mdx.
 * It allows customizing how MDX elements are rendered.
 */

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Custom heading components with anchor links
    h1: ({ children, ...props }) => (
      <h1
        className="mb-6 mt-8 scroll-mt-20 text-4xl font-bold tracking-tight text-foreground"
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2
        className="mb-4 mt-8 scroll-mt-20 text-3xl font-semibold tracking-tight text-foreground"
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3
        className="mb-3 mt-6 scroll-mt-20 text-2xl font-semibold tracking-tight text-foreground"
        {...props}
      >
        {children}
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4
        className="mb-2 mt-4 scroll-mt-20 text-xl font-semibold tracking-tight text-foreground"
        {...props}
      >
        {children}
      </h4>
    ),

    // Paragraph styling
    p: ({ children, ...props }) => (
      <p className="mb-4 leading-7 text-muted-foreground" {...props}>
        {children}
      </p>
    ),

    // List styling
    ul: ({ children, ...props }) => (
      <ul className="mb-4 ml-6 list-disc space-y-2" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="mb-4 ml-6 list-decimal space-y-2" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="leading-7 text-muted-foreground" {...props}>
        {children}
      </li>
    ),

    // Blockquote styling
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="mb-4 border-l-4 border-primary pl-4 italic text-muted-foreground"
        {...props}
      >
        {children}
      </blockquote>
    ),

    // Code styling
    code: ({ children, ...props }) => (
      <code
        className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
        {...props}
      >
        {children}
      </code>
    ),
    pre: ({ children, ...props }) => (
      <pre
        className="mb-4 overflow-x-auto rounded-lg bg-muted p-4"
        {...props}
      >
        {children}
      </pre>
    ),

    // Table styling
    table: ({ children, ...props }) => (
      <div className="mb-4 overflow-x-auto">
        <table
          className="w-full border-collapse text-sm"
          {...props}
        >
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }) => (
      <th
        className="border border-border bg-muted px-4 py-2 text-left font-semibold"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="border border-border px-4 py-2" {...props}>
        {children}
      </td>
    ),

    // Link styling - use Next.js Link for internal links
    a: ({ href, children, ...props }) => {
      const isInternal = href?.startsWith("/") || href?.startsWith("#");

      if (isInternal && href) {
        return (
          <Link
            href={href}
            className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
            {...props}
          >
            {children}
          </Link>
        );
      }

      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
          {...props}
        >
          {children}
        </a>
      );
    },

    // Image styling - use Next.js Image for optimization
    img: ({ src, alt, ...props }) => {
      if (!src) return null;

      // For external images, use regular img tag
      if (src.startsWith("http")) {
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt ?? ""}
            className="mb-4 rounded-lg"
            {...props}
          />
        );
      }

      // For internal images, use Next.js Image
      return (
        <Image
          src={src}
          alt={alt ?? ""}
          width={800}
          height={450}
          className="mb-4 rounded-lg"
          {...props}
        />
      );
    },

    // Horizontal rule
    hr: ({ ...props }) => (
      <hr className="my-8 border-border" {...props} />
    ),

    // Strong and emphasis
    strong: ({ children, ...props }) => (
      <strong className="font-semibold text-foreground" {...props}>
        {children}
      </strong>
    ),
    em: ({ children, ...props }) => (
      <em className="italic" {...props}>
        {children}
      </em>
    ),

    // Allow custom components to be passed
    ...components,
  };
}
