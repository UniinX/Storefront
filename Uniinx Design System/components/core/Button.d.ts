import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  tone?: "dark" | "light" | "accent";
  shape?: "pill" | "capsule";
  font?: "marcellus";
  style?: React.CSSProperties;
}
export declare const Button: React.FC<ButtonProps>;
export default Button;
