import { Component } from "react";
import "../index.css";
import Game from "./Game";
import rouletteTable from "../assets/roulette_table.png";
import slots from "../assets/slots.png";
import blackjack from "../assets/blackjack.png";

class PlayCards extends Component {
  async joinRoulette() {
    if ((await this.props.gambleContract.balanceOf(this.props.account)) === 0) {
      alert(
        "You need GMBL to sit down at table. Go to Cage to get more chips."
      );
    } else {
      let isAtTable = await this.props.rouletteContract.isAtTable(
        this.props.account
      );
      if (isAtTable) {
        this.props.changePage("roulette");
      } else if (!isAtTable) {
        await this.props.rouletteContract.joinTable();
        this.setState({ page: "roulette" });
      }
    }
  }

  constructor(props) {
    super(props);
    this.joinRoulette = this.joinRoulette.bind(this);
  }
  render() {
    return (
      <div className="playcards__container">
        <Game
          name="Roulette"
          image={rouletteTable}
          live={true}
          join={this.joinRoulette}
        />
        <Game name="Slots" image={slots} live={false} />
        <Game name="Blackjack" image={blackjack} live={false} />
      </div>
    );
  }
}

export default PlayCards;
