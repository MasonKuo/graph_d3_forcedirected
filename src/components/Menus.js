import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import { Menu } from 'antd';
import Home from './Home';
import Charts from './Charts';
import Button from './Button';

class Menus extends Component{
  state = {
    current: '/Home',
  }
  handleClick = (e) => {
    this.setState({
      current: e.key,
    })
  }
  render() {
     return (
       <Menu
         onClick={this.handleClick}
         selectedKeys={[(window.location.pathname == '/' ? this.state.current : window.location.pathname)]}
         mode="horizontal"
         theme="dark"
         style={{ lineHeight: '64px' }}
         >
         <Menu.Item key="/Home"><Link to="/Home">Home</Link></Menu.Item>
         <Menu.Item key="/Charts"><Link to="/Charts">Charts</Link></Menu.Item>
         <Menu.Item key="/Button"><Link to="/Button">Button</Link></Menu.Item>
       </Menu>
     );
  }
}

export default Menus;
