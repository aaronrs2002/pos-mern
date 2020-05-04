import React, { Component } from "react";

class ModifyDiv extends Component {
  render() {
    return (
      <div className="modifyDiv">
        <ul className="inline">
          <li>
            <select
              className="form-control"
              id="add"
              data-name={"add"}
              onChange={this.props.quantitySelect.bind(this, "add")}
            >
              <option>Add</option>
              {this.props.modifyOptions.length > 0
                ? this.props.modifyOptions.map((option, i) => {
                    return (
                      <option key={i} value={option._id}>
                        {option.name + " " + option.price}
                      </option>
                    );
                  })
                : null}
            </select>
          </li>
          <li>
            <select
              className="form-control"
              id="removed"
              onChange={this.props.quantitySelect.bind(this, "removed")}
            >
              <option>Take Out</option>
              {this.props.modifyOptions.length > 0
                ? this.props.modifyOptions.map((option, i) => {
                    return (
                      <option key={i} value={option._id}>
                        {option.name}
                      </option>
                    );
                  })
                : null}
            </select>
          </li>
        </ul>

        <textarea
          rows="5"
          className="form-control"
          placeholder="Add details"
          name="details"
        ></textarea>
      </div>
    );
  }
}

export default ModifyDiv;
