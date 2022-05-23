import { Component } from "react";
import { ethers } from "ethers";
import "../index.css";
import ethLogo from "../assets/eth_logo.svg";
import chipLogo from "../assets/chip_logo.png";

class Cage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ethValue: 0,
      gmblValue: 0,
      form: "buyIn",
    };

    this.toggleForm = this.toggleForm.bind(this);
  }

  async getGamble(amount) {
    await this.props.cageContract.buyIn({ value: amount });
  }
  async getEther(amount) {
    await this.props.cageContract.cashOut(amount);
  }

  toggleForm() {
    console.log("changing");
    if (this.state.form === "buyIn") {
      this.setState({ form: "cashOut" });
    } else if (this.state.form === "cashOut") {
      this.setState({ form: "buyIn" });
    }
  }

  render() {
    let content;
    if (this.state.form === "cashOut") {
      content = (
        <form
          className="card"
          onSubmit={(event) => {
            event.preventDefault();
            let gambleAmount;
            gambleAmount = this.input.value.toString();
            gambleAmount = ethers.utils.parseEther(gambleAmount);
            this.getEther(gambleAmount);
          }}
        >
          <h1> Cash Out </h1>
          <p>
            GMBL Balance:
            {ethers.utils.formatEther(this.props.gmblBalance).substring(0, 10)}
            <img src={chipLogo} alt="gmbl logo" />
          </p>
          <input
            className="card__input"
            type="text"
            placeholder="0"
            onChange={(event) => {
              let gambleAmount = this.input.value.toString();
              this.setState({ gmblValue: gambleAmount });
            }}
            ref={(input) => {
              this.input = input;
            }}
          ></input>
          <p>
            {" "}
            ETH to receive: {this.state.gmblValue / 1000}{" "}
            <img src={ethLogo} alt="ethLogo" />
          </p>
          <input className="card__btn btn" type="submit" value="Swap"></input>
        </form>
      );
    } else if (this.state.form === "buyIn") {
      content = (
        <form
          className="card"
          onSubmit={(event) => {
            event.preventDefault();
            let etherAmount;
            etherAmount = this.input.value.toString();
            etherAmount = ethers.utils.parseEther(etherAmount);
            this.getGamble(etherAmount);
          }}
        >
          <h1> Buy In </h1>
          <p>
            ETH Balance:
            {ethers.utils.formatEther(this.props.ethBalance).substring(0, 10)}
            <img src={ethLogo} alt="ethLogo" />
          </p>
          <input
            className="card__input"
            type="text"
            placeholder="0"
            onChange={(event) => {
              let etherAmount = this.input.value.toString();
              this.setState({ ethValue: etherAmount });
            }}
            ref={(input) => {
              this.input = input;
            }}
          ></input>
          <p className="card_statement">
            GMBL to receive: {this.state.ethValue * 1000}
            <img src={chipLogo} alt="gmbl logo" />
          </p>
          <input className="card__btn btn" type="submit" value="Swap"></input>
        </form>
      );
    }
    return (
      <div className="cage__container">
        <div className="switch__container">
          <p> Buy In </p>
          <label className="switch">
            <input type="checkbox" onChange={this.toggleForm}></input>
            <span className="slider round"></span>
          </label>
          <p> Cash Out </p>
        </div>
        {content}
      </div>
    );
  }
}

export default Cage;
