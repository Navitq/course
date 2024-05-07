import React from 'react'
import { NavLink } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';



export default function StoragePageLinks(props) {

   async function logOut(){
   //    let resp = await fetch("/log_out",{
   //       method:"delete"
   //    })
   //    let mess = await resp.json()
   //    if(mess.auth === false){
   //       props.changeHeader(mess.auth)
   //    }
      
      
   }

   return (
      <>
         <Nav.Item>
            <NavLink to="/private"  className="nav-link">Your collection</NavLink>
         </Nav.Item>
         <Nav.Item>
            <div style={{cursor:"pointer"}} className="nav-link" onClick={logOut}>Log Out</div>
         </Nav.Item>
      </>
   )
}
