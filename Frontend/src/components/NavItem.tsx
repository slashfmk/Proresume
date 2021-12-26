import React from 'react';
import '../css/component_style/NavItem.scss';
import {NavLink, To} from "react-router-dom";


interface INavItem {
    title: string;
    detail: string;
    url?: To
}

const NavItem: React.FC<INavItem> = (props) => {

    // @ts-ignore
    return <NavLink className={"nav__item__link"} to={props.url}>
        <div className={"nav__item__container"}>
            <h3>{props.title}</h3>
            <p>
                {props.detail}
            </p>
        </div>
    </NavLink>
}

export default NavItem;
