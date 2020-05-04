import React, { Component } from "react";
import DateTimeFilter from "./DateTimeFilter";
import { Doughnut, Line } from "react-chartjs-2";
import { connect } from "react-redux";

import { getItems } from "../actions/itemActions";
import PropTypes from "prop-types";

class Analytics extends Component {
  constructor() {
    super();
    this.state = {
      allPurchases: [],
      dateList: [],
      allDateSales: [],
      stamps: [],
      userInfo: [],
      view: "filter",
      userFilter: "",
      users: [],
      dateTimes: [],
      lineGraphDateTimes: [],
      purchaseTotal: Number(0),
      sale: Number(0),
      sales: Number(0),
      inStock: Number(0),
      percentSold: Number(0),
      pieData: [],
      togglePanel: true,
      openPanel: "",
      productData: ""
    };
    this.filterByUser = this.filterByUser.bind(this);
    this.loadUserSelection = this.loadUserSelection.bind(this);
    this.dateFilter = this.dateFilter.bind(this);
    this.productSales = this.productSales.bind(this);
    this.loadPurchases = this.loadPurchases.bind(this);
  }

  static propTypes = {
    getItems: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool
  };

  loadUserSelection(whichUsers) {
    let stamps = [];
    let dateTimes = [];
    let purchaseTotal = Number(0);
    for (let i = 0; i < whichUsers.length; i++) {
      if (stamps.indexOf(whichUsers[i].timestamp) === -1) {
        stamps.push(whichUsers[i].timestamp);
      }
    }

    /*  for (let i = 0; i < stamps.length; i++) {
      if (stamps[i]) {
        const dateTime = stamps[i].substring(stamps[i].indexOf(":") + 1);
        if (dateTimes.indexOf(dateTime) === -1) {
          dateTimes.push(dateTime);
        }
      }
    }*/
    for (let i = 0; i < whichUsers.length; i++) {
      if (typeof whichUsers[i].itemCost == "number") {
        purchaseTotal = purchaseTotal += Number(whichUsers[i].itemCost);
      }
    }

    this.setState({
      stamps,
      //dateTimes,
      purchaseTotal
    });
  }

  loadPurchases() {
    let users = [];
    let pieData = [];
    let allPurchases = sessionStorage.getItem("purchases");
    allPurchases = JSON.parse(allPurchases);
    for (let i = 0; i < allPurchases.length; i++) {
      if (allPurchases[i].timestamp) {
        const user = allPurchases[i].timestamp.substring(
          0,
          allPurchases[i].timestamp.indexOf(":")
        );
        if (users.indexOf(user) === -1) {
          users.push(user);
          pieData.push(0);
        }
      }
    }

    this.setState(
      {
        users,
        pieData,
        allPurchases
      },
      () => {
        this.loadUserSelection(allPurchases);
        this.productSales();
      }
    );
  }
  componentDidMount() {
    this.props.getItems();

    const interval = setInterval(() => {
      let allPurchases = sessionStorage.getItem("purchases");
      if (allPurchases.length > 0) {
        this.loadPurchases();
        this.dateFilter();
        clearInterval(interval);
      } else {
        console.log("allPurchases.length: " + allPurchases.length);
      }
    }, 500);
  }

  filterByUser() {
    const whichUser = document.querySelector("#userFilter").value;
    let allPurchases = sessionStorage.getItem("purchases");
    document.querySelector("#day").selectedIndex = 0;
    document.querySelector("#amPm").selectedIndex = 0;

    allPurchases = JSON.parse(allPurchases);
    if (whichUser === "noFilter") {
      this.loadUserSelection(allPurchases);
    } else {
      let tempPurchases = [];
      for (let i = 0; i < allPurchases.length; i++) {
        if (allPurchases[i].timestamp) {
          const timestamp = allPurchases[i].timestamp;
          const colon = timestamp.indexOf(":");
          if (whichUser === timestamp.substring(0, colon)) {
            tempPurchases.push(allPurchases[i]);
          }
        }
      }
      this.loadUserSelection(tempPurchases);
    }
  }

  dateFilter() {
    let purchases = sessionStorage.getItem("purchases");
    console.log("purchases FROM dateFilter(): " + purchases);
    purchases = JSON.parse(purchases);

    let filteredDates = [];
    const whichDate = document.querySelector("input[name='dateFilter']").value;
    let whichUser = document.querySelector("#userFilter").value;
    if (whichUser === "noFilter") {
      whichUser = "";
    }
    for (let i = 0; i < purchases.length; i++) {
      if (purchases[i].timestamp) {
        if (
          purchases[i].timestamp.indexOf(whichUser + ":" + whichDate) !== -1
        ) {
          filteredDates.push(purchases[i]);
        }
      }
    }

    this.loadUserSelection(filteredDates);
  }

