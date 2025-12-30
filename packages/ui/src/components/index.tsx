import React from "react";

// Placeholder for UI components
export function createComponent<T extends React.HTMLAttributes<HTMLElement>>(
  displayName: string
) {
  return ({ className = "", ...props }: T) => {
    return (
      <div className={className} {...(props as any)}>
        {props.children}
      </div>
    );
  };
}
