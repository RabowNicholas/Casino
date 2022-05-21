//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./GambleToken.sol";

contract Roulette is Ownable{

  GambleToken internal gambleToken;
  address internal cage;
  address[] internal players;
  uint8 internal winningNumber;

  enum BET {
    Red,
    Black,
    Even,
    Odd,
    High,
    Low,
    Column1_34,
    Column2_35,
    Column3_36,
    FirstDozen,
    SecondDozen,
    ThirdDozen,
    Zero,
    DoubleZero,
    One,
    Two,
    Three,
    Four,
    Five,
    Six,
    Seven,
    Eight,
    Nine,
    Ten,
    Eleven,
    Twelve,
    Thirteen,
    Fourteen,
    Fifteen,
    Sixteen,
    Seventeen,
    Eighteen,
    Nineteen,
    Twenty,
    Twentyone,
    Twentytwo,
    Twentythree,
    Twentyfour,
    Twentyfive,
    Twentysix,
    Twentyseven,
    Twentyeight,
    Twentynine,
    Thirty,
    Thirtyone,
    Thirtytwo,
    Thirtythree,
    Thirtyfour,
    Thirtyfive,
    Thirtysix,
    Split_1_4,
    Split_1_2,
    Split_2_3,
    Split_2_5,
    Split_3_6,
    Split_4_5,
    Split_4_7,
    Split_5_6,
    Split_5_8,
    Split_6_9,
    Split_7_8,
    Split_7_10,
    Split_8_9,
    Split_8_11,
    Split_9_12,
    Split_10_11,
    Split_10_13,
    Split_11_12,
    Split_11_14,
    Split_12_15,
    Split_13_14,
    Split_13_16,
    Split_14_15,
    Split_14_17,
    Split_15_18,
    Split_16_17,
    Split_16_19,
    Split_17_18,
    Split_17_20,
    Split_18_21,
    Split_19_20,
    Split_19_22,
    Split_20_21,
    Split_20_23,
    Split_21_24,
    Split_22_23,
    Split_22_25,
    Split_23_24,
    Split_23_26,
    Split_24_27,
    Split_25_26,
    Split_25_28,
    Split_26_27,
    Split_26_29,
    Split_27_30,
    Split_28_29,
    Split_28_31,
    Split_29_30,
    Split_29_32,
    Split_30_33,
    Split_31_32,
    Split_31_34,
    Split_32_33,
    Split_32_35,
    Split_33_36,
    Split_34_35,
    Split_35_36,
    Square_1245,
    Square_2356,
    Square_4578,
    Square_5689,
    Square_781011,
    Square_891112,
    Square_10111314,
    Square_11121415,
    Square_13141617,
    Square_14151718,
    Square_16171920,
    Square_17182021,
    Square_19202223,
    Square_20212324,
    Square_22232526,
    Square_23242627,
    Square_25262829,
    Square_26272930,
    Square_28293132,
    Square_29303233,
    Square_31323435,
    Square_32333536
  }

  mapping (address => bool) atTable;
  mapping (address => Bet[]) playerToBets;
  mapping (address => uint256) playerToWinnings;
  mapping (address => uint256) playerToLifetimeWinnings;

  event PlayerSatDown(address player);
  event BetsPlaced(address player, uint256 totalBet);
  event RequestedRandomness(bytes32 requestId);
  event BallStopped(uint8 winningNumber);
  event WinningsPaidOut(address player, uint256 payout);
  event LeftTable(address player);


  constructor (
    address _gambleTokenAddress,
    address _cageAddress
  ) public {
    gambleToken = GambleToken(_gambleTokenAddress);
    cage = _cageAddress;
  }

  struct Bet {
    uint256 amount;
    BET betType;
  }


 //player functions
  function joinTable() public {
    require(gambleToken.balanceOf(msg.sender) > 0, "You need GMBL to sit down at the table.");
    atTable[msg.sender] = true;
    players.push(msg.sender);
    emit PlayerSatDown(msg.sender);
  }

  function placeBet(uint256[] memory _amounts, uint256[] memory _types) public qualified{
    require(_amounts.length == _types.length);
    for (uint i = 0; i < _amounts.length; i++) {
      playerToBets[msg.sender].push(Bet(_amounts[i],BET(_types[i])));
    }
    uint256 totalBet = _calculateTotalBet(_amounts);
    gambleToken.burn(msg.sender, totalBet);

    emit BetsPlaced(msg.sender, totalBet);
  }

  function leaveTable() public qualified{
    atTable[msg.sender] = false;
    emit LeftTable(msg.sender);
  }

  //owner functions
  function spinWheel() public onlyOwner {
    winningNumber = uint8(_random() % 38 + 1);
    emit BallStopped(winningNumber);
  }

  function settleAllBets() public onlyOwner {
    for(uint i = 0; i < players.length; i++){
      if (!atTable[players[i]]) {
      }  else {
        _settlePlayerBets(players[i]);
      }
    }
  }


  //viewer functions
  function isAtTable(address _player) public view returns(bool) {
    return atTable[_player];
  }
  function getBets(address _player) public view returns(Bet[] memory) {
    return playerToBets[_player];
  }
  function getWinnings(address _player) public view returns(uint256) {
    return playerToWinnings[_player];
  }
  function getLifetimeWinnings(address _player) public view returns(uint256) {
    return playerToLifetimeWinnings[_player];
  }
  function getWinningNumber() public view returns(uint8) {
    return winningNumber;
  }

  //internal functions
  function _random() internal returns(uint256) {
    return(uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players))));
  }
  function _calculateTotalBet(uint256[] memory _amounts) internal returns(uint256){
    uint256 totalBet = 0;
    for(uint i = 0; i < _amounts.length; i++) {
        totalBet += _amounts[i];
    }
    return totalBet;
  }
  function _settlePlayerBets(address _player) internal {
    Bet[] memory playerBets = playerToBets[_player];
    uint256 payout = 0;
    for (uint i = 0; i < playerBets.length; i++){
      uint256 multiplier = _winOrLoss(playerBets[i].betType);
      if (multiplier != 0){
        payout += ((playerBets[i].amount * multiplier) + playerBets[i].amount);
      }
    }

    require(payout > 0, "Payout was 0");
    gambleToken.mint(_player, payout);
    playerToWinnings[_player] = payout;
    playerToLifetimeWinnings[_player] += payout;
    emit WinningsPaidOut(_player, payout);

  }
  function _winOrLoss(BET _betType) internal view returns(uint256){
    BET betType = _betType;
    uint256 multiplier = 0;
    //check for win or loss
    //most likely going to use if statements
    //one for each number (1-36)
    //inside of each branch need to describe winning bets based on number
    //ie: 1 means red, firstdozen,low,odd,column1,split12,split14,square1245
    if (winningNumber == 1) {
      if (betType == BET.Red ||
          betType == BET.Odd ||
          betType == BET.Low){
        multiplier = 1;
      }
      else if (betType == BET.FirstDozen ||
               betType == BET.Column1_34) {
        multiplier = 2;
      }
      else if (betType == BET.Square_1245) {
        multiplier = 8;
      }
      else if (betType == BET.Split_1_2 ||
               betType == BET.Split_1_4) {
        multiplier = 17;
      }
      else if (betType == BET.One) {
        multiplier = 35;
      }
    }
    else if (winningNumber == 2) {
      if (betType == BET.Black ||
          betType == BET.Even ||
          betType == BET.Low){
        multiplier = 1;
      }
      else if (betType == BET.FirstDozen ||
               betType == BET.Column2_35) {
        multiplier = 2;
      }
      else if (betType == BET.Square_1245 ||
               betType == BET.Square_2356) {
        multiplier = 8;
      }
      else if (betType == BET.Split_1_2 ||
               betType == BET.Split_2_3 ||
               betType == BET.Split_2_5) {
        multiplier = 17;
      }
      else if (betType == BET.Two) {
        multiplier = 35;
      }

    }
    else if (winningNumber == 3) {
      if (betType == BET.Red ||
          betType == BET.Odd ||
          betType == BET.Low){
        multiplier = 1;
      }
      else if (betType == BET.FirstDozen ||
               betType == BET.Column3_36) {
        multiplier = 2;
      }
      else if (betType == BET.Square_2356) {
        multiplier = 8;
      }
      else if (betType == BET.Split_2_3 ||
               betType == BET.Split_3_6) {
        multiplier = 17;
      }
      else if (betType == BET.Three) {
        multiplier = 35;
      }

    }
    else if (winningNumber == 4) {
      if (betType == BET.Black ||
          betType == BET.Even ||
          betType == BET.Low){
        multiplier = 1;
      }
      else if (betType == BET.FirstDozen ||
               betType == BET.Column1_34) {
        multiplier = 2;
      }
      else if (betType == BET.Square_1245 ||
               betType == BET.Square_4578) {
        multiplier = 8;
      }
      else if (betType == BET.Split_1_4 ||
               betType == BET.Split_4_5 ||
               betType == BET.Split_4_7) {
        multiplier = 17;
      }
      else if (betType == BET.Four) {
        multiplier = 35;
      }
    }
    else if (winningNumber == 5) {
      if (betType == BET.Red ||
          betType == BET.Odd ||
          betType == BET.Low){
        multiplier = 1;
      }
      else if (betType == BET.FirstDozen ||
               betType == BET.Column2_35) {
        multiplier = 2;
      }
      else if (betType == BET.Square_2356 ||
               betType == BET.Square_1245 ||
               betType == BET.Square_4578 ||
               betType == BET.Square_5689) {
        multiplier = 8;
      }
      else if (betType == BET.Split_2_5 ||
               betType == BET.Split_4_5 ||
               betType == BET.Split_5_6 ||
               betType == BET.Split_5_8) {
        multiplier = 17;
      }
      else if (betType == BET.Five) {
        multiplier = 35;
      }

    }
    else if (winningNumber == 6) {
      if (betType == BET.Black ||
          betType == BET.Even ||
          betType == BET.Low){
        multiplier = 1;
      }
      else if (betType == BET.FirstDozen ||
               betType == BET.Column3_36) {
        multiplier = 2;
      }
      else if (betType == BET.Square_2356 ||
               betType == BET.Square_5689) {
        multiplier = 8;
      }
      else if (betType == BET.Split_3_6 ||
               betType == BET.Split_5_6 ||
               betType == BET.Split_6_9) {
        multiplier = 17;
      }
      else if (betType == BET.Six) {
        multiplier = 35;
      }

    }
    else if (winningNumber == 7) {
      if (betType == BET.Red ||
          betType == BET.Odd ||
          betType == BET.Low){
        multiplier = 1;
      }
      else if (betType == BET.FirstDozen ||
               betType == BET.Column1_34) {
        multiplier = 2;
      }
      else if (betType == BET.Square_4578 ||
               betType == BET.Square_781011) {
        multiplier = 8;
      }
      else if (betType == BET.Split_4_7 ||
               betType == BET.Split_7_8 ||
               betType == BET.Split_7_10) {
        multiplier = 17;
      }
      else if (betType == BET.Seven) {
        multiplier = 35;
      }
    }
    else if (winningNumber == 8) {
      if (betType == BET.Black ||
          betType == BET.Even ||
          betType == BET.Low){
        multiplier = 1;
      }
      else if (betType == BET.FirstDozen ||
               betType == BET.Column2_35) {
        multiplier = 2;
      }
      else if (betType == BET.Square_4578 ||
               betType == BET.Square_5689 ||
               betType == BET.Square_781011 ||
               betType == BET.Square_891112) {
        multiplier = 8;
      }
      else if (betType == BET.Split_5_8 ||
               betType == BET.Split_7_8 ||
               betType == BET.Split_8_9 ||
               betType == BET.Split_8_11) {
        multiplier = 17;
      }
      else if (betType == BET.Eight) {
        multiplier = 35;
      }
    }
    else if (winningNumber == 9) {
      if (betType == BET.Red ||
          betType == BET.Odd ||
          betType == BET.Low){
        multiplier = 1;
      }
      else if (betType == BET.FirstDozen ||
               betType == BET.Column3_36) {
        multiplier = 2;
      }
      else if (betType == BET.Square_5689 ||
               betType == BET.Square_891112) {
        multiplier = 8;
      }
      else if (betType == BET.Split_6_9 ||
               betType == BET.Split_8_9 ||
               betType == BET.Split_9_12) {
        multiplier = 17;
      }
      else if (betType == BET.Nine) {
        multiplier = 35;
      }
    }
    else if (winningNumber == 10) {
      if (betType == BET.Black ||
          betType == BET.Even ||
          betType == BET.Low){
        multiplier = 1;
      }
      else if (betType == BET.FirstDozen ||
               betType == BET.Column1_34) {
        multiplier = 2;
      }
      else if (betType == BET.Square_781011 ||
               betType == BET.Square_10111314) {
        multiplier = 8;
      }
      else if (betType == BET.Split_7_10 ||
               betType == BET.Split_10_11 ||
               betType == BET.Split_10_13) {
        multiplier = 17;
      }
      else if (betType == BET.Ten) {
        multiplier = 35;
      }
    }
    else if (winningNumber == 11) {
      if (betType == BET.Black ||
          betType == BET.Odd ||
          betType == BET.Low){
        multiplier = 1;
      }
      else if (betType == BET.FirstDozen ||
               betType == BET.Column2_35) {
        multiplier = 2;
      }
      else if (betType == BET.Square_781011 ||
               betType == BET.Square_891112 ||
               betType == BET.Square_10111314 ||
               betType == BET.Square_11121415) {
        multiplier = 8;
      }
      else if (betType == BET.Split_8_11 ||
               betType == BET.Split_10_11 ||
               betType == BET.Split_11_12 ||
               betType == BET.Split_11_14) {
        multiplier = 17;
      }
      else if (betType == BET.Eleven) {
        multiplier = 35;
      }
    }
    else if (winningNumber == 12) {
      if (betType == BET.Red ||
          betType == BET.Even ||
          betType == BET.Low){
        multiplier = 1;
      }
      else if (betType == BET.FirstDozen ||
               betType == BET.Column3_36) {
        multiplier = 2;
      }
      else if (betType == BET.Square_891112 ||
               betType == BET.Square_11121415) {
        multiplier = 8;
      }
      else if (betType == BET.Split_9_12 ||
               betType == BET.Split_11_12 ||
               betType == BET.Split_12_15) {
        multiplier = 17;
      }
      else if (betType == BET.Twelve) {
        multiplier = 35;
      }
    }
    else if (winningNumber == 13) {
      if (betType == BET.Black ||
          betType == BET.Odd ||
          betType == BET.Low){
        multiplier = 1;
      }
      else if (betType == BET.SecondDozen ||
               betType == BET.Column1_34) {
        multiplier = 2;
      }
      else if (betType == BET.Square_10111314 ||
               betType == BET.Square_13141617) {
        multiplier = 8;
      }
      else if (betType == BET.Split_10_13 ||
               betType == BET.Split_13_14 ||
               betType == BET.Split_13_16) {
        multiplier = 17;
      }
      else if (betType == BET.Thirteen) {
        multiplier = 35;
      }
    }
    else if (winningNumber == 14) {
      if (betType == BET.Red ||
          betType == BET.Even ||
          betType == BET.Low){
        multiplier = 1;
      }
      else if (betType == BET.SecondDozen ||
               betType == BET.Column2_35) {
        multiplier = 2;
      }
      else if (betType == BET.Square_10111314 ||
               betType == BET.Square_11121415 ||
               betType == BET.Square_13141617 ||
               betType == BET.Square_14151718) {
        multiplier = 8;
      }
      else if (betType == BET.Split_11_14 ||
               betType == BET.Split_13_14 ||
               betType == BET.Split_14_15 ||
               betType == BET.Split_14_17) {
        multiplier = 17;
      }
      else if (betType == BET.Fourteen) {
        multiplier = 35;
      }
    }
    else if (winningNumber == 15) {
      if (betType == BET.Black ||
          betType == BET.Odd ||
          betType == BET.Low){
        multiplier = 1;
      }
      else if (betType == BET.SecondDozen ||
               betType == BET.Column3_36) {
        multiplier = 2;
      }
      else if (betType == BET.Square_11121415 ||
               betType == BET.Square_14151718) {
        multiplier = 8;
      }
      else if (betType == BET.Split_12_15 ||
               betType == BET.Split_14_15 ||
               betType == BET.Split_15_18) {
        multiplier = 17;
      }
      else if (betType == BET.Fifteen) {
        multiplier = 35;
      }
    }
    else if (winningNumber == 16) {
      if (betType == BET.Red ||
          betType == BET.Even ||
          betType == BET.Low){
        multiplier = 1;
      }
      else if (betType == BET.SecondDozen ||
               betType == BET.Column1_34) {
        multiplier = 2;
      }
      else if (betType == BET.Square_13141617 ||
               betType == BET.Square_16171920) {
        multiplier = 8;
      }
      else if (betType == BET.Split_13_16 ||
               betType == BET.Split_16_17 ||
               betType == BET.Split_16_19) {
        multiplier = 17;
      }
      else if (betType == BET.Sixteen) {
        multiplier = 35;
      }
    }
    else if (winningNumber == 17) {
      if (betType == BET.Black ||
          betType == BET.Odd ||
          betType == BET.Low){
        multiplier = 1;
      }
      else if (betType == BET.SecondDozen ||
               betType == BET.Column2_35) {
        multiplier = 2;
      }
      else if (betType == BET.Square_13141617 ||
               betType == BET.Square_14151718 ||
               betType == BET.Square_16171920 ||
               betType == BET.Square_17182021) {
        multiplier = 8;
      }
      else if (betType == BET.Split_14_17||
               betType == BET.Split_16_17 ||
               betType == BET.Split_17_18 ||
               betType == BET.Split_17_20) {
        multiplier = 17;
      }
      else if (betType == BET.Seventeen) {
        multiplier = 35;
      }
    }
    else if (winningNumber == 18) {
      if (betType == BET.Red ||
          betType == BET.Even ||
          betType == BET.Low){
        multiplier = 1;
      }
      else if (betType == BET.SecondDozen ||
               betType == BET.Column3_36) {
        multiplier = 2;
      }
      else if (betType == BET.Square_14151718 ||
               betType == BET.Square_17182021) {
        multiplier = 8;
      }
      else if (betType == BET.Split_15_18 ||
               betType == BET.Split_17_18 ||
               betType == BET.Split_18_21) {
        multiplier = 17;
      }
      else if (betType == BET.Eighteen) {
        multiplier = 35;
      }
    }
    else if (winningNumber == 19) {
      if (betType == BET.Red ||
          betType == BET.Odd ||
          betType == BET.High){
        multiplier = 1;
      }
      else if (betType == BET.SecondDozen ||
               betType == BET.Column1_34) {
        multiplier = 2;
      }
      else if (betType == BET.Square_16171920 ||
               betType == BET.Square_19202223) {
        multiplier = 8;
      }
      else if (betType == BET.Split_13_16 ||
               betType == BET.Split_16_17 ||
               betType == BET.Split_16_19) {
        multiplier = 17;
      }
      else if (betType == BET.Nineteen) {
        multiplier = 35;
      }
    }
    else if (winningNumber == 20) {
      if (betType == BET.Black ||
          betType == BET.Even ||
          betType == BET.High){
        multiplier = 1;
      }
      else if (betType == BET.SecondDozen ||
               betType == BET.Column2_35) {
        multiplier = 2;
      }
      else if (betType == BET.Square_16171920 ||
               betType == BET.Square_17182021 ||
               betType == BET.Square_19202223 ||
               betType == BET.Square_20212324) {
        multiplier = 8;
      }
      else if (betType == BET.Split_17_20 ||
               betType == BET.Split_19_20 ||
               betType == BET.Split_20_21 ||
               betType == BET.Split_20_23) {
        multiplier = 17;
      }
      else if (betType == BET.Twenty) {
        multiplier = 35;
      }
    }
    else if (winningNumber == 21) {
      if (betType == BET.Red ||
          betType == BET.Odd ||
          betType == BET.High){
        multiplier = 1;
      }
      else if (betType == BET.SecondDozen ||
               betType == BET.Column3_36) {
        multiplier = 2;
      }
      else if (betType == BET.Square_17182021 ||
               betType == BET.Square_20212324) {
        multiplier = 8;
      }
      else if (betType == BET.Split_18_21 ||
               betType == BET.Split_20_21 ||
               betType == BET.Split_21_24) {
        multiplier = 17;
      }
      else if (betType == BET.Twentyone) {
        multiplier = 35;
      }
    }
    else if (winningNumber == 22) {
      if (betType == BET.Black ||
          betType == BET.Even ||
          betType == BET.High){
        multiplier = 1;
      }
      else if (betType == BET.SecondDozen ||
               betType == BET.Column1_34) {
        multiplier = 2;
      }
      else if (betType == BET.Square_19202223 ||
               betType == BET.Square_22232526) {
        multiplier = 8;
      }
      else if (betType == BET.Split_19_22 ||
               betType == BET.Split_22_23 ||
               betType == BET.Split_22_25) {
        multiplier = 17;
      }
      else if (betType == BET.Twentytwo) {
        multiplier = 35;
      }
    }
    else if (winningNumber == 23) {
      if (betType == BET.Red ||
          betType == BET.Odd ||
          betType == BET.High){
        multiplier = 1;
      }
      else if (betType == BET.SecondDozen ||
               betType == BET.Column2_35) {
        multiplier = 2;
      }
      else if (betType == BET.Square_19202223 ||
               betType == BET.Square_20212324 ||
               betType == BET.Square_22232526 ||
               betType == BET.Square_23242627) {
        multiplier = 8;
      }
      else if (betType == BET.Split_20_23 ||
               betType == BET.Split_22_23 ||
               betType == BET.Split_23_24 ||
               betType == BET.Split_23_26) {
        multiplier = 17;
      }
      else if (betType == BET.Twentythree) {
        multiplier = 35;
      }
    }
    else if (winningNumber == 24) {
      if (betType == BET.Black ||
          betType == BET.Even ||
          betType == BET.High){
        multiplier = 1;
      }
      else if (betType == BET.SecondDozen ||
               betType == BET.Column3_36) {
        multiplier = 2;
      }
      else if (betType == BET.Square_20212324 ||
               betType == BET.Square_23242627) {
        multiplier = 8;
      }
      else if (betType == BET.Split_21_24 ||
               betType == BET.Split_23_24 ||
               betType == BET.Split_24_27) {
        multiplier = 17;
      }
      else if (betType == BET.Twentyfour) {
        multiplier = 35;
      }
    }
    else if (winningNumber == 25) {
      if (betType == BET.Red ||
          betType == BET.Odd ||
          betType == BET.High){
        multiplier = 1;
      }
      else if (betType == BET.ThirdDozen ||
               betType == BET.Column1_34) {
        multiplier = 2;
      }
      else if (betType == BET.Square_22232526 ||
               betType == BET.Square_25262829) {
        multiplier = 8;
      }
      else if (betType == BET.Split_22_25 ||
               betType == BET.Split_25_26 ||
               betType == BET.Split_25_28) {
        multiplier = 17;
      }
      else if (betType == BET.Twentyfive) {
        multiplier = 35;
      }
    }
    else if (winningNumber == 26) {
      if (betType == BET.Black ||
          betType == BET.Even ||
          betType == BET.High){
        multiplier = 1;
      }
      else if (betType == BET.ThirdDozen ||
               betType == BET.Column2_35) {
        multiplier = 2;
      }
      else if (betType == BET.Square_22232526 ||
               betType == BET.Square_23242627 ||
               betType == BET.Square_25262829 ||
               betType == BET.Square_26272930) {
        multiplier = 8;
      }
      else if (betType == BET.Split_23_26 ||
               betType == BET.Split_25_26 ||
               betType == BET.Split_26_27 ||
               betType == BET.Split_26_29) {
        multiplier = 17;
      }
      else if (betType == BET.Twentysix) {
        multiplier = 35;
      }
    }
    else if (winningNumber == 27) {
      if (betType == BET.Red ||
          betType == BET.Odd ||
          betType == BET.High){
        multiplier = 1;
      }
      else if (betType == BET.ThirdDozen ||
               betType == BET.Column3_36) {
        multiplier = 2;
      }
      else if (betType == BET.Square_23242627 ||
               betType == BET.Square_26272930) {
        multiplier = 8;
      }
      else if (betType == BET.Split_24_27||
               betType == BET.Split_26_27 ||
               betType == BET.Split_27_30) {
        multiplier = 17;
      }
      else if (betType == BET.Twentyseven) {
        multiplier = 35;
      }
    }
    else if (winningNumber == 28) {
      if (betType == BET.Black ||
          betType == BET.Even ||
          betType == BET.High){
        multiplier = 1;
      }
      else if (betType == BET.ThirdDozen ||
               betType == BET.Column1_34) {
        multiplier = 2;
      }
      else if (betType == BET.Square_25262829 ||
               betType == BET.Square_28293132) {
        multiplier = 8;
      }
      else if (betType == BET.Split_25_28 ||
               betType == BET.Split_28_29 ||
               betType == BET.Split_28_31) {
        multiplier = 17;
      }
      else if (betType == BET.Twentyeight) {
        multiplier = 35;
      }
    }
    else if (winningNumber == 29) {
      if (betType == BET.Black ||
          betType == BET.Odd ||
          betType == BET.High){
        multiplier = 1;
      }
      else if (betType == BET.ThirdDozen ||
               betType == BET.Column2_35) {
        multiplier = 2;
      }
      else if (betType == BET.Square_25262829 ||
               betType == BET.Square_26272930 ||
               betType == BET.Square_28293132 ||
               betType == BET.Square_29303233) {
        multiplier = 8;
      }
      else if (betType == BET.Split_26_29 ||
               betType == BET.Split_28_29 ||
               betType == BET.Split_29_30 ||
               betType == BET.Split_29_32) {
        multiplier = 17;
      }
      else if (betType == BET.Twentynine) {
        multiplier = 35;
      }
    }
    else if (winningNumber == 30) {
      if (betType == BET.Red ||
          betType == BET.Even ||
          betType == BET.High){
        multiplier = 1;
      }
      else if (betType == BET.ThirdDozen ||
               betType == BET.Column3_36) {
        multiplier = 2;
      }
      else if (betType == BET.Square_26272930 ||
               betType == BET.Square_29303233) {
        multiplier = 8;
      }
      else if (betType == BET.Split_27_30 ||
               betType == BET.Split_29_30 ||
               betType == BET.Split_30_33) {
        multiplier = 17;
      }
      else if (betType == BET.Thirty) {
        multiplier = 35;
      }
    }
    else if (winningNumber == 31) {
      if (betType == BET.Black ||
          betType == BET.Odd ||
          betType == BET.High){
        multiplier = 1;
      }
      else if (betType == BET.ThirdDozen ||
               betType == BET.Column1_34) {
        multiplier = 2;
      }
      else if (betType == BET.Square_28293132 ||
               betType == BET.Square_31323435) {
        multiplier = 8;
      }
      else if (betType == BET.Split_28_31 ||
               betType == BET.Split_31_32 ||
               betType == BET.Split_31_34) {
        multiplier = 17;
      }
      else if (betType == BET.Thirtyone) {
        multiplier = 35;
      }
    }
    else if (winningNumber == 32) {
      if (betType == BET.Red ||
          betType == BET.Even ||
          betType == BET.High){
        multiplier = 1;
      }
      else if (betType == BET.ThirdDozen ||
               betType == BET.Column2_35) {
        multiplier = 2;
      }
      else if (betType == BET.Square_28293132 ||
               betType == BET.Square_29303233 ||
               betType == BET.Square_31323435 ||
               betType == BET.Square_32333536) {
        multiplier = 8;
      }
      else if (betType == BET.Split_29_32 ||
               betType == BET.Split_31_32 ||
               betType == BET.Split_32_33 ||
               betType == BET.Split_32_35) {
        multiplier = 17;
      }
      else if (betType == BET.Thirtytwo) {
        multiplier = 35;
      }
    }
    else if (winningNumber == 33) {
      if (betType == BET.Black ||
          betType == BET.Odd ||
          betType == BET.High){
        multiplier = 1;
      }
      else if (betType == BET.ThirdDozen ||
               betType == BET.Column3_36) {
        multiplier = 2;
      }
      else if (betType == BET.Square_29303233 ||
               betType == BET.Square_32333536) {
        multiplier = 8;
      }
      else if (betType == BET.Split_30_33 ||
               betType == BET.Split_32_33 ||
               betType == BET.Split_33_36) {
        multiplier = 17;
      }
      else if (betType == BET.Thirtythree) {
        multiplier = 35;
      }
    }
    else if (winningNumber == 34) {
      if (betType == BET.Red ||
          betType == BET.Even ||
          betType == BET.High){
        multiplier = 1;
      }
      else if (betType == BET.ThirdDozen ||
               betType == BET.Column1_34) {
        multiplier = 2;
      }
      else if (betType == BET.Square_31323435) {
        multiplier = 8;
      }
      else if (betType == BET.Split_31_34 ||
               betType == BET.Split_34_35) {
        multiplier = 17;
      }
      else if (betType == BET.Thirtyfour) {
        multiplier = 35;
      }
    }
    else if (winningNumber == 35) {
      if (betType == BET.Black ||
          betType == BET.Odd ||
          betType == BET.High){
        multiplier = 1;
      }
      else if (betType == BET.ThirdDozen ||
               betType == BET.Column2_35) {
        multiplier = 2;
      }
      else if (betType == BET.Square_31323435 ||
               betType == BET.Square_32333536) {
        multiplier = 8;
      }
      else if (betType == BET.Split_32_35 ||
               betType == BET.Split_34_35 ||
               betType == BET.Split_35_36) {
        multiplier = 17;
      }
      else if (betType == BET.Thirtyfive) {
        multiplier = 35;
      }
    }
    else if (winningNumber == 36) {
      if (betType == BET.Red ||
          betType == BET.Even ||
          betType == BET.High){
        multiplier = 1;
      }
      else if (betType == BET.ThirdDozen ||
               betType == BET.Column3_36) {
        multiplier = 2;
      }
      else if (betType == BET.Square_32333536) {
        multiplier = 8;
      }
      else if (betType == BET.Split_33_36 ||
               betType == BET.Split_35_36) {
        multiplier = 17;
      }
      else if (betType == BET.Thirtysix) {
        multiplier = 35;
      }
    }
    else if (winningNumber == 37) {
      if (betType == BET.Zero) {
        multiplier = 35;
      }

    }
    else if (winningNumber == 0) {
      if (betType == BET.DoubleZero) {
        multiplier = 35;
      }
    }
    return multiplier;
    }

    modifier qualified() {
      require(atTable[msg.sender], "Must be sitting at table to place bet.");
      _;
    }
  }
