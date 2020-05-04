import React, { Component } from "react";

class Footer extends Component {
  render() {
    const date = new Date();
    const year = date.getFullYear();
    return (
      <footer className="footer bg-dark">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              {" "}
              {"Web-Presence LLC Arizona Copyright " + year}
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
