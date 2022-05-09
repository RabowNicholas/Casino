import { Component } from "react";
import { ethers } from "ethers";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import StakeForm from "./components/StakeForm";
import Footer from "./components/Footer";
import address_mapping from "./contracts_data/map.json";

class App extends Component {
  async componentDidMount() {
    this.connectBlockchain();
  }
  async connectBlockchain() {
    //get provider from metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    this.setState({ provider });
    const network = await provider.getNetwork();

    //get signer
    const signer = provider.getSigner();
    this.loadContracts(network.name, signer);
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
  async loadContracts(network_name, signer) {
    console.log(network_name);
  }

  //Navbar pass through functions
  async clickStakeHandler() {
    this.setState({ page: "stake" });
    const provider = this.state.provider;
    const ethBalance = await provider.getBalance(this.state.account);
    this.setState({ ethBalance });
  }

  clickPlayHandler() {
    this.setState({ page: "play" });
  }

  constructor(props) {
    super(props);
    this.state = {
      provider: null,
      page: "landing",
      account: null,
      ethBalance: 0,
    };

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
      content = <StakeForm ethBalance={this.state.ethBalance} />;
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
