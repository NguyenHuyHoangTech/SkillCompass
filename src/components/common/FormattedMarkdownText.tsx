import React from 'react';

interface FormattedMarkdownTextProps {
  content: string;
  className?: string;
}

export const FormattedMarkdownText: React.FC<FormattedMarkdownTextProps> = ({ content, className = '' }) => {
  if (!content) return null;

  const lines = content.split('\n');

  return (
    <div className={`space-y-1.5 text-sm leading-relaxed ${className}`}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Horizontal divider ---
        if (/^---$|^___$|^\*\*\*$/.test(trimmed)) {
          return <hr key={idx} className="my-2.5 border-slate-200" />;
        }

        // Headers ### or ## or #
        let isHeading = false;
        let headingText = trimmed;
        if (/^#{1,6}\s+/.test(trimmed)) {
          isHeading = true;
          headingText = trimmed.replace(/^#{1,6}\s+/, '');
        }

        // Parse inline bold **text**
        const parseInline = (text: string) => {
          const parts = text.split(/(\*\*.*?\*\*)/g);
          return parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
            }
            return part;
          });
        };

        if (isHeading) {
          return (
            <h4 key={idx} className="font-bold text-slate-900 text-sm sm:text-base mt-3 mb-1">
              {parseInline(headingText)}
            </h4>
          );
        }

        // Bullet points
        if (/^[\*\-]\s+/.test(trimmed)) {
          const bulletContent = trimmed.replace(/^[\*\-]\s+/, '');
          return (
            <div key={idx} className="flex gap-2 items-start pl-1 my-0.5">
              <span className="text-indigo-500 font-bold text-xs mt-0.5">•</span>
              <span className="flex-1 text-slate-700">
                {parseInline(bulletContent)}
              </span>
            </div>
          );
        }

        // Numbered list items e.g., 1. 2.
        if (/^\d+\.\s+/.test(trimmed)) {
          const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
          if (numMatch) {
            return (
              <div key={idx} className="flex gap-2 items-start pl-1 my-0.5">
                <span className="text-indigo-600 font-bold text-xs mt-0.5">{numMatch[1]}.</span>
                <span className="flex-1 text-slate-700">
                  {parseInline(numMatch[2])}
                </span>
              </div>
            );
          }
        }

        return (
          <p key={idx} className="m-0 text-slate-700">
            {parseInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

export default FormattedMarkdownText;