  indivProduct(timestamp, quantity) {
    const users = this.state.users;
    let pieData = this.state.pieData;
    let userQuantity = [];
    let user = timestamp.substring(0, timestamp.indexOf(":"));
    let totalPurchased = Number(0);
    totalPurchased = totalPurchased += quantity;
    userQuantity.push({
      user: user,
      quantity: quantity
    });

    for (let i = 0; i < userQuantity.length; i++) {
      for (let j = 0; j < users.length; j++) {
        if (userQuantity[i].user === users[j]) {
          pieData[j] = Number(pieData[j]) + Number(quantity);

          //pieData[j] = (totalPurchased / pieData[j]) * 100;
        }
      }
    }
    this.setState({
      pieData
    });
  }

  buildLineGraph = (productSales, allPurchases) => {
    let dateList = [];
    let stamps = [];
    let dateTimes = [];

    for (let i = 0; i < allPurchases.length; i++) {
      if (stamps.indexOf(allPurchases[i].timestamp) === -1) {
        stamps.push(allPurchases[i].timestamp);
      }
    }

    for (let i = 0; i < stamps.length; i++) {
      if (stamps[i]) {
        const dateTime = stamps[i].substring(stamps[i].indexOf(":") + 1);
        if (dateTimes.indexOf(dateTime) === -1) {
          dateTimes.push(dateTime);
        }
      }
    }

    for (let i = 0; i < dateTimes.length; i++) {
      if (
        dateList.indexOf(dateTimes[i].substring(5, 10)) === -1 &&
        dateList.length < 11
      ) {
        dateList.push(dateTimes[i].substring(5, 10));
      }
    }
    let allDateSales = [];
    for (let j = 0; j < dateList.length; j++) {
      let addSales = Number(0);

      for (let i = 0; i < allPurchases.length; i++) {
        if (
          productSales === allPurchases[i].name &&
          allPurchases[i].timestamp.indexOf(dateList[j]) !== -1
        ) {
          addSales = addSales += Number(allPurchases[i].quantity);
        }
      }
      allDateSales.push(addSales);
    }
    this.setState({
      dateList,
      allDateSales,
      lineGraphDateTimes: dateTimes
    });
  };

  productSales() {
    let pieData = []; /*must reset for graphs to re-render*/
    const productSales = document.getElementById("productSales").value;
    for (let i = 0; i < this.state.users.length; i++) {
      pieData.push(Number(0));
    }

    this.setState(
      {
        pieData,
        sales: 0,
        productData: productSales
      },
      () => {
        let purchases = sessionStorage.getItem("purchases");
        const allPurchases = JSON.parse(purchases);

        this.buildLineGraph(productSales, allPurchases);

        let items = sessionStorage.getItem("items");
        const products = JSON.parse(items);

        let sales = Number(0);
        let inStock = Number(0);

        for (let i = 0; i < products.length; i++) {
          if (products[i].name === productSales) {
            inStock = products[i].quantity;
          }
        }
        for (let i = 0; i < allPurchases.length; i++) {
          if (allPurchases[i].name === productSales) {
            sales = sales += Number(allPurchases[i].quantity);
            this.indivProduct(
              allPurchases[i].timestamp,
              allPurchases[i].quantity
            );
          }
          let extras = allPurchases[i].extras;
          if (extras.length > 0) {
            for (let j = 0; j < extras.length; j++) {
              if (extras[j].name === productSales) {
                sales = sales += Number(allPurchases[i].quantity);
                this.indivProduct(
                  allPurchases[i].timestamp,
                  allPurchases[i].quantity
                );
              }
            }
          }
          let remove = allPurchases[i].remove;
          if (remove) {
            for (let j = 0; j < remove.length; j++) {
              if (remove[j].name === productSales) {
                sales = sales - Number(allPurchases[i].quantity);
              }
            }
          }
        }

        let percentSold = (sales / inStock) * 100;
        percentSold = percentSold.toFixed(2);

        setTimeout(function() {
          try {
            document.getElementById("salesBar").style.width = percentSold + "%";
          } catch {
            return false;
          }
        }, 10);

        this.setState({
          sales,
          inStock,
          percentSold
        });
      }
    );
  }

  openClose = whatPanel => {
    console.log("whatPanel: " + whatPanel);
    const originalPanel = this.state.openPanel;
    if (originalPanel === whatPanel) {
      whatPanel = "";
    }
    this.setState({
      togglePanel: true,
      openPanel: whatPanel
    });

    [].forEach.call(document.querySelectorAll(".list-group-item"), e =>
      e.classList.remove("active")
    );
    document
      .querySelector("[data-timestamp='" + whatPanel + "']")
      .classList.add("active");
  };

