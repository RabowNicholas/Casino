
import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Main from './Main';
import cage from '../contracts/Cage.json';
import roulette from '../contracts/Roulette.json';

const cageAddress = "0x6Eb6A94EbeF61110B83443997ff1Be6D5Ea0CD4f";
const cageAbi = cage.abi;
const rouletteAddress = "0x28408e076362668B51fa9a97Bad70D517Edb9f1F";
const rouletteAbi = roulette.abi;

class App extends Component {

componentWillMount() {
  this.loadBlockchainData()
}

async loadBlockchainData() {
  const web3 = new Web3(Web3.givenProvider)
  const accounts = await web3.eth.getAccounts()
  this.setState({ account: accounts[0]})
  const cage = new web3.eth.Contract(cageAbi, cageAddress)
  this.setState({ cage })
  const roulette = new web3.eth.Contract(rouletteAbi, rouletteAddress)
  this.setState({ roulette })
}

async connectWalletHandler() {
  const {ethereum} = window
  try {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts'})
    this.setState({ account: accounts[0]})
    window.location.reload(false)
  }
  catch(err) {
    console.log(err)
  }
}

connectButton() {
  return (
    <button className='button' onClick={this.connectWalletHandler}>
    Connect Wallet
    </button>
  )
}

changeDisplayForm(newForm) {
  let display_form = newForm;
  console.log(display_form);
}



constructor(props) {
  super(props)
  this.state = {
    account: '',
    cage: '',
    roulette: '',
    display_form: "stake"
  }
}


render() {
  return (
    <div className="App">
      <nav className='nav'>
        <h1 class="neon" data-text="U">
          CR
          <span class="flicker-slow">Y</span>
          P
          <span class="flicker-fast">TO</span>
          C
          <span class="flicker-fast">A</span>
          S
          <span class="flicker-slow">IN</span>
          O
        </h1>
        <p className='account'>
          { this.state.account ? this.state.account : this.connectButton() }
        </p>
      </nav>
      <div className='nav-buttons-container'>
        <button className='button nav-buttons' onClick={changeDisplayForm("stake")}> Stake </button>
        <button className='button nav-buttons' onClick={changeDisplayForm("play")}> Play </button>
      </div>
      <Main content={this.display_form}/>

    </div>
  )};
}

export default App;
