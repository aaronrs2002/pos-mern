import React, { Component } from "react";
import Cart from "./Cart";
import ModifyDiv from "./ModifyDiv";
import Removed from "./Removed";
import Extras from "./Extras";
import HowManyItems from "./HowManyItems";
import { connect } from "react-redux";
import { getPurchases } from "../actions/purchaseActions";
import { getItems } from "../actions/itemActions";
import PropTypes from "prop-types";
import TableSelect from "./TableSelect";

class Sales extends Component {
  constructor() {
    super();
    this.state = {
      cart: [],
      currentCart: [],
      itemCost: Number(0),
      subTotal: Number(0),
      tax: Number(0.08),
      taxTotal: Number(0),
      total: Number(0),
      modifyOptions: [],
      extras: [],
      removed: [],
      tempQuantity: Number(1),
      singlePrice: Number(1),
      details: "",
      editIndex: Number(-1),
      togglePanel: true,
      openPanel: Number(0),
      searchList: [],
      selectTable: true,
      table: "",
    };
    this.removeModification = this.removeModification.bind(this);
    this.quantitySelect = this.quantitySelect.bind(this);
    this.deleteCartItem = this.deleteCartItem.bind(this);
    this.viewDetails = this.viewDetails.bind(this);
    this.editCartItem = this.editCartItem.bind(this);
    this.calculateCart = this.calculateCart.bind(this);
    this.openClose = this.openClose.bind(this);
    this.resetCart = this.resetCart.bind(this);
    this.toggleCkStatus = this.toggleCkStatus.bind(this);
    this.resetSalesPg = this.resetSalesPg.bind(this);
  }

  static propTypes = {
    getItems: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    getPurchases: PropTypes.func.isRequired,
    purchases: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool,
  };

  componentDidMount() {
    this.props.getItems();
    this.props.getPurchases();
    this.props.changeView.bind(this, "sales"); //needed to refresh without reloading page
  }

  resetCart = () => {
    this.props.getPurchases();
    this.setState({
      cart: [],
      selectTable: true,
      currentCart: [],
    });
  };

  goToSales = (table) => {
    this.setState({
      selectTable: false,
      table,
    });
  };

  calculateCart = (cart) => {
    if (this.state.currentCart.length > 0) {
      cart = [...this.state.currentCart, ...cart];
    }

    let subTotal = 0;
    let taxTotal = 0;
    let total = 0;

    for (let i = 0; i < cart.length; i++) {
      subTotal = subTotal += Number(cart[i].itemCost);
    }
    taxTotal = subTotal * Number(this.state.tax);
    total = subTotal + taxTotal;
    this.setState({
      subTotal,
      taxTotal,
      total,
    });
  };

  resetSelection = () => {
    this.setState({
      itemCost: 0,
      extras: [],
      removed: [],
    });
    [].forEach.call(document.querySelectorAll(".details"), function (e) {
      e.classList.add("hide");
    });
    this.props.clearForms();
  };

  showSection(whatSection) {
    this.resetSelection();
    [].forEach.call(
      document.querySelectorAll(".list-group[data-category]"),
      function (e) {
        e.classList.add("hide");
      }
    );
    document
      .querySelector(".list-group[data-category='" + whatSection + "']")
      .classList.remove("hide");
  }

  viewDetails(item, action) {
    this.resetSelection();
    if (action === "add") {
      this.setState({
        itemCost: item.price,
        extras: [],
        removed: [],
        totalItemCost: item.price,
      });
    }

    [].forEach.call(
      document.querySelectorAll("ul.details[data-name]"),
      function (e) {
        e.classList.add("hide");
      }
    );
    document
      .querySelector("ul.details[data-name='" + item.name + "']")
      .classList.remove("hide");
    [].forEach.call(
      document.querySelectorAll("a.list-group-item-action"),
      function (e) {
        e.classList.remove("active");
      }
    );
    document
      .querySelector("a.list-group-item-action[data-name='" + item.name + "']")
      .classList.add("active");
  }

