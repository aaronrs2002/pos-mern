import React, { Component } from "react";

class QuantityMenu extends Component {
  render() {
    const item = this.props.item;
    let quantity = [];
    for (let i = 1; i < 100; i++) {
      quantity.push(i);
    }

    return (
      <li>
        <div className="form-group">
          <label>Quantity</label>{" "}
          <select
            className="quantityMenu"
            data-name={item.name}
            onChange={this.props.quantitySelect.bind(this, item)}
          >
            {quantity
              ? quantity.map(i => {
                  return (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  );
                })
              : null}
          </select>
        </div>
      </li>
    );
  }
}

export default QuantityMenu;
