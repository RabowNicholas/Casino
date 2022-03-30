//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// contract Blackjack is Ownable {
//
//   IERC20 internal gambleToken;
//
//   address[] internal players;
//   address[] internal tableQueue;
//
//   mapping(address => Hand) internal playerToHand;
//
//   enum BLACKJACK_STATE {
//     CLOSED,
//     OPEN,
//     BET,
//     DEAL,
//     PLAY,
//     SETTLE
//   }
//   BLACKJACK_STATE internal blackjackState;
//
//   enum RANK {
//     TWO,
//     THREE,
//     FOUR,
//     FIVE,
//     SIX,
//     SEVEN,
//     EIGHT,
//     NINE,
//     TEN,
//     JACK,
//     QUEEN,
//     KING,
//     ACE
//   }
//   enum SUIT {
//     CLUB,
//     SPADE,
//     DIAMOND,
//     HEART
//   }
//
//   event PlacedBet(address indexed player, uint256 bet);
//
//   constructor (address _gambleTokenAddress) public {
//     gambleToken = IERC20(_gambleTokenAddress);
//     blackjackState = BLACKJACK_STATE.CLOSED;
//   }
//
//   struct Card {
//     RANK rank;
//     SUIT suit;
//     bool dealt;
//   }
//
//   struct Hand {
//     Card[] hand;
//     uint256 length;
//   }
//
//   function joinTable() public {
//     if (blackjackState == BLACKJACK_STATE.CLOSED && players.length < 6) {
//       _addPlayer(msg.sender);
//     } else {
//       _joinQueue(msg.sender);
//     }
//   }
//
//   function placeBet(uint256 _amount) public correctState(BLACKJACK_STATE.BET){
//     require(gambleToken.balanceOf(msg.sender) >= _amount, "Insufficient funds.");
//
//     gambleToken.transferFrom(msg.sender, address(this), _amount);
//
//     emit PlacedBet(msg.sender, _amount);
//   }
//
//   function startGame() public onlyOwner correctState(BLACKJACK_STATE.CLOSED) {
//     _addPlayersFromQueue();
//     _changeGameState(BLACKJACK_STATE.BET);
//   }
//
//   function deal() public onlyOwner correctState(BLACKJACK_STATE.DEAL){
//     for (uint i = 0; i < players.length; i++) {
//       playerToHand[players[i]].hand.push(_getRandomCard());
//       // Card memory card = _getRandomCard();
//
//     }
//     //deal one card to each player
//     //deal one card to dealer
//     //deal one more card to each player
//     //deal one card face up to dealer
//   }
//
//
//   function getCurrentState() public view returns(BLACKJACK_STATE) {
//     return blackjackState;
//   }
//
//   function getHandLength(address _player) public view returns(uint256) {
//     return playerToHand[_player].length;
//   }
//
//   function getPlayers() public view returns(address[] memory) {
//     return players;
//   }
//
//   function getTableQueue() public view returns(address[] memory) {
//     return tableQueue;
//   }
//
//
//   function _changeGameState(BLACKJACK_STATE _newState) internal {
//     blackjackState = _newState;
//   }
//
//   function _getRandomCard() internal returns(Card memory) {
//     Card memory randomCard = Card({
//       rank: RANK.TEN,
//       suit: SUIT.HEART,
//       dealt: true
//     });
//     return randomCard;
//   }
//
//   function _addPlayer(address _player) internal {
//     players.push(_player);
//   }
//
//   function _joinQueue(address _player) internal {
//     tableQueue.push(_player);
//   }
//
//   modifier correctState(BLACKJACK_STATE _currentState) {
//     require(blackjackState == _currentState, "Cannont place bets at the moment.");
//     _;
//   }
//
// }
