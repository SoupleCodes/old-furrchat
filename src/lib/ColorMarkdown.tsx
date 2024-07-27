import * as React from "react";

interface Props {
  children?: React.ReactNode;
}

const CustomColor = ({ children }: Props) => {
  const colorRegex = /\[#([0-9A-Fa-f]{3,6})\](.*?)\[#\1\]/g;

  let textToProcess = "";
  if (typeof children === "string") {
    textToProcess = children;
  } else if (React.isValidElement(children)) {
    textToProcess = children.props?.children || "";
  } else if (Array.isArray(children)) {
    textToProcess = children.join("");
  }

  const parts = textToProcess.split(colorRegex);
  const renderedParts = parts.map((part, index) => {
    if (index % 3 === 0) {
      return <span key={part}>{part}</span>;
    } else if (index % 3 === 1) {
      const color = `#${part.substring(2, 8)}`;
      return (
        <span key={`${index}-${color}`} style={{ color }}>
          {parts[index + 1]}
        </span>
      );
    }
    return null;
  });

  return <>{renderedParts}</>;
};

export default CustomColor;