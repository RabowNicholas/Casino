import { Component } from "react";
import "../index.css";
import roulette_wheel from "../assets/roulette/wheel.png";
import roulette_animate from "../assets/roulette/roulette_animate.gif";
import t0 from "../assets/roulette/table/0.png";
import t00 from "../assets/roulette/table/00.png";
import t1 from "../assets/roulette/table/1.png";
import t2 from "../assets/roulette/table/2.png";
import t3 from "../assets/roulette/table/3.png";
import t4 from "../assets/roulette/table/4.png";
import t5 from "../assets/roulette/table/5.png";
import t6 from "../assets/roulette/table/6.png";
import t7 from "../assets/roulette/table/7.png";
import t8 from "../assets/roulette/table/8.png";
import t9 from "../assets/roulette/table/9.png";
import t10 from "../assets/roulette/table/10.png";
import t11 from "../assets/roulette/table/11.png";
import t12 from "../assets/roulette/table/12.png";
import t13 from "../assets/roulette/table/13.png";
import t14 from "../assets/roulette/table/14.png";
import t15 from "../assets/roulette/table/15.png";
import t16 from "../assets/roulette/table/16.png";
import t17 from "../assets/roulette/table/17.png";
import t18 from "../assets/roulette/table/18.png";
import t19 from "../assets/roulette/table/19.png";
import t20 from "../assets/roulette/table/20.png";
import t21 from "../assets/roulette/table/21.png";
import t22 from "../assets/roulette/table/22.png";
import t23 from "../assets/roulette/table/23.png";
import t24 from "../assets/roulette/table/24.png";
import t25 from "../assets/roulette/table/25.png";
import t26 from "../assets/roulette/table/26.png";
import t27 from "../assets/roulette/table/27.png";
import t28 from "../assets/roulette/table/28.png";
import t29 from "../assets/roulette/table/29.png";
import t30 from "../assets/roulette/table/30.png";
import t31 from "../assets/roulette/table/31.png";
import t32 from "../assets/roulette/table/32.png";
import t33 from "../assets/roulette/table/33.png";
import t34 from "../assets/roulette/table/34.png";
import t35 from "../assets/roulette/table/35.png";
import t36 from "../assets/roulette/table/36.png";
import cols from "../assets/roulette/table/columns.png";
import f12 from "../assets/roulette/table/first12.png";
import s12 from "../assets/roulette/table/second12.png";
import th12 from "../assets/roulette/table/third12.png";
import _1to18 from "../assets/roulette/table/1to18.png";
import _19to36 from "../assets/roulette/table/19to36.png";
import even from "../assets/roulette/table/even.png";
import odd from "../assets/roulette/table/odd.png";
import red from "../assets/roulette/table/red.png";
import black from "../assets/roulette/table/black.png";
import blank from "../assets/roulette/table/blank.png";
import chip1 from "../assets/chip1.png";
import chip5 from "../assets/chip5.png";
import chip10 from "../assets/chip10.png";
import chip25 from "../assets/chip25.png";
import chip100 from "../assets/chip100.png";
import chipeth from "../assets/chipeth.png";
import stopArray from "../assets/roulette/stop/stopArray";

