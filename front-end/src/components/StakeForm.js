import { Component } from "react";
import { ethers } from "ethers";
import "../index.css";
import ethLogo from "../assets/eth_logo.svg";
import chipLogo from "../assets/chip_logo.png";

class StakeForm extends Component {
  toggleForm() {
    if (this.state.stakeForm === "stake") {
      this.setState({ stakeForm: "unstake" });
    } else if (this.state.stakeForm === "unstake") {
      this.setState({ stakeForm: "stake" });
    }
  }

  async handleStakeSubmit(e) {
    e.preventDefault();
    if (this.state.stakeForm === "stake") {
      let amountToStake = ethers.utils.parseEther(this.state.stakeAmount);
      console.log(amountToStake);
      await this.props.cageContract.stake({ value: amountToStake });
    } else if (this.state.stakeForm === "unstake") {
      let amountToUnstake = ethers.utils.parseEther(this.state.unstakeAmount);
      await this.props.cageContract.withdraw(amountToUnstake);
    }
  }

  async handleClaimSubmit(e) {
    e.preventDefault();
    if (this.state.rewardsEarned == 0) {
      alert(
        "No rewards to claim at the moment. Stake more ETH or wait until tomorrow's drop!"
      );
    }
  }
  async componentDidMount() {
    const stakedAmount = await this.props.cageContract.getStakedAmount(
      this.props.account
    );
    this.setState({
      stakedAmount: ethers.utils.formatEther(stakedAmount._hex),
    });
    const rewardsEarned = await this.props.cageContract.getRewardValue(
      this.props.account
    );
    this.setState({ rewardsEarned: parseInt(rewardsEarned, 10) });
  }
  constructor(props) {
    super(props);
    this.state = {
      stakeForm: "stake",
      stakeAmount: 0,
      unstakeAmount: 0,
      stakedAmount: 0,
      rewardsEarned: 0,
    };
    this.toggleForm = this.toggleForm.bind(this);
    this.handleStakeSubmit = this.handleStakeSubmit.bind(this);
    this.handleClaimSubmit = this.handleClaimSubmit.bind(this);
  }
  render() {
    let stakeContent;
    if (this.state.stakeForm === "stake") {
      stakeContent = (
        <>
          <p className="card_statment">
            Balance:{" "}
            {ethers.utils.formatEther(this.props.ethBalance).substring(0, 10)}
            <img src={ethLogo} alt="ethLogo" />
            ETH
          </p>
          <input
            className="card__input"
            type="text"
            placeholder="0"
            onChange={(event) => {
              let stakeAmount = this.input.value.toString();
              this.setState({ stakeAmount });
            }}
            ref={(input) => {
              this.input = input;
            }}
          ></input>
          <input className="btn" type="submit" value="Stake"></input>
        </>
      );
    } else if (this.state.stakeForm === "unstake") {
      stakeContent = (
        <>
          <p>
            Amount Staked: {this.state.stakedAmount}{" "}
            <img src={ethLogo} alt="ethLogo" />
            ETH
          </p>
          <input
            className="card__input"
            type="text"
            placeholder="0"
            onChange={(event) => {
              let unstakeAmount = this.input.value.toString();
              this.setState({ unstakeAmount });
            }}
            ref={(input) => {
              this.input = input;
            }}
          ></input>
          <input className="btn" type="submit" value="Unstake" />{" "}
        </>
      );
    }
    return (
      <>
        <div className="stakeform__container">
          <form className="card" onSubmit={this.handleStakeSubmit}>
            <h1>Staking</h1>
            <div className="switch__container">
              <p> Stake </p>
              <label className="switch">
                <input type="checkbox" onChange={this.toggleForm}></input>
                <span className="slider round"></span>
              </label>
              <p> Unstake </p>
            </div>
            {stakeContent}
          </form>

          <form className="card">
            <h1>Rewards</h1>
            <p>
              <small> Earn 1000 GMBL per 1 ETH staked </small>
            </p>
            <p>
              Amount Staked: {this.state.stakedAmount}{" "}
              <img src={ethLogo} alt="ethLogo" />
              ETH
            </p>
            <p>
              {" "}
              Rewards Earned:{" "}
              {ethers.utils.formatEther(this.state.rewardsEarned) * 1000}
              <img src={chipLogo} alt="gmbl logo" />
            </p>

            <button className="btn" onClick={this.handleClaimSubmit}>
              {" "}
              Claim{" "}
            </button>
          </form>
        </div>
      </>
    );
  }
}

export default StakeForm;
