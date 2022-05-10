import { Component } from "react";
import "../index.css";
import Game from "./Game";
import rouletteTable from "../assets/roulette_table.png";
import slots from "../assets/slots.png";
import blackjack from "../assets/blackjack.png";

class PlayCards extends Component {
  render() {
    return (
      <div className="playcards__container">
        <Game name="Roulette" image={rouletteTable} live={true} />
        <Game name="Slots" image={slots} live={false} />
        <Game name="Blackjack" image={blackjack} live={false} />
      </div>
    );
  }
}

export default PlayCards;
