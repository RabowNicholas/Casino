//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./GambleToken.sol";

error TransferFailed();

contract Cage is Ownable{

  uint16 internal rewardRate;
  uint16 internal exchangeRate;

  IERC20 public wethToken;
  GambleToken internal gambleToken;

  Stake[] internal stakes;

  mapping(address => Stake[]) internal stakerToStakes;
  mapping(address => bool) internal stakers;

  event Staked(address indexed user, uint256 amount, uint256 timestamp);
  event Withdrawn(address indexed user, uint256 amount);
  event CashOut(address indexed user, uint256 amount);

  constructor(
    address _gambleTokenAddress,
    uint256 _rewardRate,
    uint256 _exchangeRate
  ) public {

    gambleToken = GambleToken(_gambleTokenAddress);
    _setRewardRate(_rewardRate);
    _setExchangeRate(_exchangeRate);
  }
  struct Stake{
    uint256 amount;
    uint256 timestamp;
  }


  function stake() public payable {
    // Sender has enough WETH to stake amount desired
    require(msg.sender.balance > msg.value, "You do not own enough ETH");


    //add msg.sender to stakers list
    stakers[msg.sender] = true;
    // If successful update values
    uint256 timestamp = block.timestamp;
    stakerToStakes[msg.sender].push(Stake(msg.value, timestamp));

    // then emit event
    emit Staked(msg.sender, msg.value, timestamp);
  }


  function withdraw(uint256 _amount) public onlyStakers{
    uint256 totalAmountStaked = getStakedAmount(msg.sender);
    require(_amount <= totalAmountStaked, "Attempting to withdraw more than staked.");
    //withdraw
    payable(msg.sender).transfer(_amount);
    if (totalAmountStaked == _amount) { //entire stake withdrawn
      stakers[msg.sender] = false;
    }
    //update values -> popping off stake events from mapping until amount is reached
    uint256 amountRemaining = _amount;
    while (amountRemaining != 0) {

      for (uint i = stakerToStakes[msg.sender].length; i > 0; i--){
        if (stakerToStakes[msg.sender][i-1].amount <= amountRemaining){ //amount in this stake does not cover or is entire amount that is being withdrawn
          amountRemaining = amountRemaining - stakerToStakes[msg.sender][i-1].amount;
          stakerToStakes[msg.sender].pop();
        } else { //amount covers entire amountRemaining. need to update last stake event
          stakerToStakes[msg.sender][i-1].amount = stakerToStakes[msg.sender][i-1].amount - amountRemaining;
          amountRemaining = 0;
        }
      }
    }
    //emit event
    emit Withdrawn(msg.sender, _amount);
  }

  function claimReward() public onlyStakers {
    uint256 amountToMint = _getRewardValue();
    gambleToken.mint(msg.sender, amountToMint);
  }

  function getStakedAmount(address _account) public view returns(uint256) {
    uint256 totalAmountStaked = 0;
    Stake[] memory currentStakes = stakerToStakes[_account];
    for (uint i = 0; i < currentStakes.length; i++){
      totalAmountStaked += currentStakes[i].amount;
    }
    return totalAmountStaked;
  }

  function isStaker(address _account) public view returns(bool) {
    return stakers[_account];
  }

  function getStakeObj(address _account, uint256 _index) public view returns(Stake memory) {
    return stakerToStakes[_account][_index];
  }
  function _getRewardValue() internal returns(uint256) {
    uint256 rewardValue = 0;
    Stake[] memory currentStakes = stakerToStakes[msg.sender];
    for (uint i = 0; i < currentStakes.length; i++){
      // mint = how much(eth) * how long(days) / rewardrate(1000)
      rewardValue += (currentStakes[i].amount * ((block.timestamp - currentStakes[i].timestamp) / 1 days)) / rewardRate;
    }
    return rewardValue;
  }

  function buyIn() public payable{
    // Sender has enough WETH to stake amount desired
    require(msg.sender.balance >= msg.value, "You do not own enough ETH");

    //mint appropraite # of gamble to user
    gambleToken.mint(msg.sender,(msg.value*1000));
  }

  function cashOut(uint256 _amount) public {
    require(gambleToken.balanceOf(msg.sender) >= _amount, "You might need to put it all on red to cash out that amount.");
    uint256 cashOutAmount = _amount/1000;
    //transfer eth to user
    payable(msg.sender).transfer(cashOutAmount);
    //burn gamble (amount)
    gambleToken.burn(msg.sender,_amount);
    emit CashOut(msg.sender, cashOutAmount);
  }

  function _setRewardRate(uint256 _rate) internal onlyOwner {
    rewardRate = uint16(_rate);
  }

  function _setExchangeRate(uint256 _rate) internal onlyOwner {
    exchangeRate = uint16(_rate);
  }




  modifier onlyStakers() {
    require(stakers[msg.sender], "You have not staked any ETH.");
    _;
  }



}
