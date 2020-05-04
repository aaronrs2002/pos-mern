import React, { Component } from "react";

class FuncOptions extends Component {
  render() {
    return (
      <div className="btn-group" role="group">
        <button
          className="btn btn-secondary active"
          data-func="add"
          onClick={this.props.updateFunc.bind(this, "add")}
        >
          Add Item
        </button>
        <button
          className="btn btn-secondary"
          data-func="edit"
          onClick={this.props.updateFunc.bind(this, "edit")}
        >
          Edit Item
        </button>
        <button
          className="btn btn-secondary"
          data-func="delete"
          onClick={this.props.updateFunc.bind(this, "delete")}
        >
          Delete Item
        </button>
      </div>
    );
  }
}

export default FuncOptions;
