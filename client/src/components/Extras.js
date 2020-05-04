import React, { Component } from "react";

class Extras extends Component {
  render() {
    return (
      <li>
        {this.props.extras.length > 0 ? <label>Add:</label> : null}
        <ul className="inline">
          {this.props.extras
            ? this.props.extras.map((item, i) => {
                return (
                  <li key={i}>
                    <button
                      className="btn btn-info"
                      onClick={this.props.removeModification.bind(
                        this,
                        i,
                        "minus"
                      )}
                    >
                      {item.name} <i className="far fa-window-close"></i>
                    </button>
                  </li>
                );
              })
            : null}
        </ul>
      </li>
    );
  }
}

export default Extras;
