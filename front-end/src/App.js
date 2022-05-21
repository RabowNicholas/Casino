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
    let rouletteAddress = address_mapping[network_name]["Roulette"];
    let gambleAddress = address_mapping[network_name]["GambleToken"];
    let cageAddress = address_mapping[network_name]["Cage"];
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

  //Navbar pass through functions
  async clickCageHandler() {
    this.setState({ page: "cage" });
    const provider = this.state.provider;
    const ethBalance = await provider.getBalance(this.state.account);
    let gmblBalance = await this.state.gambleContract.balanceOf(
      this.state.account
    );
    this.setState({ ethBalance });
    this.setState({ gmblBalance });
  }

  clickPlayHandler() {
    this.setState({ page: "play" });
  }

  async clickStakeHandler() {
    this.setState({ page: "stake" });
    const ethBalance = await this.state.provider.getBalance(this.state.account);
    let gmblBalance = await this.state.gambleContract.balanceOf(
      this.state.account
    );
    this.setState({ ethBalance });
  }

  //PlayCards pass through functions
  async clickJoinRouletteHandler() {
    if ((await this.state.gambleContract.balanceOf(this.state.account)) === 0) {
      alert(
        "You need GMBL to sit down at table. Go to Cage to get more chips."
      );
    } else {
      await this.state.rouletteContract.joinTable();
      let isAtTable = await this.state.rouletteContract.isAtTable(
        this.state.account
      );
      if (isAtTable) {
        this.setState({ page: "roulette" });
      }
    }
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
    this.clickJoinRouletteHandler = this.clickJoinRouletteHandler.bind(this);
    this.clickStakeHandler = this.clickStakeHandler.bind(this);
  }

  render() {
    let content;
    if (this.state.page === "landing") {
      content = <LandingPage connectWallet={this.connectWallet} />;
    } else if (this.state.page === "play") {
      content = <PlayCards joinRoulette={this.clickJoinRouletteHandler} />;
    } else if (this.state.page === "cage") {
      content = (
        <Cage
          ethBalance={this.state.ethBalance}
          gmblBalance={this.state.gmblBalance}
          cageContract={this.state.cageContract}
        />
      );
    } else if (this.state.page === "stake") {
      content = (
        <StakeForm
          account={this.state.account}
          ethBalance={this.state.ethBalance}
          cageContract={this.state.cageContract}
        />
      );
    } else if (this.state.page === "roulette") {
      content = (
        <Roulette
          rouletteContract={this.state.rouletteContract}
          account={this.state.account}
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
