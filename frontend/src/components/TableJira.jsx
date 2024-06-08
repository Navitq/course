import React, { useEffect, useState, useRef } from "react";

import { Table } from "react-bootstrap";

import { v4 as uuidv4 } from "uuid";
import Pagination from "react-bootstrap/Pagination";
import { Container } from "react-bootstrap";

import { NavLink } from "react-router-dom";

function TableJira(props) {
    let paginationRef = useRef([])
    let tableRef = useRef([])

    let startTable = (
        <tbody key={uuidv4()}>
            <tr>
                <td
                    id="tb-cell__no-element"
                    className="text-center"
                    colSpan={"100%"}
                >
                    {props.t("Jira.noSupportRequest")}
                </td>
            </tr>
        </tbody>
    );
    let [table, setTable] = useState(startTable);
    let [items, setItems] = useState([]);
    function header() {
        return [
            <thead key={uuidv4()}>
                <tr>
                    <th>№</th>
                    <th>{props.t("Jira.description")}</th>
                    <th>{props.t("Jira.priority")}</th>
                    <th>{props.t("Jira.status")}</th>
                    <th>{props.t("Jira.collection")}</th>
                    <th>{props.t("Jira.collectionId")}</th>
                    <th>{props.t("Jira.pageLink")}</th>
                    <th>{props.t("Jira.jiraLink")}</th>
                </tr>
            </thead>,
        ];
    }

    function changePage(e){
        e.preventDefault();
        for(let i =0;i < paginationRef.current.length;++i){
            if(paginationRef.current[i] == undefined){
                continue
            }
            paginationRef.current[i].className = "page-item";
        }
        openNewPage(e.currentTarget.dataset.pageNumber)
        e.currentTarget.parentElement.className = "page-item active";
    }

    function openNewPage(num){
        for(let i =0;i < tableRef.current.length;++i){
            if(tableRef.current[i] == undefined){
                continue
            }
            if(tableRef.current[i].className == `pagination${num}`){
                tableRef.current[i].style = "display: table-row"
                continue;
            }
            tableRef.current[i].style = "display: none"
        }
        console.log(num)
    }

    function mainBody() {
        let currentBody = props.data.issues.map((el, index) => {
            return (
                <tr
                    key={uuidv4()}
                    className={"pagination" + Math.floor(index / 10)}
                    style={
                        Math.floor(index / 10) == 0 ? {} : { display: "none" }
                    }
                    ref={(el)=>{tableRef.current.push(el)}}
                >
                    <td>
                        <NavLink
                            className="nav-link active"
                            variant="primary"
                            to={`https://courseprod.atlassian.net/browse/${el.key}`}
                            style={{ width: "100%" }}
                        >
                            {index + 1}
                        </NavLink>
                    </td>
                    <td>
                        <NavLink
                            className="nav-link active"
                            variant="primary"
                            to={`https://courseprod.atlassian.net/browse/${el.key}`}
                            style={{ width: "100%" }}
                        >
                            {el.fields.description.content[0].content[0].text}
                        </NavLink>
                    </td>
                    <td>
                        <NavLink
                            className="nav-link active"
                            variant="primary"
                            to={`https://courseprod.atlassian.net/browse/${el.key}`}
                            style={{ width: "100%" }}
                        >
                            {props.t(
                                `Jira.${el.fields.priority.name.toLowerCase()}`
                            )}{" "}
                        </NavLink>
                    </td>
                    <td>
                        <NavLink
                            className="nav-link active"
                            variant="primary"
                            to={`https://courseprod.atlassian.net/browse/${el.key}`}
                            style={{ width: "100%" }}
                        >
                            {el.fields.status.name}
                        </NavLink>
                    </td>
                    <td>
                        <NavLink
                            className="nav-link active"
                            variant="primary"
                            to={`https://courseprod.atlassian.net/browse/${el.key}`}
                            style={{ width: "100%" }}
                        >
                            {el.fields["customfield_10034"] != "undefined"
                                ? el.fields["customfield_10034"]
                                : "----"}
                        </NavLink>
                    </td>
                    <td>
                        <NavLink
                            className="nav-link active"
                            variant="primary"
                            to={`https://courseprod.atlassian.net/browse/${el.key}`}
                            style={{ width: "100%" }}
                        >
                            {el.fields["customfield_10035"] != "undefined"
                                ? el.fields["customfield_10035"]
                                : "----"}
                        </NavLink>
                    </td>
                    <td>
                        <NavLink
                            className="nav-link active"
                            variant="primary"
                            to={el.fields["customfield_10033"]}
                            style={{ width: "100%" }}
                        >
                            {el.fields["customfield_10033"]}
                        </NavLink>
                    </td>
                    <td>
                        <NavLink
                            className="nav-link active"
                            variant="primary"
                            to={`https://courseprod.atlassian.net/browse/${el.key}`}
                            style={{ width: "100%" }}
                        >
                            {`https://courseprod.atlassian.net/browse/${el.key}`}
                        </NavLink>
                    </td>
                </tr>
            );
        });
        return [<tbody key={uuidv4()}>{currentBody}</tbody>];
    }

    useEffect(() => {
        console.log(props.data);
        let head = header();
        let body;
        console.log(props.data);
        if (props.data && props.data.issues.length > 0) {
            body = mainBody();
            let itemsScreen = [];
            for (
                let number = 0;
                number < Math.ceil(props.data.issues.length / 10);
                number++
            ) {
                if (Math.ceil(props.data.issues.length / 10) <= 1) {
                    break;
                }
                
                itemsScreen.push(
                    <Pagination.Item onClick={changePage} ref={(el) => {paginationRef.current.push(el)}}  key={uuidv4()} data-page-number={number} active={number == 0 ? true : false}>
                        {number + 1}
                    </Pagination.Item>
                );
            }
            setItems((prev)=>{
                return itemsScreen
            })
        } else {
            body = [
                <tbody key={uuidv4()}>
                    <tr>
                        <td
                            id="tb-cell__no-element"
                            className="text-center"
                            colSpan={"100%"}
                        >
                            {props.t("Jira.noSupportRequest")}
                        </td>
                    </tr>
                </tbody>,
            ];
        }

        setTable(() => {
            return [...head, ...body];
        });
    }, [props.data]);

    return (
        <>
            <Table>{table}</Table>
            <Container className="px-0 d-flex justify-content-center">
                <Pagination>{items}</Pagination>
            </Container>
        </>
    );
}

export default TableJira;
