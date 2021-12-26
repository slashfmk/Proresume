import React, {useEffect} from 'react';
import '../css/pages_style/Nav.scss';
import NavItem from "../components/NavItem";
import Avatar from "../components/Avatar";
import {Link, useNavigate, useParams} from "react-router-dom";
import Button from "../components/Button";
import storage from "../utils/storage";


const Nav: React.FC<any> = () => {

    const param = useParams();
    const navigate = useNavigate();

    const logout = () => {
        storage.deleteToken();
        navigate('/');
    }

    return <div className={"left_side"}>

        <div className={"pro_id"}>
            <Link to={'/home'} className={"logo_header"}><h1>Pro resume</h1></Link>
        </div>

        <nav className={"menu"}>

            <ul className="menu__list">

                {/*<li className="menu__list__item">*/}

                {/*    <Avatar*/}
                {/*        url={"https://images.pexels.com/photos/2744193/pexels-photo-2744193.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"}*/}
                {/*    />*/}
                {/*</li>*/}

                <li className="menu__list__item">
                    <NavItem
                        title={"Education"}
                        detail={"Anything you can think of your life education"}
                        url={`/education/${param.resumeId}`}
                    />
                </li>
                <li className="menu__list__item">
                    <NavItem
                        title={"Experience"}
                        detail={"s simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, "}
                        url={`/experience/${param.resumeId}`}
                    />
                </li>
                <li className="menu__list__item">
                    <NavItem
                        title={"Skills"}
                        detail={"Anything you can think of your life education"}
                        url={`/skills/${param.resumeId}`}
                    />
                </li>

                <li>
                    <Button title={"Logout"} onClick={logout}/>
                </li>

            </ul>
        </nav>

    </div>

}

export default Nav;
