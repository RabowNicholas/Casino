import { Component } from "react";
import "../index.css";

class StakeForm extends Component {
  render() {
    return (
      <div className="stakeform__container">
        <form>
          <h1>Staking</h1>
          <p>WETH balance: {this.props.balanceEth} </p>{" "}
          <p> Current Reward Rate: </p>
          <input type="number" placeholder="0"></input>
          <input type="submit" value="Stake"></input>
        </form>
        <form>
          <h1>Rewards</h1> <p>Amount Staked:</p> <p> Rewards Earned:</p>
          <input type="submit" value="Claim"></input>
        </form>
      </div>
    );
  }
}

export default StakeForm;
