import React, { useEffect, useState } from "react";

import Container from "react-bootstrap"

import { useParams, useNavigate, NavLink } from "react-router-dom";

import TableJira from "./TableJira"
import { socket } from "./socket";

function JiraTasks(props) {
    let { user_id } = useParams();

    let [data, setData] = useState()

    useEffect(()=>{
        socket.on("got_jira_tasks",(dataJSON)=>{
            let localData = JSON.parse(dataJSON);
            setData(localData)
        })
        socket.emit("get_jira_tasks", JSON.stringify({user_id: props.user_id}))
    },[])

    return (
    <Container className="d-flex flex-column align-items-center px-0 my-4">
        <Container className="px-0 h3 mb-3">{props.t("Jira.header")}</Container>
        <Container className="px-0 filter__scroll" style={{overflow: "auto"}}>
            <TableJira data={data} user_id={user_id} t={props.t}></TableJira>
        </Container>
    </Container>
);
}

export default JiraTasks;
