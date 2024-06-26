import React, { Component } from 'react'
import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Container } from 'react-bootstrap';

import AboutUs from "./AboutUs"
import SignIn from "./SignIn"
import SignUp from "./SignUp"
import NotFound from "./NotFound"
import Admin from "./Admin"
import CollectionsPrivate from "./CollectionsPrivate"
import CollectionsPublic from "./CollectionsPublic"
import Collection from "./Collection"
import { socket } from "./socket";
import ItemTemplate from "./ItemTemplate"
import TagPage from "./TagPage"
import PersonalPage from "./PersonalPage"
import SearchPage from './SearchPage';
import JiraTasks from './JiraTasks'

export default class MainContent extends Component {

	async componentDidMount() {
		await fetch(`${process.env.REACT_APP_HOST}/sign_in`)
        .then(response => response.json())
        .then((message)=>{
            if(message.auth == true){
                this.props.changeHeader(true);
            }  
        })
	}



	render() {
		return (
			<Container style={{flex:"1 1 auto"}} >
				<Routes >
					<Route exact path="/" element={<AboutUs t={this.props.t}></AboutUs>}></Route >
					<Route exact path="/sign_in"  element={!this.props.headerState?<SignIn redirectFun={this.props.changeHeader} t={this.props.t} />:<Navigate to="/private" />}></Route>
					<Route exact path="/sign_up" element={!this.props.headerState?<SignUp redirectFun={this.props.changeHeader} t={this.props.t} />:<Navigate to="/private" />}></Route>
					<Route exact path="/admin" element={this.props.adminState?<Admin t={this.props.t} />:<Navigate to="/sign_in" />}></Route>
					<Route exact path="/private" element={this.props.headerState?<CollectionsPrivate socket={socket} theme={this.props.theme} i18n={this.props.i18n} t={this.props.t} />:<Navigate to="/sign_in"/>}></Route>
					<Route exact path="/public" element={<CollectionsPublic t={this.props.t}/>}></Route>
					<Route exact path="/collection/:col_id" element={<Collection theme={this.props.theme} i18n={this.props.i18n} t={this.props.t}/>}></Route>
					<Route exact path="/collection/:col_id/:item_id" element={<ItemTemplate theme={this.props.theme} i18n={this.props.i18n} t={this.props.t}/>}></Route>
					<Route exact path="/tags/:tag" element={<TagPage theme={this.props.theme} i18n={this.props.i18n} t={this.props.t}/>}></Route>
					<Route exact path="/people/:user_id" element={<PersonalPage theme={this.props.theme} i18n={this.props.i18n} t={this.props.t}/>}></Route>
					<Route exact path="/search/:search_req" element={<SearchPage theme={this.props.theme} i18n={this.props.i18n} t={this.props.t}/>}></Route>
					<Route exact path="/jira/:user_id" element={this.props.headerState?<JiraTasks theme={this.props.theme} i18n={this.props.i18n} t={this.props.t}/>:<Navigate to="/sign_in"/>}></Route>
					<Route path="*" element={<NotFound t={this.props.t}></NotFound>} ></Route>
				</Routes >
			</Container>
		)
	}
}