  render() {
    const { items } = this.props.item;
    let purchases = sessionStorage.getItem("purchases");
    purchases = JSON.parse(purchases);

    const stamps = this.state.stamps;
    let data = this.state.pieData;
    let userItemSales = {
      labels: this.state.users,
      datasets: [
        {
          data: data,
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "ffff33"],
          hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "ffff33"]
        }
      ]
    };

    const lineData = {
      labels: this.state.dateList,
      datasets: [
        {
          label: this.state.productData,
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.state.allDateSales
        }
      ]
    };
    return (
      <React.Fragment>
        {this.state.view === "filter" ? (
          <React.Fragment>
            <div className="card card-body bg-light">
              <h5>Sales by product</h5>
              <select
                className="form-control"
                id="productSales"
                onChange={this.productSales}
              >
                {items
                  ? items.map((item, i) => {
                      return (
                        <option value={item.name} key={i}>
                          {item.name}
                        </option>
                      );
                    })
                  : null}
              </select>
              {this.state.sales > 0 ? (
                <React.Fragment>
                  <h2>
                    {this.state.sales +
                      " sold out of " +
                      this.state.inStock +
                      " - Percent sold: " +
                      this.state.percentSold +
                      "%"}
                  </h2>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="progress">
                        <div
                          id="salesBar"
                          className="progress-bar progress-bar-striped progress-bar-animated"
                          role="progressbar"
                          aria-valuenow="10"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                      <Line data={lineData} />
                    </div>
                    <div className="col-md-6">
                      <Doughnut data={userItemSales} />
                    </div>
                  </div>
                </React.Fragment>
              ) : (
                <h2>No Sale</h2>
              )}
            </div>{" "}
            <h5>1. Filter by user:</h5>
            <select
              id="userFilter"
              className="form-control"
              onChange={this.filterByUser}
            >
              <option value="noFilter">All users</option>
              {this.state.users.map((user, i) => {
                return (
                  <option key={i} value={user}>
                    {user}
                  </option>
                );
              })}
            </select>{" "}
            <h5>2. Filter by date:</h5>
            <input
              type="text"
              placeholder="Date Filter"
              className="form-control"
              name="dateFilter"
              onChange={this.dateFilter}
            />
            <DateTimeFilter dateFilter={this.dateFilter} />
          </React.Fragment>
        ) : null}

        {this.state.view === "filter" ? (
          <React.Fragment>
            <div className="row">
              <div className="col-md-12">
                <hr />
                <h2>Pre-Tax Sales: ${this.state.purchaseTotal.toFixed(2)}</h2>
              </div>
            </div>
            <div className="list-group" id="salesReturns">
              {stamps.length > 0
                ? stamps.map((stamp, i) => {
                    if (stamp) {
                      return (
                        <div key={i} className="saleList">
                          <div
                            data-timestamp={stamp}
                            className="list-group-item list-group-item-action pointer"
                            data-num={i}
                            onClick={this.openClose.bind(this, stamp)}
                          >
                            Purchase ID: {stamp}
                          </div>

                          {this.state.openPanel === stamp &&
                          this.state.togglePanel === true ? (
                            <div>
                              {purchases
                                ? purchases.map((purchase, i) => {
                                    return (
                                      <span key={i}>
                                        {purchase.timestamp === stamp ? (
                                          <ul className="noStyle">
                                            <li>
                                              {" "}
                                              {purchase.quantity +
                                                " - " +
                                                purchase.name}
                                            </li>
                                            {purchase.extras ? (
                                              <li>
                                                <ul className="noStyle">
                                                  {purchase.extras.map(
                                                    (extra, j) => {
                                                      return (
                                                        <li key={j}>
                                                          Add:
                                                          {" " + extra.name}
                                                        </li>
                                                      );
                                                    }
                                                  )}
                                                </ul>
                                              </li>
                                            ) : null}

                                            {purchase.remove ? (
                                              <li>
                                                <ul className="noStyle">
                                                  {purchase.remove.map(
                                                    (remove, j) => {
                                                      return (
                                                        <li key={j}>
                                                          Take out:
                                                          {" " + remove.name}
                                                        </li>
                                                      );
                                                    }
                                                  )}
                                                </ul>
                                              </li>
                                            ) : null}

                                            {purchase.details.length > 0 ? (
                                              <li>
                                                Special instructions:
                                                {" " + purchase.details}
                                              </li>
                                            ) : null}
                                            <li>
                                              {"Cost: $" + purchase.itemCost}
                                            </li>
                                          </ul>
                                        ) : null}
                                      </span>
                                    );
                                  })
                                : null}
                            </div>
                          ) : null}
                        </div>
                      );
                    }
                  })
                : null}
            </div>
          </React.Fragment>
        ) : null}
      </React.Fragment>
    );
  }
}

//export default Analytics;
const mapStateToProps = state => ({
  item: state.item,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { getItems })(Analytics);

/*

Analytic functions:

1. Which user sells the most (bar graph)
2. Product inventory
3. Sales Log (Filter by: date, user, product)


*/
