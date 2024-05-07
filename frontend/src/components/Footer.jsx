import React, { Component } from 'react'
import { Container, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';


export class Footer extends Component {
	render() {
		return (
            <Container >
                <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
                    <div className="col-md-4 d-flex align-items-center">
                        <Link to="https://github.com/Navitq/task_7" className="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1">
                            <Image src="./img/GitHub_Logo.png" height="30"/>
                        </Link>
                        <span className="mb-3 mb-md-0 text-body-secondary">{this.props.t("footer.protection")}</span>
                    </div>

                    <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
                        <li className="ms-3"><Link className="text-body-secondary" to="https://github.com/Navitq/task_7"><Image src="./img/facebook.svg" height="30"/></Link></li>
                        <li className="ms-3"><Link className="text-body-secondary" to="https://github.com/Navitq/task_7"><Image src="./img/insta.svg" height="30"/></Link></li>
                        <li className="ms-3"><Link className="text-body-secondary" to="https://github.com/Navitq/task_7"><Image src="./img/twitter.svg" height="30"/></Link></li>
                    </ul>
                </footer>
            </Container>
				);
			}
}

export default Footer;