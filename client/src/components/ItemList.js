import React, { Component } from "react";
import { connect } from "react-redux";
import { getItems } from "../actions/itemActions";
import PropTypes from "prop-types";

class ItemList extends Component {
  static propTypes = {
    getItems: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool
  };

  componentDidMount() {
    this.props.getItems();
  }

  selectedItem = () => {
    const { items } = this.props.item;

    const item = document.querySelector("#editSelect").value;
    for (let i = 0; i < items.length; i++) {
      if (item === items[i].name) {
        document.querySelector("input[name='_id']").value = items[i]._id;
        //document.querySelector("input[name='id']").value = items[i].id;
        document.querySelector("input[name='name']").value = items[i].name;
        document.querySelector("input[name='description']").value =
          items[i].description;
        document.querySelector("input[name='price']").value = items[i].price;
        document.querySelector("input[name='quantity']").value =
          items[i].quantity;
        document.querySelector("input[name='category']").value =
          items[i].category;
        document.querySelector("select[name='canModify']").value =
          items[i].canModify;
        document.querySelector("select[name='modifyOption']").value =
          items[i].modifyOption;
      }
    }
  };

  render() {
    const { items } = this.props.item;
    const editFunc = this.props.editFunc;
    return (
      <select
        id={editFunc + "Select"}
        className="form-control"
        onChange={this.selectedItem}
      >
        <option>Select item</option>;
        {items.length > 0 ? (
          items.map((item, i) => {
            return (
              <option key={i} value={item.name}>
                {item.name}
              </option>
            );
          })
        ) : (
          <div className="loader"></div>
        )}
      </select>
    );
  }
}

//export default ItemList;

const mapStateToProps = state => ({
  item: state.item,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { getItems })(ItemList);
