import React from 'react';
import "../css/component_style/Avatar.scss";

interface IAvatar {
    url: string;
}


const Avatar: React.FC<IAvatar> = (props) => {

    return (
        <div className="avatar" style={{border: "solid 7px #ccc"}} >
        <img src={props.url} />
        </div>
    );
}

export default Avatar;