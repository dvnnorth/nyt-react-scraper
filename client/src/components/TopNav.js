import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Nav, NavItem, NavLink } from 'reactstrap';

const TopNav = props => (
	<div class="nav-scroller py-1 mb-2">
		<Nav>
			<NavItem>
				<NavLink><Link to="/">Home</Link></NavLink>
			</NavItem>
			<NavItem>
				<NavLink><Link to="/articles">Articles</Link></NavLink>
			</NavItem>
			<NavItem>
				<NavLink><Link to="#" onClick={props.scrape}>Scrape</Link></NavLink>
			</NavItem>
			<NavItem>
				<NavLink><Link className="text-danger" to="#" onClick={props.clear}>Clear</Link></NavLink>
			</NavItem>
		</Nav>
	</div>
);

export default TopNav;