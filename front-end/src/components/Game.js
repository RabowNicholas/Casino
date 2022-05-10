import { Component } from "react";
import "../index.css";

class Game extends Component {
  render() {
    return (
      <div className={`gamecard ${this.props.live ? "" : "coming_soon"}`}>
        <h1> {this.props.name} </h1>
        <img src={this.props.image} alt={this.props.name} />
        <button className="gamecard__btn"> Join </button>
      </div>
    );
  }
}

export default Game;
