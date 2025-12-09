import React from "react";

type IconProps = {
  name: string;
  width?: number;
  height?: number;
  className?: string;
};

const Icon: React.FC<IconProps> = ({ name, width = 20, height = 20, className = "" }) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      aria-hidden="true"
      fill="none"
    >
      <use href={`/icons.svg#${name}`} />
    </svg>
  );
};

export default Icon;