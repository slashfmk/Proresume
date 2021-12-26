import React from "react";
import "../css/component_style/CardOverview.scss";
import {FaCalendarTimes} from 'react-icons/fa';
import {useMutation, useQueryClient} from "react-query";
import axios from "axios";
import {apiUrl} from "../api/apiUrl";
import {Link, To} from "react-router-dom";

interface ICardOverview {
    title: string;
    date: string;
    id: number;
    onClickPrint?: React.MouseEventHandler<HTMLHeadingElement> | undefined;
    editLink?: string;

}

const CardOverview: React.FC<ICardOverview> = (props) => {


    const queryClient = useQueryClient();

    const mutation = useMutation(async () => {
        return await axios.delete(`${apiUrl}/resume/${props.id}`);
    }, ({
        onSuccess: async (data, variables) => {
            //  await storage.saveToken(data.da  navigate("/home");
            await queryClient.invalidateQueries('resumes');
        },
        onError: (error, variable) => {
            console.log(error);
        }
    }));


    // @ts-ignore
    return (
        <div className="card_overview">
            <h2 className="card_overview__title">{props.title}</h2>

            <div className="card_overview__date container container--2">
                <FaCalendarTimes className="card_overview__icons"/>
                <h2 className="card_overview__date" onClick={async () => await mutation.mutateAsync()}>{props.date}</h2>
            </div>

            <div className={"card_overview__date container container--3"}>
                <h4 onClick={() => mutation.mutateAsync()}>Delete</h4>
                {
                    //@ts-ignore
                    <Link to= {props.editLink}><h4>Edit</h4></Link>
                }

                <h4 onClick={props.onClickPrint}>Print</h4>
            </div>

        </div>
    );
};


export default CardOverview;

