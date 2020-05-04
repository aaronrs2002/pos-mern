import React, { Component } from "react";
import { connect } from "react-redux";
import { getPurchases } from "../actions/purchaseActions";
import PropTypes from "prop-types";

class TableSelect extends Component {
  constructor() {
    super();
    this.state = {
      bar: false,
      occupied: [],
      closed: [],
      user: "",
      purchases: [],
    };
    this.whatTable = this.whatTable.bind(this);
  }

  static propTypes = {
    getPurchases: PropTypes.func.isRequired,
    purchases: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool,
  };

  toggleBar = () => {
    if (this.state.bar === false) {
      this.setState({
        bar: true,
      });
    } else {
      this.setState({
        bar: false,
      });
    }
  };

  whatTable = () => {
    const whatTable = document.getElementById("whatTable").value;
    document.getElementById("whatTable").selectedIndex = 0;
    this.props.goToSales(whatTable);
  };

  render() {
    const currentTime = sessionStorage.getItem("currentTime"); //from Cart.js line 88
    const { purchases } = this.props.purchases;
    const user = sessionStorage.getItem("user");
    let allOpenChecks = [];
    let openChecks = [];
    let closedChecks = [];
    for (let i = 0; i < purchases.length; i++) {
      if (
        purchases[i].status === "open-check" &&
        purchases[i].timestamp.indexOf(user) !== -1 &&
        openChecks.indexOf(purchases[i].table) === -1
      ) {
        openChecks.push(purchases[i].table);
      }

      if (
        purchases[i].status === "open-check" &&
        allOpenChecks.indexOf(purchases[i].table) === -1
      ) {
        allOpenChecks.push(purchases[i].table);
      }
      if (
        purchases[i].status === "check-closed" &&
        purchases[i].timestamp.indexOf(user) !== -1 &&
        purchases[i].timestamp.indexOf(currentTime) !== -1 &&
        closedChecks.indexOf(purchases[i].table) === -1
      ) {
        closedChecks.push(purchases[i].table);
      }
    }

    let vacant = [];
    for (let i = 0; i < 100; i++) {
      vacant.push("Table: " + i);
    }
    for (let i = 0; i < 100; i++) {
      vacant.push("Bar: " + i);
    }

    let currentVacancy = [];
    for (let i = 0; i < vacant.length; i++) {
      if (allOpenChecks.indexOf(vacant[i]) === -1) {
        currentVacancy.push(vacant[i]);
      }
    }

    return (
      <div className="card-deck mb-3 text-center">
        <div className="card mb-4 shadow-sm">
          <div className="card-header">
            <h4 className="my-0 ">New Check</h4>
          </div>
          <div className="card-body">
            <h5 className="card-title pricing-card-title">What Table</h5>

            <label className="pointer labelContainer">
              {" "}
              Is this a bar seat?
              <input
                type="checkbox"
                value="true"
                name="barSeat"
                onChange={this.toggleBar}
              />
              <span className="checkmark"></span>
            </label>

            {this.state.bar === false ? (
              <select className="form-control mb-4" id="whatTable">
                {currentVacancy.map((table, i) => {
                  table = table.toString();
                  if (table.indexOf("Bar") === -1) {
                    return (
                      <option value={table} key={i}>
                        {table}
                      </option>
                    );
                  }
                })}
              </select>
            ) : (
              <select className="form-control mb-4" id="whatTable">
                {currentVacancy.map((table, i) => {
                  table = table.toString();
                  if (table.indexOf("Bar") !== -1) {
                    return (
                      <option value={table} key={i}>
                        {table}
                      </option>
                    );
                  }
                })}
              </select>
            )}
            {user.length > 0 ? (
              <button
                className="btn btn-block btn-success"
                onClick={this.whatTable}
              >
                Submit
              </button>
            ) : (
              <button className="btn btn-block btn-success" disabled>
                Submit
              </button>
            )}
          </div>
        </div>

        <div className="card mb-4 shadow-sm">
          <div className="card-header">
            <h4 className="my-0">Open Checks</h4>
          </div>
          <div className="card-body">
            <div className="list-group">
              {user.length > 0
                ? openChecks.map((table, i) => {
                    return (
                      <button
                        key={i}
                        onClick={this.props.toggleCkStatus.bind(this, table)}
                        className="list-group-item list-group-item-action"
                      >
                        {table}
                      </button>
                    );
                  })
                : null}
            </div>
          </div>
        </div>

        <div className="card mb-4 shadow-sm">
          <div className="card-header">
            <h4 className="my-0 ">Closed Checks</h4>
          </div>
          <div className="card-body">
            <div className="list-group">
              {user.length > 0
                ? closedChecks.map((table, i) => {
                    return (
                      <button
                        key={i}
                        disabled
                        className="list-group-item list-group-item-action"
                      >
                        {table}
                      </button>
                    );
                  })
                : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

//export default Analytics;
const mapStateToProps = (state) => ({
  purchases: state.purchases,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { getPurchases })(TableSelect);

//export default TableSelect;
