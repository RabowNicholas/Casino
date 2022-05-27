import { Component } from "react";
import { ethers } from "ethers";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import Cage from "./components/Cage";
import StakeForm from "./components/StakeForm";
import PlayCards from "./components/PlayCards";
import Footer from "./components/Footer";
import Roulette from "./components/Roulette";
import address_mapping from "./contracts_data/map.json";
import rouletteAbi from "./contracts_data/Roulette.json";
import gambleAbi from "./contracts_data/GambleToken.json";
import cageAbi from "./contracts_data/Cage.json";

class App extends Component {
  async connectBlockchain() {
    //get provider from metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    this.setState({ provider });
    const network = await provider.getNetwork();

    //get signer
    const signer = provider.getSigner();
    this.loadContracts(network.name, signer);
  }

  async loadContracts(network_name, signer) {
    let network_id;
    if (network_name === "rinkeby") {
      network_id = "4";
    }
    let rouletteAddress = address_mapping[network_id]["Roulette"][0];
    let gambleAddress = address_mapping[network_id]["GambleToken"][0];
    let cageAddress = address_mapping[network_id]["Cage"][0];
    const roulette = new ethers.Contract(
      rouletteAddress,
      rouletteAbi.abi,
      signer
    );
    const gamble = new ethers.Contract(gambleAddress, gambleAbi.abi, signer);
    const cage = new ethers.Contract(cageAddress, cageAbi.abi, signer);
    this.setState({ rouletteContract: roulette });
    this.setState({ gambleContract: gamble });
    this.setState({ cageContract: cage });
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

  //Navbar pass through functions
  async clickCageHandler() {
    this.setState({ page: "cage" });
  }
  clickPlayHandler() {
    this.setState({ page: "play" });
  }
  async clickStakeHandler() {
    this.setState({ page: "stake" });
  }

  changePage(page) {
    this.setState({ page });
  }
  async componentDidMount() {
    this.connectBlockchain();
  }

  constructor(props) {
    super(props);
    this.state = {
      provider: null,
      rouletteContract: 0x00,
      gambleContract: 0x00,
      cageContract: 0x00,
      page: "landing",
      account: null,
      ethBalance: 0,
      gmblBalance: 0,
    };

    this.connectWallet = this.connectWallet.bind(this);
    this.clickCageHandler = this.clickCageHandler.bind(this);
    this.clickPlayHandler = this.clickPlayHandler.bind(this);
    this.clickStakeHandler = this.clickStakeHandler.bind(this);
    this.changePage = this.changePage.bind(this);
  }

  render() {
    let content;
    if (this.state.page === "landing") {
      content = <LandingPage connectWallet={this.connectWallet} />;
    } else if (this.state.page === "play") {
      content = (
        <PlayCards
          account={this.state.account}
          gambleContract={this.state.gambleContract}
          rouletteContract={this.state.rouletteContract}
          changePage={this.changePage}
        />
      );
    } else if (this.state.page === "cage") {
      content = (
        <Cage
          account={this.state.account}
          provider={this.state.provider}
          cageContract={this.state.cageContract}
          gambleContract={this.state.gambleContract}
        />
      );
    } else if (this.state.page === "stake") {
      content = (
        <StakeForm
          account={this.state.account}
          provider={this.state.provider}
          cageContract={this.state.cageContract}
        />
      );
    } else if (this.state.page === "roulette") {
      content = (
        <Roulette
          account={this.state.account}
          provider={this.state.provider}
          rouletteContract={this.state.rouletteContract}
          gambleContract={this.state.gambleContract}
        />
      );
    }
    return (
      <div>
        <Navbar
          account={this.state.account}
          page={this.state.page}
          clickCageHandler={this.clickCageHandler}
          clickPlayHandler={this.clickPlayHandler}
          clickStakeHandler={this.clickStakeHandler}
        />
        {content}
        <Footer />
      </div>
    );
  }
}

export default App;
