import { Component } from "react";
import { ethers } from "ethers";
import "../index.css";
import ethLogo from "../assets/eth_logo.svg";
import chipLogo from "../assets/chip_logo.png";

class StakeForm extends Component {
  render() {
    return (
      <>
        <h2 className="coming_soon_header"> Coming soon </h2>
        <div className="stakeform__container">
          <form className="card">
            <h1>Staking</h1>
            <p className="card_statment">
              Balance:{" "}
              {ethers.utils.formatEther(this.props.ethBalance).substring(0, 10)}
              <img src={ethLogo} alt="ethLogo" />
              ETH
            </p>
            <input
              className="card__input"
              type="number"
              placeholder="0"
            ></input>
            <input className="card__btn" type="submit" value="Stake"></input>
            <p>
              Amount Staked: 0 <img src={ethLogo} alt="ethLogo" />
              ETH
            </p>
            <input
              className="card__input"
              type="number"
              placeholder="0"
            ></input>
            <input className="card__btn" type="submit" value="Unstake"></input>
          </form>
          <form className="card">
            <h1>Rewards</h1>
            <p>
              <small> Earn 1000 GMBL per 1 ETH staked </small>
            </p>
            <p>
              {" "}
              Rewards Earned: 0 <img src={chipLogo} alt="gmbl logo" />
            </p>
            <input className="card__btn" type="submit" value="Claim"></input>
          </form>
        </div>
      </>
    );
  }
}

export default StakeForm;
