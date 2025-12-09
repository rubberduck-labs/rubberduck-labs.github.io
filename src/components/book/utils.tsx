import { HandbookBlock } from "./types";
import { ElementType, ReactElement } from "react";

export const renderBlock = (
  block: HandbookBlock, index: number,
): ReactElement | null => {
  switch (block.type) {
    case 'heading': {
      const Tag = (`h${block.level}` as ElementType);
      return (
        <Tag key={index} className="text-lg sm:text-xl lg:text-3xl font-bold text-custom-dark dark:text-white mb-3 lg:mb-6">
          {block.text}
        </Tag>
      );
    }

    case 'paragraph':
      return (
        <p key={index} className={`mb-4 whitespace-pre-line ${block.size}`}>
          {block.text}
        </p>
      );

    case 'list':
      return (
        <ul key={index} className={`mb-4 list-disc pl-6 ${block.size}`}>
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );

    case 'centeredParagraph':
      return (
        <p key={index} className={`mb-4 text-center whitespace-pre-line ${block.size}`}>
          {block.text}
        </p>
      );

    case 'quote':
      return (
        <p key={index} className={`mb-4 whitespace-pre-line ${block.size} italic`}>
          {block.text}
        </p>
      );

    default: {
      return null;
    }
  }
};
