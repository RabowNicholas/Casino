import { Component } from "react";
import "../index.css";
import logo from "../assets/logo.gif";

class LandingPage extends Component {
  render() {
    return (
      <div className="landing__page">
        <img src={logo} alt="logo" />
        <button
          className="btn"
          onClick={(event) => {
            this.props.connectWallet();
          }}
        >
          Enter
        </button>
      </div>
    );
  }
}

export default LandingPage;
