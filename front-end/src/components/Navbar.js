import { Component } from "react";
import Identicon from "identicon.js";
import "../index.css";
import chip_logo from "../assets/chip_logo.png";

class Navbar extends Component {
  render() {
    let navtabs;

    if (this.props.page !== "landing") {
      navtabs = (
        <div>
          <input
            type="button"
            value="Stake"
            onClick={this.props.clickStakeHandler}
          ></input>
          <input
            type="button"
            value="Cage"
            onClick={this.props.clickCageHandler}
          ></input>
          <input
            type="button"
            value="Play"
            onClick={this.props.clickPlayHandler}
          ></input>
        </div>
      );
    } else {
      navtabs = <></>;
    }
    return (
      <nav className="navbar">
        <div className="navbar__left">
          <img className="navbar__logo" src={chip_logo} alt="logo" />
          {navtabs}
        </div>
        <div className="navbar__account">
          <p>
            <small>
              {this.props.account ? this.props.account : "Not Connected"}{" "}
            </small>
          </p>
          {this.props.account ? (
            <img
              width="30"
              height="30"
              src={`data:image/png;base64,${new Identicon(
                this.props.account,
                30
              ).toString()}`}
              alt="identicon"
            />
          ) : (
            <span></span>
          )}
        </div>
      </nav>
    );
  }
}

export default Navbar;
