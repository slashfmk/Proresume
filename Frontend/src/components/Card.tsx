import React, { ReactNode } from "react";
import "../css/component_style/Card.scss";


interface ICard {
  title: string;
  subTitle?: string;
  children?: ReactNode;
}

const Card: React.FC<ICard> = (props) => {
  return (
    <div className="card">
      <h1>{props.title}</h1>
      <h2>{props.subTitle}</h2>
      {props.children}
    </div>
  );
};

export default Card;