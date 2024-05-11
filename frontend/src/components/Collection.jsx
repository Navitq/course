import React, {useEffect, useState} from 'react'

import Table from 'react-bootstrap/Table';
import { socket } from './socket';
import TableCell from './TableCell'

function Collection(props) {
    let [theader, setTheader] = useState([]);
    let [tbody, setBody] = useState([]);


    useEffect(()=>{
        socket.emit("get_col", JSON.stringify({get_col: props.col_id}))
        socket.on("got_col", (col, data)=>{
            let head = (<TableCell elem={col} type="header"></TableCell>);
            let body =( <TableCell elem={data} type="body"></TableCell>);
            setTheader((prev)=>{
                return [head]
            })
            setBody((prev)=>{
                return [body]
            })
        })
    })

  return (
    <Table striped bordered hover>
        <thead>
            {theader}
        </thead>
        <tbody>
            {tbody}
        </tbody>
    </Table>
  );
}

export default Collection;