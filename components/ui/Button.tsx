import React from "react";

type VariantType = "default" | "secondary" | "customGreen";

interface customBtn {
  children?: React.ReactNode;
  variant?: VariantType;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export const Button = ({
  children,
  variant,
  onClick,
  className,
  disabled,
  type = "button",
}: customBtn) => {
  const variants: Record<VariantType, string> = {
    default: "px-4 py-2 rounded font-medium border",
    secondary:
      "flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-300 shadow-md hover:shadow-lg",
    customGreen:
      "flex-1 bg-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-300 shadow-md hover:shadow-lg",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variant ? variants[variant] : variants.default} ${className ?? ""} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
};
