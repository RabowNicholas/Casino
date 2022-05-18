import { Component } from "react";
import { ethers } from "ethers";
import "../index.css";

class Cage extends Component {
  render() {
    return (
      <div className="cage__container">
        <form className="card">
          <h1> Buy In </h1>
          <p className="card_statment">
            ETH Balance:
            {ethers.utils.formatEther(this.props.ethBalance).substring(0, 10)}
          </p>
          <input className="card__input" type="number" placeholder="0"></input>
          <input className="card__btn btn" type="submit" value="Swap"></input>
        </form>
        <form className="card">
          <h1> Cash Out </h1>
          <p>
            GMBL Balance:
            {ethers.utils.formatEther(this.props.gmblBalance).substring(0, 10)}
          </p>
          <input className="card__input" type="number" placeholder="0"></input>
          <input className="card__btn btn" type="submit" value="Swap"></input>
        </form>
      </div>
    );
  }
}

export default Cage;
