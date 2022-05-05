import { Component } from "react";
import { ethers } from "ethers";
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

  constructor(props) {
    super(props);
    this.state = {
      page: "landing",
      account: null,
    };
    this.web3Handler = this.web3Handler.bind(this);
  }

  render() {
    let content;
    if (this.state.page == "landing") {
      content = <LandingPage web3Handler={this.web3Handler} />;
    } else {
      content = <p> here will lie the play page </p>;
    }
    return (
      <div className="App">
        {content}
        <Footer />
      </div>
    );
  }
}

export default App;
