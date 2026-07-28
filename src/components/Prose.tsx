import { MDXRemote } from "next-mdx-remote/rsc";
import PullQuote from "./PullQuote";
import YorubaProverb from "./ui/YorubaProverb";
import type { AccentName } from "@/lib/accents";

/**
 * Renders MDX chapter/story prose in the editorial reading style:
 * disciplined body measure, display subheads, era-accent blockquotes, drop-caps.
 */
export default function Prose({
  source,
  accent = "oxide",
  dropCap = true,
}: {
  source: string;
  accent?: AccentName;
  dropCap?: boolean;
}) {
  return (
    <div className={`max-w-[70ch] ${dropCap ? "ov-dropcap-prose" : ""}`}>
      <MDXRemote
        source={source}
        components={{
          h2: ({ children, ...props }) => (
            <h2 className="font-display text-display-md mt-12 mb-4" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="font-display mt-8 mb-3 text-xl" {...props}>
              {children}
            </h3>
          ),
          p: ({ children, className, ...props }) => (
            <p className={`mb-5 ${dropCap ? "[&:first-of-type]:ov-dropcap" : ""} ${className ?? ""}`} {...props}>
              {children}
            </p>
          ),
          a: ({ children, ...props }) => (
            <a className="font-semibold text-adire underline hover:text-oxide" {...props}>
              {children}
            </a>
          ),
          ul: (props) => <ul className="mb-5 list-disc pl-6" {...props} />,
          ol: (props) => <ol className="mb-5 list-decimal pl-6" {...props} />,
          blockquote: ({ children }) => (
            <PullQuote accent={accent}>{children}</PullQuote>
          ),
          YorubaProverb: YorubaProverb,
        }}
      />
    </div>
  );
}
