import React, { Component } from "react";
import { connect } from "react-redux";
import { deleteItem } from "../actions/itemActions";
import PropTypes from "prop-types";

class DeleteItem extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool
  };
  showAlert() {
    document.querySelector("[role='alert']").classList.remove("hide");
  }

  hideAlert() {
    document.querySelector(".alert-danger").classList.add("hide");
  }

  deleteThis = () => {
    const id = document.querySelector("#deleteSelect").value;
    this.props.deleteItem(id);

    document.querySelector(".alert-danger").classList.add("hide");
  };

  render() {
    const { items } = this.props.item;
    return (
      <React.Fragment>
        <select id="deleteSelect" className="form-control">
          <option>Select item</option>
          {items.length > 0
            ? items.map((item, i) => {
                return (
                  <option key={i} value={item._id}>
                    {item.name}
                  </option>
                );
              })
            : null}
        </select>
        <button
          className="btn btn-danger form-control"
          onClick={this.showAlert}
        >
          Delete
        </button>
        <div className="alert alert-danger hide" role="alert">
          <p>
            Are you sure you want to delete?{" "}
            <button onClick={this.deleteThis} className="btn btn-danger">
              YES
            </button>{" "}
            <button onClick={this.hideAlert} className="btn btn-secondary">
              NO
            </button>
          </p>
        </div>
      </React.Fragment>
    );
  }
}

//export default DeleteItem;

const mapStateToProps = state => ({
  item: state.item,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { deleteItem })(DeleteItem);
