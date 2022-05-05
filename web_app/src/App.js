import { Component } from "react";
import LandingPage from "./components/LandingPage";
import Footer from "./components/Footer";

class App extends Component {
  connectWallet() {
    console.log("connecting wallet...");
  }

  constructor(props) {
    super(props);
    this.connectWallet = this.connectWallet.bind(this);
  }

  render() {
    let content;
    content = <LandingPage connectWallet={this.connectWallet} />;
    return (
      <div className="App">
        {content}
        <Footer />
      </div>
    );
  }
}

export default App;
