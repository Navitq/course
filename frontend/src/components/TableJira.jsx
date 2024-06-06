import React, {useEffect, useState} from "react";

import { Table } from "react-bootstrap";

function TableJira(props) {
    let [table, setTable] = useState(props.t("Jira.noTasks"))
    function header() {
        return (
            <thead>
                <tr>
                    <th>{}</th>
                    <th>{}</th>
                    <th>{}</th>
                    <th>{}</th>
                    <th>{}</th>
                    <th>{}</th>
                    <th>{}</th>
                </tr>
            </thead>
        )
    }

    function body() {
        let body = props.data.map((el)=>{
            let line = el.map((el)=>{
                return(
                <tr>
                    <td>{}</td>
                    <td>{}</td>
                    <td>{}</td>
                    <td>{}</td>
                    <td>{}</td>
                    <td>{}</td>
                    <td>{}</td>
                </tr>
                )
            })
            return line
        })
        return (
            <tbody>
                {body}
            </tbody>
        )
    }

    useEffect(()=>{
        let head =  header();
        let body = body();
        setTable(()=>{
            [...head, ...body]
        })
    },[props.data])

    return (
        <Table>
            {table}
        </Table>
    );
}

export default TableJira;