class Roulette extends Component {
  betBuffer = new Array();
  BET = {
    Red: 0,
    Black: 1,
    Even: 2,
    Odd: 3,
    High: 4,
    Low: 5,
    Column1_34: 6,
    Column2_35: 7,
    Column3_36: 8,
    FirstDozen: 9,
    SecondDozen: 10,
    ThirdDozen: 11,
    Zero: 12,
    DoubleZero: 13,
    One: 14,
    Two: 15,
    Three: 16,
    Four: 17,
    Five: 18,
    Six: 19,
    Seven: 20,
    Eight: 21,
    Nine: 22,
    Ten: 23,
    Eleven: 24,
    Twelve: 25,
    Thirteen: 26,
    Fourteen: 27,
    Fifteen: 28,
    Sixteen: 29,
    Seventeen: 30,
    Eighteen: 31,
    Nineteen: 32,
    Twenty: 33,
    Twentyone: 34,
    Twentytwo: 35,
    Twentythree: 36,
    Twentyfour: 37,
    Twentyfive: 38,
    Twentysix: 39,
    Twentyseven: 40,
    Twentyeight: 41,
    Twentynine: 42,
    Thirty: 43,
    Thirtyone: 44,
    Thirtytwo: 45,
    Thirtythree: 46,
    Thirtyfour: 47,
    Thirtyfive: 48,
    Thirtysix: 49,
    Split_1_4: 50,
    Split_1_2: 51,
    Split_2_3: 52,
    Split_2_5: 53,
    Split_3_6: 54,
    Split_4_5: 55,
    Split_4_7: 56,
    Split_5_6: 57,
    Split_5_8: 58,
    Split_6_9: 59,
    Split_7_8: 60,
    Split_7_10: 61,
    Split_8_9: 62,
    Split_8_11: 63,
    Split_9_12: 64,
    Split_10_11: 65,
    Split_10_13: 66,
    Split_11_12: 67,
    Split_11_14: 68,
    Split_12_15: 69,
    Split_13_14: 70,
    Split_13_16: 71,
    Split_14_15: 72,
    Split_14_17: 73,
    Split_15_18: 74,
    Split_16_17: 75,
    Split_16_19: 76,
    Split_17_18: 77,
    Split_17_20: 78,
    Split_18_21: 79,
    Split_19_20: 80,
    Split_19_22: 81,
    Split_20_21: 82,
    Split_20_23: 83,
    Split_21_24: 84,
    Split_22_23: 85,
    Split_22_25: 86,
    Split_23_24: 87,
    Split_23_26: 88,
    Split_24_27: 89,
    Split_25_26: 90,
    Split_25_28: 91,
    Split_26_27: 92,
    Split_26_29: 93,
    Split_27_30: 94,
    Split_28_29: 95,
    Split_28_31: 96,
    Split_29_30: 97,
    Split_29_32: 98,
    Split_30_33: 99,
    Split_31_32: 100,
    Split_31_34: 101,
    Split_32_33: 102,
    Split_32_35: 103,
    Split_33_36: 104,
    Split_34_35: 105,
    Split_35_36: 106,
    Square_1245: 107,
    Square_2356: 108,
    Square_4578: 109,
    Square_5689: 110,
    Square_781011: 111,
    Square_891112: 112,
    Square_10111314: 113,
    Square_11121415: 114,
    Square_13141617: 115,
    Square_14151718: 116,
    Square_16171920: 117,
    Square_17182021: 118,
    Square_19202223: 119,
    Square_20212324: 120,
    Square_22232526: 121,
    Square_23242627: 122,
    Square_25262829: 123,
    Square_26272930: 124,
    Square_28293132: 125,
    Square_29303233: 126,
    Square_31323435: 127,
    Square_32333536: 128,
  };

  changeChipSelect(chip) {
    this.setState({ chipSelect: chip });
  }

  handleChange(e) {
    this.setState({ extraBet: e.target.value });
  }

  handleAddBet() {
    this.betBuffer.push({
      chip: this.state.chipSelect,
      value: this.state.extraBet,
    });
    this.setState((prevState) => ({
      Bets: [...prevState.Bets, this.state.extraBet],
    }));
    this.setState({ amounts: [...this.state.amounts, this.state.chipSelect] });
  }

  handleNumberClick(e) {
    this.betBuffer.push({ chip: this.state.chipSelect, value: e.target.id });
    let currentBet = this.BET[e.target.id];
    this.setState({ Bets: [...this.state.Bets, currentBet] });
    this.setState({ amounts: [...this.state.amounts, this.state.chipSelect] });
  }

  handleClearBets() {
    this.betBuffer.length = 0;
    this.setState({ Bets: [] });
    this.setState({ amounts: [] });
    this.setState({ state: "waiting_for_bet" });
  }

