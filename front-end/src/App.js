import { Component } from "react";
import { ethers } from "ethers";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import Footer from "./components/Footer";

class App extends Component {
  async web3Handler() {
    //get account
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    this.setState({ account: accounts[0] });
    //get provider from metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    //get signer
    const signer = provider.getSigner();
    this.loadContracts(signer);
  }
  async loadContracts(signer) {
    console.log(signer);
    this.setState({ page: "play" });
  }

  clickStakeHandler() {
    this.setState({ page: "stake" });
  }

  clickPlayHandler() {
    this.setState({ page: "play" });
  }

  constructor(props) {
    super(props);
    this.state = {
      page: "landing",
      account: null,
    };
    this.web3Handler = this.web3Handler.bind(this);
    this.clickStakeHandler = this.clickStakeHandler.bind(this);
    this.clickPlayHandler = this.clickPlayHandler.bind(this);
  }

  render() {
    let content;
    if (this.state.page === "landing") {
      content = <LandingPage web3Handler={this.web3Handler} />;
    } else if (this.state.page === "play") {
      content = <p> here will lie the play page </p>;
    } else if (this.state.page === "stake") {
      content = <p> stake form </p>;
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
