import React from 'react';
import {BsCalendarCheck} from "react-icons/bs";
import '../css/component_style/Element.scss';

interface IElement {
    title: string;
    dateFrom: string;
    dateLast: string;
    children: React.ReactNode;
}

const Element: React.FC<IElement> = (props) => {

    return <div className="element">
        <div className={"element__header"}>
            <h1 className={"element__header__title"}>{props.title}</h1>
            <div className={"element__header__date"}><BsCalendarCheck
                style={{
                    fontSize: "18px",
                    position: "relative",
                    top: "4px",
                    left: "-10"
                }}/> {props.dateFrom} - {props.dateLast}
            </div>
        </div>

        <p className={"element__body"}>
            {props.children}
        </p>
    </div>
}

export default Element;

