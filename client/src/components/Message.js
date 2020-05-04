import React, { Component } from "react";

class Message extends Component {
  constructor() {
    super();
    this.state = {
      animation: "fadeInUp"
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        animation: "fadeOutDown"
      });
    }, 3000);
  }

  render() {
    console.log("this.props.messageType: " + this.props.messageType);
    return (
      <div
        className={
          this.props.messageType === "success"
            ? "alert alert-success animated " + this.state.animation
            : "alert alert-danger animated " + this.state.animation
        }
        role="alert"
        id="messageRow"
      >
        {this.props.message}
      </div>
    );
  }
}

export default Message;
