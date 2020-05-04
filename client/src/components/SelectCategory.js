import React, { Component } from "react";
import { connect } from "react-redux";
import { getItems } from "../actions/itemActions";
import PropTypes from "prop-types";

class SelectCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: this.props.items,
      categoryList: []
    };
    this.updateCategory = this.updateCategory.bind(this);
    this.clearDropDown = this.clearDropDown.bind(this);
  }
  updateCategory() {
    const category = document.getElementById("categoryDropDown").value;
    if (category !== "Existing categories") {
      document.querySelector("input[name='category']").value = category;
    }
  }

  static propTypes = {
    getItems: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool
  };

  componentDidMount() {
    this.props.getItems();

    let tempCategories = [];
    const { items } = this.props.item;

    console.log("items: " + JSON.stringify(items));

    for (let i = 0; i < items.length; i++) {
      let newItem = items[i].category;
      if (tempCategories.indexOf(newItem) === -1) {
        tempCategories.push(newItem);
      }
    }

    this.setState({
      categoryList: tempCategories
    });

    console.log("tempCategories: " + tempCategories);
  }

  clearDropDown() {
    document.querySelector("#categoryDropDown").selectedIndex = 0;
  }

  render() {
    let list = this.state.categoryList;

    return (
      <div>
        <label>Choose from existing category, or write a new one.</label>
        <select
          onChange={this.updateCategory}
          className="form-control"
          id="categoryDropDown"
        >
          <option>Existing categories</option>
          {list.length > 0 ? (
            list.map(i => {
              if (list.indexOf(list[i]) === -1) {
                return (
                  <option key={i} value={i}>
                    {i}
                  </option>
                );
              }
            })
          ) : (
            <div className="loader"></div>
          )}
        </select>
      </div>
    );
  }
}

//export default SelectCategory;

const mapStateToProps = state => ({
  item: state.item,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { getItems })(SelectCategory);
