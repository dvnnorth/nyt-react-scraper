import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Nav, NavItem, NavLink } from 'reactstrap';

const TopNav = props => (
  <div className="nav-scroller py-1 mb-2">
    <Nav>
      <NavItem>
        <NavLink tag={Link} to="/home">Home</NavLink>
      </NavItem>
      <NavItem>
        <NavLink tag={Link} to="/articles">Saved Articles</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="#" onClick={props.handleScrape}>Scrape</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="#" className="text-danger" onClick={props.handleClear}>Clear</NavLink>
      </NavItem>
    </Nav>
  </div>
);

TopNav.propTypes = {
  handleScrape: PropTypes.func,
  handleClear: PropTypes.func
};

export default TopNav;