  quantitySelect = (item) => {
    let items = sessionStorage.getItem("items");
    items = JSON.parse(items);
    let tempQuantity = document.querySelector(
      ".list-group-item.active + ul.details .quantityMenu"
    ).value;
    let extras = [...this.state.extras];
    let removed = [...this.state.removed];
    let modPrice = Number(0);
    let id = Number(0);
    if (item === "removed") {
      id = document.querySelector("select#removed");
      for (let i = 0; i < items.length; i++) {
        if (items[i]._id == id.value) {
          removed.push(items[i]);
          this.setState({
            removed,
          });
        }
      }
      id.selectedIndex = 0;
      return false;
    }
    if (item === "add") {
      const id = document.querySelector("select#add");

      for (let i = 0; i < items.length; i++) {
        if (items[i]._id === id.value) {
          extras.push(items[i]);
          this.setState({
            extras,
          });
        }
      }
      id.selectedIndex = 0;
    }
    if (extras.length > 0) {
      for (let i = 0; i < extras.length; i++) {
        modPrice = modPrice += Number(extras[i].price);
      }
      modPrice = modPrice * tempQuantity;
    }

    const itemCost = Number(this.state.itemCost);
    const itemQuanity = Number(itemCost * tempQuantity);
    const totalItemCost = itemQuanity + Number(modPrice);
    this.setState({
      totalItemCost,
      itemCost,
    });
  };
  addToCart(item) {
    let name = item.name;
    let id = item.id;
    let itemCost = this.state.totalItemCost;
    let quantity = 1;
    const editIndex = this.state.editIndex;
    const table = this.state.table;
    let details = "";

    try {
      quantity = document.querySelector(
        ".quantityMenu[data-name='" + item.name + "']"
      ).value;
    } catch (err) {
      quantity = 1;
    }

    try {
      details = document.querySelector("textarea[name='details']").value;
    } catch {
      details = "";
    }

    const addedItem = {
      id: id,
      name: name,
      quantity: quantity,
      itemCost: Number(itemCost),
      extras: this.state.extras,
      removed: this.state.removed,
      details,
      table,
      status: "open-check",
      timestamp: [],
    };
    let cartCombined = [];
    if (editIndex === -1) {
      console.log(
        "JSON.stringify(this.state.cart): " +
          JSON.stringify(this.state.cart) +
          " JSON.stringify(addedItem): " +
          JSON.stringify(addedItem)
      );
      cartCombined = [...this.state.cart, addedItem];
    } else {
      let cart = this.state.cart;
      for (let i = 0; i < cart.length; i++) {
        if (editIndex === i) {
          cart[i] = addedItem;
          cartCombined = cart;
        }
      }
    }

    this.setState(
      {
        cart: cartCombined,
        editIndex: Number(-1),
      },
      () => {
        this.calculateCart(cartCombined);
      }
    );
    this.props.showMessage("success", addedItem.name + " added");
    this.resetSelection();
  }

  removeModification = (index, addOrRemove) => {
    let actionArr = [];
    let temp = [];
    switch (addOrRemove) {
      case "minus":
        actionArr = this.state.extras;
        for (let i = 0; i < actionArr.length; i++) {
          if (index !== i) {
            temp.push(actionArr[i]);
          }
        }
        this.setState({ extras: temp }, () => {
          this.quantitySelect("removeExtra");
        });
        break;
      case "removed":
        actionArr = [...this.state.removed];
        for (let i = 0; i < actionArr.length; i++) {
          if (index !== i) {
            temp.push(actionArr[i]);
          }
        }
        this.setState({
          removed: temp,
        });
        break;
    }
  };

  deleteCartItem(deleteIndex) {
    let cart = this.state.cart;
    let tempCart = [];
    for (let i = 0; i < cart.length; i++) {
      if (i !== deleteIndex) {
        tempCart.push(cart[i]);
      }
    }
    this.setState(
      {
        cart: tempCart,
      },
      () => {
        this.calculateCart(tempCart);
      }
    );
  }

