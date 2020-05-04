import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import { connect } from "react-redux";
import { getItems, addItem } from "../actions/itemActions";
import PropTypes from "prop-types";
import validate from "./Validate";

class AddItem extends Component {
  static propTypes = {
    getItems: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool
  };

  componentDidMount() {
    this.props.getItems();
  }
  onSubmit = e => {
    e.preventDefault();

    const canModify = document.querySelector("select[name='canModify']").value;
    const modifyOption = document.querySelector("select[name='modifyOption']")
      .value;
    const category = document.querySelector("input[name='category']").value;
    const newItem = {
      category: category.toUpperCase().trim(),
      name: document.querySelector("input[name='name']").value,
      description: document.querySelector("input[name='description']").value,
      price: Number(document.querySelector("input[name='price']").value),
      quantity: Number(document.querySelector("input[name='quantity']").value),
      canModify: canModify,
      modifyOption: modifyOption
    };

    validate();

    if (validate() !== false) {
      this.props.addItem(newItem);
      this.props.clearForms();
    }
  };

  clearDropDown = () => {
    document.querySelector("#categoryDropDown").selectedIndex = 0;
  };

  render() {
    return (
      <div id="addItem">
        <Form onSubmit={this.onSubmit}>
          <FormGroup>
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
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>

            <label>Is this item a side modification?</label>
            <select name="modifyOption" className="form-control">
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>

            <button
              className="btn btn-danger btn-block"
              style={{ marginTop: "3rem" }}
            >
              Add Item
            </button>
          </FormGroup>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  item: state.item,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { getItems, addItem })(AddItem);
