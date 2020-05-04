import React, { Component } from "react";
import { connect } from "react-redux";
import { addPurchase, updatePurchase } from "../actions/purchaseActions";
import PropTypes from "prop-types";

class Cart extends Component {
  static propTypes = {
    addPurchase: PropTypes.func.isRequired,
    updatePurchase: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
  };

  passPurchase = (cartView) => {
    const date = new Date();
    let day = date.getDate();
    let month = Number(date.getMonth()) + 1;
    const year = date.getFullYear();
    let hours = date.getHours();
    let hoursOriginal = hours;
    let minutes = date.getMinutes();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    if (hours > 12) {
      hours = hours - 12;
    }
    if (hours < 10) {
      hours = "0" + hours;
    }

    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    let seconds = date.getSeconds();
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    if (hoursOriginal > 11) {
      hours = "PM-" + hours;
    } else {
      hours = "AM-" + hours;
    }

    let purchase = [];
    let timestamp = "";
    const currentCart = this.props.currentCart;

    if (currentCart.length > 0) {
      timestamp = currentCart[0].timestamp;
    } else {
      timestamp =
        sessionStorage.getItem("user") +
        ":" +
        year +
        "-" +
        month +
        "-" +
        day +
        "_" +
        hours +
        ":" +
        minutes +
        ":" +
        seconds;
    }

    for (let i = 0; i < cartView.length; i++) {
      if (cartView[i].timestamp.length === 0) {
        purchase.push({
          name: cartView[i].name,
          quantity: Number(cartView[i].quantity),
          itemCost: cartView[i].itemCost,
          extras: cartView[i].extras,
          removed: cartView[i].removed,
          details: cartView[i].details,
          table: cartView[i].table,
          status: cartView[i].status,
          timestamp,
        });
      }
    }

    //current date & AM/PM for closed check visibility
    const colonLoc = timestamp.indexOf(":");
    let currentTime = timestamp.substring(colonLoc + 1, colonLoc + 14);
    sessionStorage.setItem("currentTime", currentTime);
    this.props.addPurchase(purchase);
    this.props.resetCart();
    this.props.showMessage("success", "Purchase Sent.");
  };

  showAlert() {
    document.querySelector("[role='alert']").classList.remove("hide");
  }

  hideAlert() {
    document.querySelector(".alert-danger").classList.add("hide");
  }

  closeCheck = () => {
    const currentCart = this.props.currentCart;
    for (let i = 0; i < currentCart.length; i++) {
      const purchase = {
        id: currentCart[i]._id,
        name: currentCart[i].name,
        quantity: Number(currentCart[i].quantity),
        itemCost: currentCart[i].itemCost,
        extras: currentCart[i].extras,
        removed: currentCart[i].removed,
        details: currentCart[i].details,
        table: currentCart[i].table,
        status: "check-closed",
        timestamp: currentCart[i].timestamp,
      };
      this.props.resetSalesPg();
      this.props.updatePurchase(purchase);
    }
  };

  render() {
    let cartView = this.props.cartView;
    let currentCart = [];
    if (this.props.currentCart) {
      currentCart = this.props.currentCart;
    }

    return (
      <div className="col-md-3" data-target="cart">
        <h5>{this.props.table}</h5>
        <label>
          <i className="fas fa-shopping-cart"></i>
          {cartView.length === 0 && currentCart.length === 0
            ? " No items in cart"
            : " " + (cartView.length + currentCart.length) + " item/s in cart."}
        </label>{" "}
        {currentCart.length > 0 || cartView.length > 0 ? (
          <ul className="noStyle">
            {currentCart
              ? currentCart.map((item, i) => {
                  return (
                    <li key={i}>
                      {item.quantity +
                        " - " +
                        item.name +
                        ": $" +
                        item.itemCost}{" "}
                    </li>
                  );
                })
              : null}

            {cartView.length > 0
              ? cartView.map((item, i) => {
                  return (
                    <li key={i}>
                      <i
                        className="fas fa-pencil-alt pointer"
                        title={"Edit " + item.name}
                        alt={"Edit " + item.name}
                        onClick={this.props.editCartItem.bind(this, i)}
                      ></i>{" "}
                      {item.quantity +
                        " - " +
                        item.name +
                        ": $" +
                        item.itemCost}{" "}
                      <i
                        className="fas fa-trash pointer"
                        title={"Delete " + item.name}
                        alt={"Delete " + item.name}
                        onClick={this.props.deleteCartItem.bind(this, i)}
                      ></i>
                    </li>
                  );
                })
              : null}

            <li>tax: ${this.props.taxTotal.toFixed(2)}</li>
            <li>total: ${this.props.total.toFixed(2)}</li>
          </ul>
        ) : null}
        <button
          className="btn btn-success btn-block"
          onClick={this.passPurchase.bind(this, cartView)}
        >
          Submit
        </button>
        {cartView.length === 0 && currentCart.length > 0 ? (
          <React.Fragment>
            <button
              className="btn btn-danger btn-block"
              onClick={this.showAlert}
            >
              Close Check
            </button>
            <div className="alert alert-danger hide" role="alert">
              <p>
                Are you sure you want to close?{" "}
                <button onClick={this.closeCheck} className="btn btn-danger">
                  YES
                </button>{" "}
                <button onClick={this.hideAlert} className="btn btn-secondary">
                  NO
                </button>
              </p>
            </div>
          </React.Fragment>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  purchase: state.purchase,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {
  addPurchase,
  updatePurchase,
})(Cart);