  editCartItem(editIndex) {
    const { items } = this.props.item;
    let cart = this.state.cart;
    let item = [];
    for (let i = 0; i < cart.length; i++) {
      if (i === editIndex) {
        item = cart[i];
      }
    }
    for (let i = 0; i < items.length; i++) {
      if (item.name === items[i].name) {
        this.showSection(items[i].category);
        this.viewDetails(item, "edit");
        document.querySelector(
          ".list-group-item.active + ul.details .quantityMenu"
        ).value = item.quantity;
        if (item.details) {
          document.querySelector("textarea[name='details']").value =
            item.details;
        }

        this.setState(
          {
            extras: item.extras,
            removed: item.removed,
            itemCost: items[i].price,
            editIndex: Number(editIndex),
            table: items[i].table,
            status: items[i].status,
            details: item.details,
          },
          () => {
            this.quantitySelect(item);
          }
        );
      }
    }
  }

  openClose = (whatPanel) => {
    const originalPanel = this.state.openPanel;
    if (originalPanel === whatPanel) {
      whatPanel = "";
    }
    this.setState({
      togglePanel: true,
      openPanel: whatPanel,
    });
  };

  searchSelect = (item) => {
    this.showSection(item.category);
    this.viewDetails(item, "add");
    document.querySelector("#searchResults").classList.add("hide");
  };

  search = () => {
    let search = document.querySelector("input[name='search']").value;
    document.querySelector("#searchResults").classList.remove("hide");
    if (search === "") {
      document.querySelector("#searchResults").classList.add("hide");
    }
    search = search.toLowerCase();
    let items = sessionStorage.getItem("items");
    items = JSON.parse(items);
    let searchList = [];
    for (let i = 0; i < items.length; i++) {
      let name = items[i].name;
      name = name.toLowerCase();
      if (name.indexOf(search) !== -1) {
        searchList.push(items[i]);
      }
    }
    this.setState({
      searchList,
    });
  };

  resetSalesPg = () => {
    this.props.getPurchases();
    const selectTable = this.state.selectTable;
    if (selectTable === true) {
      this.setState({
        selectTable: false,
      });
    } else {
      this.setState({
        selectTable: true,
      });
    }
  };

  toggleCkStatus = (table) => {
    const d = new Date();
    const year = d.getFullYear();
    let day = d.getDate();
    let month = d.getMonth();
    month = month + 1;
    if (Number(month) < 10) {
      month = "0" + month;
    }
    if (Number(day) < 10) {
      day = "0" + day + "_";
    } else {
      day = day + "_";
    }
    const currentDay = year + "-" + month + "-" + day;
    let purchases = sessionStorage.getItem("purchases");
    purchases = JSON.parse(purchases);
    let tempCart = [];
    for (let i = 0; i < purchases.length; i++) {
      if (
        purchases[i].status === "open-check" &&
        purchases[i].timestamp.indexOf(currentDay) !== -1 &&
        table === purchases[i].table
      ) {
        tempCart.push(purchases[i]);
      }
    }

    this.calculateCart(tempCart);
    this.resetSalesPg();
    if (this.state.selectTable) {
      this.setState({
        table: table,
        currentCart: tempCart,
      });
    } else {
      this.setState({
        table: table,
      });
    }
  };

