import { Component } from "react";
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
          <img src={chip_logo} alt="logo" />
          {navtabs}
        </div>
        <div className="navbar__account">
          <p>{this.props.account ? this.props.account : "Not Connected"}</p>
        </div>
      </nav>
    );
  }
}

export default Navbar;