  handlePlaceBets() {
    let amounts = [...this.state.amounts];
    for (var i = 0; i < amounts.length; i++) {
      if (amounts[i] == "1 ETH") {
        amounts[i] = 1000;
      }
      amounts[i] = amounts[i] * 1e15;
    }
    this.setState({ amounts }, this.placeBets);
  }

  async placeBets() {
    console.log(this.state.amounts);
    console.log(this.state.Bets);
    await this.props.rouletteContract.placeBet(
      this.state.amounts,
      this.state.Bets
    );
    this.spinWheel();
  }

  async spinWheel() {
    //will work while the owner is playing, but no one else. to improve use chainlink keepers to make spinWheel call.
    this.setState({ state: "spinning" });
    await this.props.rouletteContract.spinWheel();
    const winningNumber = await this.props.rouletteContract.getWinningNumber();
    this.setState({ winningNumber }, console.log(winningNumber));
    this.setState({ state: "stopped" });
  }

  async handleSettlement() {
    console.log("settling...");
    await this.props.rouletteContract.settleAllBets();
    const winnings = await this.props.rouletteContract.getWinnings(
      this.props.account
    );
    console.log(winnings);
    this.setState({ state: "waiting_for_bet" });
  }

  constructor(props) {
    super(props);
    this.state = {
      state: "waiting_for_bet",
      chipSelect: "1",
      extraBet: "None",
      Bets: [],
      amounts: [],
      winningNumber: 0,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleAddBet = this.handleAddBet.bind(this);
    this.handleNumberClick = this.handleNumberClick.bind(this);
    this.handleClearBets = this.handleClearBets.bind(this);
    this.handlePlaceBets = this.handlePlaceBets.bind(this);
    this.spinWheel = this.spinWheel.bind(this);
    this.placeBets = this.placeBets.bind(this);
    this.handleSettlement = this.handleSettlement.bind(this);
  }
  render() {
    let wheel_img;
    if (this.state.state === "waiting_for_bet") {
      wheel_img = roulette_wheel;
    } else if (this.state.state === "spinning") {
      wheel_img = roulette_animate;
    } else if (this.state.state === "stopped") {
      wheel_img = stopArray[this.state.winningNumber];
      this.handleSettlement();
    }

    const betOptionsSplits = [
      {
        label: "1 4",
        value: "Split_1_4",
      },
      {
        label: "1 2",
        value: "Split_1_2",
      },
      {
        label: "2 3",
        value: "Split_2_3",
      },
      {
        label: "2 5",
        value: "Split_2_5",
      },
      {
        label: "3 6",
        value: "Split_3_6",
      },
      {
        label: "4 5",
        value: "Split_4_5",
      },
      {
        label: "4 7",
        value: "Split_4_7",
      },
      {
        label: "5 6",
        value: "Split_5_6",
      },
      {
        label: "5 8",
        value: "Split_5_8",
      },
      {
        label: "6 9",
        value: "Split_6_9",
      },
      {
        label: "7 8",
        value: "Split_7_8",
      },
      {
        label: "7 10",
        value: "Split_7_10",
      },
      {
        label: "8 9",
        value: "Split_8_9",
      },
      {
        label: "8 11",
        value: "Split_8_11",
      },
      {
        label: "9 12",
        value: "Split_9_12",
      },
      {
        label: "10 11",
        value: "Split_10_11",
      },
      {
        label: "10 13",
        value: "Split_10_13",
      },
      {
        label: "11 12",
        value: "Split_11_12",
      },
      {
        label: "11 14",
        value: "Split_11_14",
      },
      {
        label: "12 15",
        value: "Split_12_15",
      },
      {
        label: "13 14",
        value: "Split_13_14",
      },
      {
        label: "13 16",
        value: "Split_13_16",
      },
      {
        label: "14 15",
        value: "Split_14_15",
      },
      {
        label: "14 17",
        value: "Split_14_17",
      },
      {
        label: "15 18",
        value: "Split_15_18",
      },
      {
        label: "16 17",
        value: "Split_16_17",
      },
      {
        label: "16 19",
        value: "Split_16_19",
      },
      {
        label: "17 18",
        value: "Split_17_18",
      },
      {
        label: "17 20",
        value: "Split_17_20",
      },
      {
        label: "18 21",
        value: "Split_18_21",
      },
      {
        label: "19 20",
        value: "Split_19_20",
      },
      {
        label: "19 22",
        value: "Split_19_22",
      },
      {
        label: "20 21",
        value: "Split_20_21",
      },
      {
        label: "20 23",
        value: "Split_20_23",
      },
      {
        label: "21 24",
        value: "Split_21_24",
      },
      {
        label: "22 23",
        value: "Split_22_23",
      },
      {
        label: "22 25",
        value: "Split_22_25",
      },
      {
        label: "23 24",
        value: "Split_23_24",
      },
      {
        label: "23 26",
        value: "Split_23_26",
      },
      {
        label: "24 27",
        value: "Split_24_27",
      },
      {
        label: "25 26",
        value: "Split_25_26",
      },
      {
        label: "25 28",
        value: "Split_25_28",
      },
      {
        label: "26 27",
        value: "Split_26_27",
      },
      {
        label: "26 29",
        value: "Split_26_29",
      },
      {
        label: "27 30",
        value: "Split_27_30",
      },
      {
        label: "28 29",
        value: "Split_28_29",
      },
      {
        label: "28 31",
        value: "Split_28_31",
      },
      {
        label: "29 30",
        value: "Split_29_30",
      },
      {
        label: "29 32",
        value: "Split_29_32",
      },
      {
        label: "30 33",
        value: "Split_30_33",
      },
      {
        label: "31 32",
        value: "Split_31_32",
      },
      {
        label: "31 34",
        value: "Split_31_34",
      },
      {
        label: "32 33",
        value: "Split_32_33",
      },
      {
        label: "32 35",
        value: "Split_32_35",
      },
      {
        label: "33 36",
        value: "Split_33_36",
      },
      {
        label: "34 35",
        value: "Split_34_35",
      },
      {
        label: "35 36",
        value: "Split_35_36",
      },
    ];
    const betOptionsSquares = [
      {
        label: "1 2 4 5",
        value: "Square_1245",
      },
      {
        label: "2 3 5 6",
        value: "Square_2356",
      },
      {
        label: "4 5 7 8",
        value: "Square_4578",
      },
      {
        label: "5 6 8 9",
        value: "Square_5689",
      },
      {
        label: "7 8 10 11",
        value: "Square_781011",
      },
      {
        label: "8 9 11 12",
        value: "Square_891112",
      },
      {
        label: "10 11 13 14",
        value: "Square_10111314",
      },
      {
        label: "11 12 14 15",
        value: "Square_11121415",
      },
      {
        label: "13 14 16 17",
        value: "Square_13141617",
      },
      {
        label: "14 15 17 18",
        value: "Square_14151718",
      },
      {
        label: "16 17 19 20",
        value: "Square_16171920",
      },
      {
        label: "17 18 20 21",
        value: "Square_17182021",
      },
      {
        label: "19 20 22 23",
        value: "Square_19202223",
      },
      {
        label: "20 21 23 24",
        value: "Square_20212324",
      },
      {
        label: "22 23 25 26",
        value: "Square_22232526",
      },
      {
        label: "23 24 26 27",
        value: "Square_23242627",
      },
      {
        label: "25 26 28 29",
        value: "Square_25262829",
      },
      {
        label: "26 27 29 30",
        value: "Square_26272930",
      },
      {
        label: "28 29 31 32",
        value: "Square_28293132",
      },
      {
        label: "29 30 32 33",
        value: "Square_29303233",
      },
      {
        label: "31 32 34 35",
        value: "Square_31323435",
      },
      {
        label: "32 33 35 36",
        value: "Square_32333536",
      },
    ];

    return (
      <>
        <div className="roulette__container">
          <img className="roulette__wheel" src={wheel_img} alt="wheel" />
          <div className="roulette__table">
            <div className="numbers">
              <img
                src={t0}
                alt="0"
                id="Zero"
                onClick={this.handleNumberClick}
              />
              <img
                src={t3}
                alt="3"
                id="Three"
                onClick={this.handleNumberClick}
              />
              <img src={t6} alt="6" id="Six" onClick={this.handleNumberClick} />
              <img
                src={t9}
                alt="9"
                id="Nine"
                onClick={this.handleNumberClick}
              />
              <img
                src={t12}
                alt="12"
                id="Twelve"
                onClick={this.handleNumberClick}
              />
              <img
                src={t15}
                alt="15"
                id="Fifteen"
                onClick={this.handleNumberClick}
              />
              <img
                src={t18}
                alt="18"
                id="Eighteen"
                onClick={this.handleNumberClick}
              />
              <img
                src={t21}
                alt="21"
                id="Twentyone"
                onClick={this.handleNumberClick}
              />
              <img
                src={t24}
                alt="24"
                id="Twentyfour"
                onClick={this.handleNumberClick}
              />
              <img
                src={t27}
                alt="27"
                id="Twentyseven"
                onClick={this.handleNumberClick}
              />
              <img
                src={t30}
                alt="30"
                id="Thirty"
                onClick={this.handleNumberClick}
              />
              <img
                src={t33}
                alt="33"
                id="Thirtythree"
                onClick={this.handleNumberClick}
              />
              <img
                src={t36}
                alt="36"
                id="Thirtysix"
                onClick={this.handleNumberClick}
              />
              <img
                src={cols}
                alt="cols"
                id="Column3_36"
                onClick={this.handleNumberClick}
              />
              <img
                src={t00}
                alt="00"
                id="DoubleZero"
                onClick={this.handleNumberClick}
              />
              <img src={t2} alt="2" id="Two" onClick={this.handleNumberClick} />
              <img
                src={t5}
                alt="5"
                id="Five"
                onClick={this.handleNumberClick}
              />
              <img
                src={t8}
                alt="8"
                id="Eight"
                onClick={this.handleNumberClick}
              />
              <img
                src={t11}
                alt="11"
                id="Eleven"
                onClick={this.handleNumberClick}
              />
              <img
                src={t14}
                alt="14"
                id="Fourteen"
                onClick={this.handleNumberClick}
              />
              <img
                src={t17}
                alt="17"
                id="Seventeen"
                onClick={this.handleNumberClick}
              />
              <img
                src={t20}
                alt="20"
                id="Twenty"
                onClick={this.handleNumberClick}
              />
              <img
                src={t23}
                alt="23"
                id="Twentythree"
                onClick={this.handleNumberClick}
              />
              <img
                src={t26}
                alt="26"
                id="Twentysix"
                onClick={this.handleNumberClick}
              />
              <img
                src={t29}
                alt="29"
                id="Twentynine"
                onClick={this.handleNumberClick}
              />
              <img
                src={t32}
                alt="32"
                id="Thirtytwo"
                onClick={this.handleNumberClick}
              />
              <img
                src={t35}
                alt="35"
                id="Thirtyfive"
                onClick={this.handleNumberClick}
              />
              <img
                src={cols}
                alt="cols"
                id="Column2_35"
                onClick={this.handleNumberClick}
              />
              <img
                src={blank}
                alt="blank"
                id="blank"
                onClick={this.handleNumberClick}
              />
              <img src={t1} alt="1" id="One" onClick={this.handleNumberClick} />
              <img
                src={t4}
                alt="4"
                id="Four"
                onClick={this.handleNumberClick}
              />
              <img
                src={t7}
                alt="7"
                id="Seven"
                onClick={this.handleNumberClick}
              />
              <img
                src={t10}
                alt="10"
                id="Ten"
                onClick={this.handleNumberClick}
              />
              <img
                src={t13}
                alt="13"
                id="Thirteen"
                onClick={this.handleNumberClick}
              />
              <img
                src={t16}
                alt="16"
                id="Sixteen"
                onClick={this.handleNumberClick}
              />
              <img
                src={t19}
                alt="19"
                id="Nineteen"
                onClick={this.handleNumberClick}
              />
              <img
                src={t22}
                alt="22"
                id="Twentytwo"
                onClick={this.handleNumberClick}
              />
              <img
                src={t25}
                alt="25"
                id="Twentyfive"
                onClick={this.handleNumberClick}
              />
              <img
                src={t28}
                alt="28"
                id="Twentyeight"
                onClick={this.handleNumberClick}
              />
              <img
                src={t31}
                alt="31"
                id="Thirtyone"
                onClick={this.handleNumberClick}
              />
              <img
                src={t34}
                alt="34"
                id="Thirtyfour"
                onClick={this.handleNumberClick}
              />
              <img
                src={cols}
                alt="cols"
                id="Column1_34"
                onClick={this.handleNumberClick}
              />
            </div>
            <div className="dozens">
              <img
                src={f12}
                alt="first12 "
                id="FirstDozen"
                onClick={this.handleNumberClick}
              />
              <img
                src={s12}
                alt="second1 2"
                id="SecondDozen"
                onClick={this.handleNumberClick}
              />
              <img
                src={th12}
                alt="third12 "
                id="ThirdDozen"
                onClick={this.handleNumberClick}
              />
            </div>
            <div className="outsidebets">
              <img
                src={_1to18}
                alt="1to18"
                id="Low"
                onClick={this.handleNumberClick}
              />
              <img
                src={even}
                alt="even"
                id="Even"
                onClick={this.handleNumberClick}
              />
              <img
                src={red}
                alt="red"
                id="Red"
                onClick={this.handleNumberClick}
              />
              <img
                src={black}
                alt="black"
                id="Black"
                onClick={this.handleNumberClick}
              />
              <img
                src={odd}
                alt="odd"
                id="Odd"
                onClick={this.handleNumberClick}
              />
              <img
                src={_19to36}
                alt="19to36"
                id="High"
                onClick={this.handleNumberClick}
              />
            </div>
            <p className="chip_select">
              Current Chip Selected: {this.state.chipSelect}
            </p>
            <div className="chips">
              <img
                src={chip1}
                alt="1gmbl"
                onClick={(event) => {
                  this.changeChipSelect("1");
                }}
              />
              <img
                src={chip5}
                alt="5gmbl"
                onClick={(event) => {
                  this.changeChipSelect("5");
                }}
              />
              <img
                src={chip25}
                alt="25gmbl"
                onClick={(event) => {
                  this.changeChipSelect("25");
                }}
              />
              <img
                src={chip100}
                alt="100gmbl"
                onClick={(event) => {
                  this.changeChipSelect("100");
                }}
              />
              <img
                src={chipeth}
                alt="1000gmbl"
                onClick={(event) => {
                  this.changeChipSelect("1 ETH");
                }}
              />
            </div>
            <div className="bet_buttons">
              <button className="btn" onClick={this.handleClearBets}>
                Clear Bets
              </button>
              <button className="btn" onClick={this.handlePlaceBets}>
                Place Bet{" "}
              </button>
            </div>
            <div className="bets"></div>
          </div>
          <div className="additional_bets">
            <p> Other Bets </p>
            <select
              name="bets"
              value={this.state.extraBet}
              onChange={this.handleChange}
            >
              <option value="" disable="true" hidden>
                None
              </option>
              <optgroup label="Splits">
                {betOptionsSplits.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Squares">
                {betOptionsSquares.map((option) => (
                  <option key={option.counter} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </optgroup>
            </select>
            <button className="bets_btn" onClick={this.handleAddBet}>
              Add
            </button>
          </div>
        </div>
        <div className="gameinfo">
          <ul>
            <p>Bets to be placed:</p>
            {this.betBuffer.map((bet) => (
              <li>
                {bet.chip} on {bet.value}
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  }
}

export default Roulette;
