import * as React from "react";

interface Props {
  children?: React.ReactNode;
}

const CustomColor = ({ children }: Props) => {
  const extractText = (node: React.ReactNode): string => {
    if (typeof node === "string") {
      return node;
    }
    if (React.isValidElement(node)) {
      if (node.props.children) {
        return React.Children.toArray(node.props.children)
          .map(extractText)
          .join('');
      }
      return '';
    }
    if (Array.isArray(node)) {
      return node.map(extractText).join('');
    }
    return '';
  };

  const textToProcess = extractText(children);
  const colorRegex = /\[#([0-9A-Fa-f]{3,6})\](.*?)\[#\1\]/g;

  const parts = textToProcess.split(colorRegex);
  const renderedParts = parts.map((part, index) => {
    if (index % 3 === 0) {
      return <span key={index}>{part}</span>; 
    } else if (index % 3 === 1) {
      const color = `#${part}`;
      return (
        <span key={index} style={{ color }}>
          {parts[index + 1]}
        </span>
      );
    }
    return null;
  });

  return <>{renderedParts}</>;
};

export default CustomColor;