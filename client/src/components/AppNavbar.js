import React, { Component, Fragment } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container,
} from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import RegisterModal from "./auth/RegisterModal";
import LoginModal from "./auth/LoginModal";
import Logout from "./auth/Logout";

class AppNavbar extends Component {
  state = {
    isOpen: false,
  };

  static propTypes = {
    auth: PropTypes.object.isRequired,
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  render() {
    const { isAuthenticated, user } = this.props.auth;
    let isAdmin = false;
    if (user) {
      sessionStorage.setItem("user", user.email);
      isAdmin = user.adminUser;
    } else {
      sessionStorage.setItem("user", "");
    }

    const authLinks = (
      <Fragment>
        <NavItem>
          <span className="nav-link mr-3">
            <h5>{user ? `Welcome ${user.name}` : ""}</h5>
          </span>
        </NavItem>
        {isAdmin === true ? (
          <NavItem>
            <a
              className="nav-link"
              href="#"
              onClick={this.props.changeView.bind(this, "admin")}
            >
              <h5>Admin</h5>
            </a>
          </NavItem>
        ) : null}
        <NavItem>
          <a
            className="nav-link"
            href="#"
            onClick={this.props.changeView.bind(this, "sales")}
          >
            <h5>Sales</h5>
          </a>
        </NavItem>
        {isAdmin === true ? (
          <NavItem>
            <a
              className="nav-link"
              href="#"
              onClick={this.props.changeView.bind(this, "analytics")}
            >
              <h5>Analytics</h5>
            </a>
          </NavItem>
        ) : null}
        <NavItem>
          <h5>
            <Logout />
          </h5>
        </NavItem>
      </Fragment>
    );

    const guestLinks = (
      <Fragment>
        <NavItem>
          <RegisterModal />
        </NavItem>
        <NavItem>
          <LoginModal />
        </NavItem>

        <NavItem>
          <a
            className="nav-link"
            href="#"
            onClick={this.props.changeView.bind(this, "sales")}
          >
            <h5>Sales</h5>
          </a>
        </NavItem>
      </Fragment>
    );
    return (
      <div>
        <Navbar color="dark" dark expand="sm" className="mb-5">
          <Container>
            <NavbarBrand href="/">
              {" "}
              <img src="https://www.mechanized-aesthetics.net/MA-2015/img/MA_Logo.png" />
            </NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                {isAuthenticated ? authLinks : guestLinks}
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, null)(AppNavbar);
