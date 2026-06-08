import { ReactNode } from 'react';

const splitTextByLine = (text: string): ReactNode[] =>
  text.split('\n').flatMap((line, index, arr) => [
    line,
    ...(index < arr.length - 1 ? [<br key={`br-${index}`} />] : []),
  ]);

export const parseChatContent = (content: string): ReactNode[] => {
  const nodes: ReactNode[] = [];
  const markdownRegex = /(`[^`]+`)|(\*\*[^*]+\*\*)|(__[^_]+__)|(\*[^*]+\*)|(_[^_]+_)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null = null;

  while ((match = markdownRegex.exec(content)) !== null) {
    const [fullMatch] = match;
    const codeMatch = match[1];
    const boldDoubleMatch = match[2];
    const boldUnderscoreMatch = match[3];
    const italicStarMatch = match[4];
    const italicUnderscoreMatch = match[5];

    if (match.index > lastIndex) {
      nodes.push(...splitTextByLine(content.slice(lastIndex, match.index)));
    }

    if (codeMatch) {
      const codeText = codeMatch.slice(1, -1);
      nodes.push(
        <code key={`code-${match.index}`} className="font-mono text-xs bg-slate-100 rounded px-1 py-0.5">
          {codeText}
        </code>,
      );
    } else if (boldDoubleMatch || boldUnderscoreMatch) {
      const boldText = (boldDoubleMatch || boldUnderscoreMatch)!.slice(2, -2);
      nodes.push(
        <strong key={`bold-${match.index}`} className="font-semibold">
          {boldText}
        </strong>,
      );
    } else if (italicStarMatch || italicUnderscoreMatch) {
      const italicText = (italicStarMatch || italicUnderscoreMatch)!.slice(1, -1);
      nodes.push(
        <em key={`italic-${match.index}`} className="italic">
          {italicText}
        </em>,
      );
    }

    lastIndex = match.index + fullMatch.length;
  }

  if (lastIndex < content.length) {
    nodes.push(...splitTextByLine(content.slice(lastIndex)));
  }

  return nodes;
};
