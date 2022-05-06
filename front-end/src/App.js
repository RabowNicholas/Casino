import { Component } from "react";
import { ethers } from "ethers";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import StakeForm from "./components/StakeForm";
import Footer from "./components/Footer";

class App extends Component {
  async connectBlockchain() {
    //get provider from metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log(provider);
    //get signer
    const signer = provider.getSigner();
    this.loadContracts(signer);
  }

  //LandingPage pass through functions
  async connectWallet() {
    //get account
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    await this.setState({ account: accounts[0] });
    this.setState({ page: "play" });
  }
  async loadContracts(signer) {
    console.log(signer);
  }

  //Navbar pass through functions
  clickStakeHandler() {
    this.setState({ page: "stake" });
    this.getWethBalance(this.state.account);
  }

  clickPlayHandler() {
    this.setState({ page: "play" });
  }

  async getWethBalance(account) {
    console.log("retreiving weth balance");
  }

  constructor(props) {
    super(props);
    this.state = {
      page: "landing",
      account: null,
      balanceEth: 0,
    };

    this.connectBlockchain();
    this.connectWallet = this.connectWallet.bind(this);
    this.clickStakeHandler = this.clickStakeHandler.bind(this);
    this.clickPlayHandler = this.clickPlayHandler.bind(this);
  }

  render() {
    let content;
    if (this.state.page === "landing") {
      content = <LandingPage connectWallet={this.connectWallet} />;
    } else if (this.state.page === "play") {
      content = <p> here will lie the play page </p>;
    } else if (this.state.page === "stake") {
      content = <StakeForm balanceEth={this.state.balanceEth} />;
    }
    return (
      <div>
        <Navbar
          account={this.state.account}
          page={this.state.page}
          clickStakeHandler={this.clickStakeHandler}
          clickPlayHandler={this.clickPlayHandler}
        />
        {content}
        <Footer />
      </div>
    );
  }
}

export default App;
