import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AppNavbar from "./components/AppNavbar";
import Message from "./components/Message";
import UserAdmin from "./components/UserAdmin";
import FuncOptions from "./components/FuncOptions";
import AddItem from "./components/AddItem";
import EditItem from "./components/EditItem";
import DeleteItem from "./components/DeleteItem";
import SelectCategory from "./components/SelectCategory";
import ItemList from "./components/ItemList";
import ShoppingList from "./components/ShoppingList";
import { Provider } from "react-redux";
import store from "./store";
import { Container } from "reactstrap";
import { loadUser } from "./actions/authActions";
import Sales from "./components/Sales";
import Analytics from "./components/Analytics";
import Footer from "./components/Footer";

class App extends Component {
  constructor() {
    super();
    this.state = {
      openPanel: "",
      togglePanel: false,
      items: [],
      editFunc: "add",
      message: "message here",
      messageType: "success",
      messageVisible: false,
      uiView: "sales",
    };

    this.clearForms = this.clearForms.bind(this);
    this.updateFunc = this.updateFunc.bind(this);
    this.changeView = this.changeView.bind(this);
    this.showMessage = this.showMessage.bind(this);
    this.changeView = this.changeView.bind(this);
    this.addEditUser = this.addEditUser.bind(this);
  }

  updateFunc = (func) => {
    const funcOptions = document.querySelectorAll("[data-func]");
    for (let i = 0; i < funcOptions.length; i++) {
      funcOptions[i].classList.remove("active");
    }
    document
      .querySelector("[data-func='" + func + "']")
      .classList.add("active");

    this.setState({
      editFunc: func,
    });
    this.clearForms();
  };

  componentDidMount() {
    store.dispatch(loadUser());
  }

  showMessage = (type, message) => {
    this.setState({
      messageVisible: true,
      message,
      messageType: type,
    });
    setTimeout(() => {
      this.setState({
        messageVisible: false,
      });
    }, 4000);
  };

  clearForms = () => {
    [].forEach.call(document.querySelectorAll("input, textarea"), function (e) {
      e.value = "";
    });
    let selects = document.getElementsByTagName("select");
    for (let i = 0; i < selects.length; i++) {
      selects[i].selectedIndex = 0;
    }
  };

  changeView = (whichView) => {
    console.log("Which view is it? " + whichView);
    this.setState({
      uiView: whichView,
    });
  };

  addEditUser() {
    const user = document.querySelector("input[name='user']").value;
    const fName = document.querySelector("input[name='fName']").value;
    const lName = document.querySelector("input[name='lName']").value;
    const phone = document.querySelector("input[name='phone']").value;
    const userInfo = { user: user, fName: fName, lName: lName, phone: phone };
    let users = this.state.users;
    for (let i = 0; i < users.length; i++) {
      if (user === users[i].user) {
        console.log("user: " + user + " users[i].user: " + users[i].user);
        users[i] = userInfo;
      }
    }

    if (this.state.editFunc === "addUser") {
      users.push(userInfo);
    }
    this.setState({
      users,
    });
    this.clearForms();
    this.showMessage("success", "Successful submission of " + user);
  }

  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <AppNavbar changeView={this.changeView} />
          <Container className="main">
            <h1 className="allCaps">{this.state.uiView}</h1>
            <hr />
            {this.state.uiView === "sales" ? (
              <Sales
                showMessage={this.showMessage}
                clearForms={this.clearForms}
                changeView={this.changeView}
              />
            ) : null}
            {this.state.uiView === "analytics" ? <Analytics /> : null}
            {this.state.uiView === "admin" ? (
              <div className="row">
                <div className="col-md-12">
                  <FuncOptions updateFunc={this.updateFunc} />

                  {this.state.editFunc === "delete" ? <DeleteItem /> : null}
                  {this.state.editFunc === "edit" ? (
                    <React.Fragment>
                      <ItemList
                        selectedItem={this.selectedItem}
                        editFunc={this.state.editFunc}
                      />
                      <SelectCategory editFunc={this.state.editFunc} />
                      <EditItem clearForms={this.clearForms} />
                    </React.Fragment>
                  ) : null}
                  {this.state.editFunc === "add" ? (
                    <React.Fragment>
                      <SelectCategory editFunc={this.state.editFunc} />
                      <AddItem
                        showMessage={this.showMessage}
                        clearForms={this.clearForms}
                      />{" "}
                    </React.Fragment>
                  ) : null}
                </div>
              </div>
            ) : null}
          </Container>{" "}
          <Footer />
          {this.state.messageVisible === true ? (
            <Message
              message={this.state.message}
              messageType={this.state.messageType}
            />
          ) : null}
        </div>
      </Provider>
    );
  }
}

export default App;
