import React, { Component } from "react";
const date = new Date();
class DateTimeFilter extends Component {
  constructor(props) {
    super(props);
    this.updateStamp = this.updateStamp.bind(this);
  }

  updateStamp = () => {
    const year = document.getElementById("year").value;
    const month = document.getElementById("month").value;
    const day = document.getElementById("day").value;
    const amPm = document.getElementById("amPm").value;
    const hours = document.getElementById("hours").value;
    const minutes = document.getElementById("minutes").value;
    const selectMenus = year + month + "-" + day + "_" + amPm + hours + minutes;
    document.querySelector("input[name='dateFilter']").value = selectMenus;
    this.props.dateFilter();
  };

  componentDidMount() {
    let day = date.getDate();
    let month = Number(date.getMonth()) + 1;
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    document.getElementById("month").value = month;
    document.getElementById("day").value = day;

    this.updateStamp();
  }

  render() {
    const year = date.getFullYear();
    let nums = [];
    for (let i = 0; i < 60; i++) {
      if (i < 10) {
        i = "0" + i;
      }
      nums.push(i);
    }

    return (
      <div className="card card-body bg-light">
        <div className="row">
          <div className="col-md-1">
            <select
              id="year"
              className="form-control"
              onChange={this.updateStamp}
            >
              <option value={year + "-"}>{year}</option>
              <option value={year - 1 + "-"}>{year - 1}</option>
              <option value={year - 2 + "-"}>{year - 2}</option>
            </select>
          </div>

          <div className="col-md-2">
            <select
              id="month"
              className="form-control"
              onChange={this.updateStamp}
            >
              {" "}
              {nums
                ? nums.map((num, i) => {
                    if (i < 13) {
                      return (
                        <option key={i} value={num}>
                          {"Month: " + num}
                        </option>
                      );
                    }
                  })
                : null}
            </select>
          </div>

          <div className="col-md-2">
            <select
              id="day"
              className="form-control"
              onChange={this.updateStamp}
            >
              {" "}
              {nums
                ? nums.map((num, i) => {
                    if (i < 32) {
                      return (
                        <option key={i} value={num}>
                          {"Day: " + num}
                        </option>
                      );
                    }
                  })
                : null}
            </select>
          </div>

          <div className="col-md-2">
            <select
              id="amPm"
              className="form-control"
              onChange={this.updateStamp}
            >
              <option value="">AM/PM</option>
              <option value="AM-">AM</option>
              <option value="PM-">PM</option>
            </select>
          </div>

          <div className="col-md-2">
            <select
              id="hours"
              className="form-control"
              onChange={this.updateStamp}
            >
              <option value="">Hour</option>{" "}
              {nums
                ? nums.map((num, i) => {
                    if (i < 13) {
                      return (
                        <option key={i} value={num + ":"}>
                          {"Hour: " + num}
                        </option>
                      );
                    }
                  })
                : null}
            </select>
          </div>

          <div className="col-md-2">
            <select
              id="minutes"
              className="form-control"
              onChange={this.updateStamp}
            >
              <option value="">Minute</option>{" "}
              {nums
                ? nums.map((num, i) => {
                    if (i < 60) {
                      return (
                        <option key={i} value={num + ":"}>
                          {"Minutes: " + num}
                        </option>
                      );
                    }
                  })
                : null}
            </select>
          </div>
        </div>
      </div>
    );
  }
}

export default DateTimeFilter;
