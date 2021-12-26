import React from "react";
import "../css/component_style/InputField.scss";

interface IInputField {
  name: string;
  placeholder: string;
  error?: string;
  type?: string;
  value: string,
  onChange: (e: React.ChangeEvent<any>) => void;
}

const InputField: React.FC<IInputField> = (props) => {

  return (
    <div>
      <input
        type= {props.type ? props.type : "text"}
        name={props.name}
        id={props.name}
        placeholder={props.placeholder}
        value = {props.value}
        onChange = {props.onChange}
      />
      {props.error && <div className="error_field">{props.error}</div>}
    </div>
  );
};

export default InputField;
