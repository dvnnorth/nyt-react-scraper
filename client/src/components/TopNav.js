import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Nav, NavItem, NavLink } from 'reactstrap';

const TopNav = props => (
  <div className="nav-scroller py-1 mb-2">
    <Nav>
      <NavItem>
        <NavLink tag={Link} to="/home">Home</NavLink>
      </NavItem>
      <NavItem>
        <NavLink tag={Link} to="/articles">Articles</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="#" onClick={props.scrape}>Scrape</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="#" className="text-danger" onClick={props.clear}>Clear</NavLink>
      </NavItem>
    </Nav>
  </div>
);

export default TopNav;