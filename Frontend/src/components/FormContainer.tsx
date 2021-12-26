import React, { ReactNode } from "react";
import "../css/component_style/FormContainer.scss";

interface IFormContainer {
  title: string;
  subTitle?: string;
  children?: ReactNode;
}

const FormContainer: React.FC<IFormContainer> = (props) => {
  return (
    <div className="form_container">
      <h1>{props.title}</h1>
      <h2>{props.subTitle}</h2>
      {props.children}
    </div>
  );
};

export default FormContainer;
