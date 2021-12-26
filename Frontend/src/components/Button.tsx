import React from "react";
import "../css/component_style/Button.scss";

interface IButton {
  title: string;
  variant?: "neutral" | "default";
  onClick?: () => void;
  type?: string;
  style?: string;
}
// this a customized button component. this takes two props which are title and variant.
const Button: React.FC<IButton> = (props) => {
  if (props.type) {
    return (
      <button type="submit" onClick={props.onClick} className={`btn btn--${props.variant && props.variant}`}>
      {props.title}
      </button>
    );
  }
  return (
    <button onClick={props.onClick} className={`btn btn--${props.variant && props.variant}`}>
      {props.title}
    </button>
  );
};

export default Button;
