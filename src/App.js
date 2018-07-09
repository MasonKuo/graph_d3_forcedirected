import React, { Component } from 'react';
import { Layout } from 'antd';
import { Link, Route } from 'react-router-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import Menus from './components/Menus'
import logo from './logo.svg';
import './App.css';
import Home from './components/Home';
import Charts from './components/Charts';
import Button from './components/Button';

const { Header, Footer, Sider, Content } = Layout;

class App extends Component {
  render() {
    return (
      <Router>
        <Layout>
          <Header><Menus></Menus></Header>
          <Content>
            <Route path="/Home" component={Home}></Route>
            <Route path="/Charts" component={Charts}></Route>
            <Route path="/Button" component={Button}></Route>
          </Content>
          <Footer>Footer</Footer>
        </Layout>
      </Router>
    );
  }
}

export default App;
