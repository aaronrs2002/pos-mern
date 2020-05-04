import React, { Component } from "react";

class Removed extends Component {
  render() {
    return (
      <li>
        {this.props.removed.length > 0 ? <label>Remove:</label> : null}
        <ul className="inline">
          {this.props.removed
            ? this.props.removed.map((item, i) => {
                return (
                  <li key={i}>
                    <button
                      className="btn btn-info"
                      onClick={this.props.removeModification.bind(
                        this,
                        i,
                        "removed"
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

export default Removed;
