import React, { Component } from "react";
import DeleteItem from "./DeleteItem";

class UserAdmin extends Component {
  populateUser(editFunc) {
    if (editFunc === "deleteUser") {
      return false;
    }
    const whichUser = document.getElementById(editFunc + "Select").value;
    const users = this.props.users;

    for (let i = 0; i < users.length; i++) {
      if (users[i].user === whichUser) {
        document.querySelector("input[name='user']").value = users[i].user;
        document.querySelector("input[name='fName']").value = users[i].fName;
        document.querySelector("input[name='lName']").value = users[i].lName;
        document.querySelector("input[name='phone']").value = users[i].phone;
      }
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <hr />
          <h2>Users</h2>

          <div className="btn-group" role="group">
            <button
              className="btn btn-secondary active"
              data-func="addUser"
              onClick={this.props.updateFunc.bind(this, "addUser")}
            >
              Add User
            </button>
            <button
              className="btn btn-secondary"
              data-func="editUser"
              onClick={this.props.updateFunc.bind(this, "editUser")}
            >
              Edit User
            </button>
            <button
              className="btn btn-secondary"
              data-func="deleteUser"
              onClick={this.props.updateFunc.bind(this, "deleteUser")}
            >
              Delete User
            </button>
          </div>
          {this.props.editFunc === "editUser" ||
          this.props.editFunc === "deleteUser" ? (
            <select
              className="form-control"
              id={this.props.editFunc + "Select"}
              onChange={this.populateUser.bind(this, this.props.editFunc)}
            >
              <option value="">Select User</option>
              {this.props.users.map((user, i) => {
                return (
                  <option key={i} value={user.user}>
                    {user.fName + " " + user.lName}
                  </option>
                );
              })}
            </select>
          ) : null}

          {this.props.editFunc === "deleteUser" ? (
            <DeleteItem deleteItem={this.props.deleteItem} />
          ) : null}
          {this.props.editFunc !== "deleteUser" ? (
            <div className="form-group">
              <div class="form-group">
                <input
                  type="email"
                  className="form-control"
                  name="user"
                  placeholder="Email"
                />

                <input
                  type="text"
                  className="form-control"
                  name="fName"
                  placeholder="First Name"
                />
                <input
                  type="text"
                  className="form-control"
                  name="lName"
                  placeholder="Last Name"
                />
                <input
                  type="text"
                  className="form-control"
                  name="phone"
                  placeholder="Phone"
                />
                <button
                  className="btn btn-block btn-success"
                  onClick={this.props.addEditUser}
                >
                  {this.props.editFunc === "addUser" ? "Add User" : "Edit User"}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default UserAdmin;
