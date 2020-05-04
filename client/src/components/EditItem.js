import React, { Component } from "react";
import { FormGroup } from "reactstrap";
import { connect } from "react-redux";
import { updateItem } from "../actions/itemActions";
import PropTypes from "prop-types";
import validate from "./Validate";

class EditItem extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool
  };

  updateThis = () => {
    const category = document.querySelector("input[name='category']").value;
    const item = {
      id: document.querySelector("input[name='_id']").value,
      category: category.toUpperCase().trim(),
      name: document.querySelector("input[name='name']").value,
      description: document.querySelector("input[name='description']").value,
      price: Number(document.querySelector("input[name='price']").value),
      quantity: Number(document.querySelector("input[name='quantity']").value),
      modifyOption: document.querySelector("select[name='modifyOption']").value,
      canModify: document.querySelector("select[name='canModify']").value
    };

    validate();

    if (validate() !== false) {
      this.props.updateItem(item);
      this.props.clearForms();
    }
  };

  render() {
    return (
      <div>
        <FormGroup>
          <input type="hidden" name="_id" />

          <input
            type="text"
            name="category"
            className="form-control"
            placeholder="category"
            onClick={this.clearDropDown}
          />
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="name"
          />
          <input
            type="text"
            name="description"
            className="form-control"
            placeholder="description"
          />
          <input
            type="text"
            name="price"
            className="form-control"
            placeholder="price ex. 00.00"
          />
          <input
            type="text"
            name="quantity"
            className="form-control"
            placeholder="quantity in stock (numbers only)"
          />
          <label>Can this item be modified?</label>
          <select name="canModify" className="form-control">
            <option>Select One</option>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>

          <label>Is this item a side modification?</label>
          <select name="modifyOption" className="form-control">
            <option>Select One</option>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>

          <button
            className="btn btn-danger btn-block"
            style={{ marginTop: "3rem" }}
            onClick={this.updateThis}
          >
            Edit Item
          </button>
        </FormGroup>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  item: state.item,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { updateItem })(EditItem);
