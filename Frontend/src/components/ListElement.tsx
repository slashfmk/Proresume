import React from 'react';
import "../css/component_style/ListElement.scss"
import { BsCalendarCheck } from 'react-icons/bs'

interface IListElement {
    title: string;
    startDate: string;
    endDate: string;
    description: string;
}

const ListElement: React.FC<IListElement> = (props) => {
    return (
        <div className="element">
        {props.title} - <BsCalendarCheck /> {props.startDate}-{props.endDate}
        <p>{props.description}</p>
        </div>
    )
}

export default ListElement;