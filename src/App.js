import React, {useState}  from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import logo from './logo.svg';
import './App.css';
import './ui.css';

import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';

import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'

import {Container, Row, Col, Card, Form } from "react-bootstrap";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckSquare, faCoffee, faHome } from '@fortawesome/fontawesome-free-solid'

import Sidebar from "react-sidebar";



import robot from './aris.js'
import Login from './components/login.js'


///////////////////  event  ///////////////////////////////
var rbt_update = new Event('rbt_update');
document.addEventListener('rbt_update', (e) => console.log("rbt updated ..."), false);

///////////////////   app     /////////////////////////////
function App() {
	const [state , setState] = useState({
		username : ""
    });

	let auth = getCookie("Authorization");
	
	if(auth === undefined){
		let onLogin = e=>setState({username : e});

		return <div className="App" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height:'100vh'}}>
		  <Login onLogin={onLogin}/>
		</div>
	}
	else{
		return <div className="App">
		  <Navbar/>
		  <Footer/>
		  <Main/>
		</div>;
    }
}

///////////////////   navbar  /////////////////////////////
class Navbar extends React.Component {
  constructor(props) {
    super(props);
  }



  render() {
	  return     <Nav variant="pills" activeKey="1" style={{backgroundColor : 'black'}}>
	        <NavDropdown title="Dropdown" id="nav-dropdown">
        <NavDropdown.Item eventKey="4.1">Action</NavDropdown.Item>
        <NavDropdown.Item eventKey="4.2">Another action</NavDropdown.Item>
        <NavDropdown.Item eventKey="4.3">Something else here</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item eventKey="4.4">Separated link</NavDropdown.Item>
      </NavDropdown>
      <Nav.Item>
        <Nav.Link eventKey="1" href="#/home">
          NavLink 1 content
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="2" title="Item">
          NavLink 2 content
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="3" disabled>
          NavLink 3 content
        </Nav.Link>
      </Nav.Item>
    </Nav>;
  }
}

///////////////////   footer  /////////////////////////////
class Footer extends React.Component {
  constructor(props) {
    super(props);
	this.state = {ret_code:0, ret_msg:"", send_msg:""};
  }

  render() {
	  return <table className="footer" style={{width: "100vw"}}>
		  <tr>
			<td>
				<p style={{margin: "0px 0px 0px 0px"}}>ret {this.state.ret_code} : {this.state.ret_msg}</p>
			</td>
			<td className="blink">{this.props.send_msg ? this.props.send_msg.data : ""}</td>
			<td>ready</td>
		  </tr>
		</table>;
  }
}

////////////////////  main    /////////////////////////////
class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
	  return <div className="main">
			<Container fluid>
                <Row>
                    <Col xs={2} id="sidebar-wrapper">      
                      <LeftSideBar />
                    </Col>
                    <Col  xs={10} id="page-content-wrapper">
                        this is a test
                    </Col> 
                </Row>
            </Container>
		  <button onClick={(e)=>{robot.send_cmd("en");}}>enable</button>
		  <button onClick={(e)=>{save_components();}}>disable</button>
		</div>;
  }
}

////////////////////  left side bar  //////////////////////
class LeftSideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarOpen: true
    };
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }
 
  onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open });
  }
 
  render() {
        return (
        <>
            <Nav className="col-md-12 d-none d-md-block bg-light sidebar"
            activeKey="/home"
            onSelect={selectedKey => alert(`selected ${selectedKey}`)}
            >
                <div className="sidebar-sticky"></div>
            <Nav.Item>
                <Nav.Link href="/home">Active</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="link-1">Link</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="link-2">Link</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="disabled" disabled>
                Disabled
                </Nav.Link>
            </Nav.Item>
            </Nav>

        </>
        );
  }
}





function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}


async function save_components(){
	let user = {
	  name: 'John',
	  surname: 'Smith'
	};

	let response = await fetch('/interface.txt', {
	  method: 'PUT',
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached

	  headers: {
		'Content-Type': 'application/json;charset=utf-8'
	  },
	  body: JSON.stringify(user)
	});
	if(!response.ok)alert("save file failed:" + response.statusText);
}


var component_id = 0;
function ListItem(props) {
  // Correct! There is no need to specify the key here:
  return <button>aaaa</button>;
}

var aaa = [<ListItem key={"component_" + (component_id++).toString()}></ListItem>
, <ListItem key={"component_" + (component_id++).toString()}></ListItem>];


aaa.push(<ListItem key={"component_" + (component_id++).toString()}></ListItem>);


////////////////////////////////// grid layout ///////////////
class MyFirstGrid extends React.Component {
  render() {
    // layout is an array of objects, see the demo for more complete usage
    const layout = [
      {i: 'a', x: 0, y: 0, w: 1, h: 2, static: true},
      {i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4},
      {i: 'c', x: 4, y: 0, w: 1, h: 2}
    ];
    return (
  <GridLayout className="layout" layout={layout} cols={12} rowHeight={30} width={1200} draggableHandle={".react-grid-dragHandleExample"}>
        <div key="a">a</div>
        <div key="b">b</div>
        <div key="c">c</div>
		<div key="4" data-grid={{x: 8, y: 0, w: 4, h: 3,}}>
          <span className="text">
            4 - Draggable with Handle
			<button className="text">aaa</button>
            <hr />
            <hr />
            <span className="react-grid-dragHandleExample">[DRAG HERE]</span>
            <hr />
            <hr />
          </span>
        </div>
      </GridLayout>
    )
  }
}







export default App;
