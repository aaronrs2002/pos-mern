import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getItems,
  addItem,
  updateItem,
  deleteItem
} from "../actions/itemActions";
import PropTypes from "prop-types";

class AddEdit extends Component {
  state = {
    id: Number(),
    category: "",
    name: "",
    description: "",
    price: Number(0),
    quantity: Number(0),
    modifyOption: Boolean,
    canModify: Boolean,
    items: []
  };

  static propTypes = {
    getItems: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool
  };

  componentDidMount() {
    this.props.getItems();
  }

  onDeleteClick = id => {
    this.props.deleteItem(id);
  };

  addUpdate() {
    let message = "Your item has been modified.";
    let id = document.querySelector("input[name='id']").value;
    let items = [];

    if (id.length === 0) {
      id = items.length + 1;
      message = "Your item has been added.";
    }

    id = parseInt(id);
    const category = document.querySelector("input[name='category']");
    const categoryVal = category.value;
    const name = document.querySelector("input[name='name']");
    const nameVal = name.value;
    const description = document.querySelector("input[name='description']");
    const descriptionVal = description.value;
    const price = document.querySelector("input[name='price']");
    const priceVal = price.value;
    const modify = document.querySelector("select[name='modify']").value;
    const substitution = document.querySelector("select[name='substitution']")
      .value;

    if (isNaN(priceVal)) {
      price.classList.add("error");
      this.showMessage("danger", "This needs to be a number.");
      return false;
    } else {
      price.classList.remove("error");
    }

    const quantity = document.querySelector("input[name='quantity']");
    const quantityVal = quantity.value;
    if (isNaN(quantityVal)) {
      quantity.classList.add("error");
      this.showMessage("danger", "This needs to be a number.");
      return false;
    } else {
      quantity.classList.remove("error");
    }

    const values = [
      categoryVal,
      nameVal,
      descriptionVal,
      priceVal,
      quantityVal
    ];
    const inputs = [category, name, description, price, quantity];
    for (let i = 0; i < inputs.length; i++) {
      if (values[i].length === 0) {
        inputs[i].classList.add("error");
        this.showMessage("danger", "Please fix errors below.");
        return false;
      } else {
        inputs[i].classList.remove("error");
      }
    }

    const theItem = {
      id: id,
      category: categoryVal,
      name: nameVal,
      description: descriptionVal,
      price: priceVal,
      quantity: quantityVal,
      modifyOption: substitution,
      canModify: modify
    };

    if (this.state.editFunc === "add") {
      this.props.addItem(theItem);
    } else {
      this.props.updateItem(theItem);
    }

    this.props.showMessage("success", message);
    this.props.clearForms();
  }

  render() {
    const { items } = this.props.item;
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="form-group">
            <input type="hidden" name="id" />
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
            <select name="modify" className="form-control">
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>

            <label>Is this item a side modification?</label>
            <select name="substitution" className="form-control">
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>

            <button
              className="form-control btn-success"
              onClick={this.addUpdate}
            >
              {this.props.editFunc === "add" ? "Add Item" : "Edit item"}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

//export default AddEdit;

const mapStateToProps = state => ({
  item: state.item,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {
  addItem,
  updateItem,
  getItems,
  deleteItem
})(AddEdit);