  render() {
    const { items } = this.props.item;
    sessionStorage.setItem("items", JSON.stringify(this.props.item.items));
    const { purchases } = this.props.purchases;
    sessionStorage.setItem("purchases", JSON.stringify(purchases));
    let itemCost = this.state.itemCost;
    let categoryList = [];
    let modifyOptions = [];
    for (let i = 0; i < items.length; i++) {
      let newItem = items[i].category;
      if (categoryList.indexOf(newItem) === -1) {
        categoryList.push(newItem);
      }
      if (items[i].modifyOption === true) {
        modifyOptions.push(items[i]);
      }
    }

    let selectTable = this.state.selectTable;
    if (this.props.isAuthenticated === false) {
      selectTable = true;
    }

    return (
      <React.Fragment>
        {selectTable === true ? (
          <TableSelect
            toggleCkStatus={this.toggleCkStatus}
            goToSales={this.goToSales}
          />
        ) : (
          <div className="row animated fadeIn">
            <div className="col-md-9">
              <input
                className="form-control"
                placeholder="Search filter"
                name="search"
                onChange={this.search}
              />

              <div className="list-group col-md-12" id="searchResults">
                {this.state.searchList
                  ? this.state.searchList.map((item, i) => {
                      return (
                        <a
                          href="#"
                          onClick={this.searchSelect.bind(this, item)}
                          className="list-group-item list-group-item-action"
                        >
                          {item.name}
                        </a>
                      );
                    })
                  : null}{" "}
              </div>

              {categoryList
                ? categoryList.map((category, i) => {
                    return (
                      <div key={i}>
                        <button
                          className="btn btn-secondary btn-block"
                          key={i}
                          onClick={this.showSection.bind(this, category)}
                        >
                          {category}
                        </button>
                        <div
                          className="list-group hide"
                          data-category={category}
                        >
                          {items.map((item, j) => {
                            if (item.category === category) {
                              return (
                                <div key={j}>
                                  <a
                                    href="#"
                                    onClick={this.viewDetails.bind(
                                      this,
                                      item,
                                      "add"
                                    )}
                                    className="list-group-item list-group-item-action"
                                    data-name={item.name}
                                    key={i}
                                  >
                                    {item.name}
                                  </a>

                                  <ul
                                    className="noStyle  hide details"
                                    data-name={item.name}
                                  >
                                    <li>{item.description}</li>
                                    <li>$ {item.price}</li>
                                    <HowManyItems
                                      item={item}
                                      quantitySelect={this.quantitySelect}
                                    />
                                    <Extras
                                      removeModification={
                                        this.removeModification
                                      }
                                      extras={this.state.extras}
                                    />
                                    <Removed
                                      removeModification={
                                        this.removeModification
                                      }
                                      removed={this.state.removed}
                                    />
                                    {item.canModify === true ? (
                                      <li>
                                        <button
                                          className="btn btn-secondary btn-block"
                                          data-name={item._id}
                                          onClick={this.openClose.bind(
                                            this,
                                            item._id
                                          )}
                                        >
                                          Modify
                                        </button>
                                        {this.state.openPanel === item._id &&
                                        this.state.togglePanel === true ? (
                                          <ModifyDiv
                                            quantitySelect={this.quantitySelect}
                                            modifyOptions={modifyOptions}
                                          />
                                        ) : null}
                                      </li>
                                    ) : null}

                                    {itemCost !== 0 ? (
                                      <li>
                                        <h2>$ {this.state.totalItemCost}</h2>
                                      </li>
                                    ) : null}

                                    <li>
                                      <button
                                        className="btn btn-success btn-block"
                                        onClick={this.addToCart.bind(
                                          this,
                                          item
                                        )}
                                      >
                                        Add to cart
                                      </button>
                                    </li>
                                  </ul>
                                </div>
                              );
                            }
                          })}
                        </div>
                      </div>
                    );
                  })
                : null}
            </div>
            <Cart
              editCartItem={this.editCartItem}
              deleteCartItem={this.deleteCartItem}
              cartView={this.state.cart}
              showMessage={this.props.showMessage}
              taxTotal={this.state.taxTotal}
              total={this.state.total}
              resetCart={this.resetCart}
              table={this.state.table}
              resetSalesPg={this.resetSalesPg}
              currentCart={this.state.currentCart}
            />
          </div>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  item: state.item,
  purchases: state.purchases,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {
  getPurchases,
  getItems,
})(Sales);
