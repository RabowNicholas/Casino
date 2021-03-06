
# CryptoCasino

- [Description](#description)
- [Backend](#backend)
- [Frontend](#frontend)
- [Future of Project](#future-of-project)

### Description

The CryptoCasino is an online casino powered by smart contracts and deployed on the Ethereum network. Ethereum can be swapped to GMBL, an ERC-20 token built specifically for use as a digital casino chip. I built this project as a portfolio piece with the intention to display my capabilities as a developer.

[Demo](loom.com)

#### Breakdown

- Smart Contracts
  - [Cage.sol](https://github.com/RabowNicholas/Casino/blob/main/contracts/Cage.sol)
    - The Cage is a place to swap ETH for GMBL before playing and GMBL for ETH after playing. This function operates exactly like a physical casino. Additional features include a staking/reward system. Users can stake their ETH in this contract and receive 1000 GMBL per day per 1 ETH staked. This mechanism is to help the casino in the early days of its operation prior to big adoption. This liquidity is vital to allow players to withdraw ETH in the short term if they win.
  - [GambleToken.sol](https://github.com/RabowNicholas/Casino/blob/main/contracts/GambleToken.sol)
    - GMBL is my ERC-20 version of a casino chip. It's sole purpose is to allow for users to play the games. Any value it accrues outside of the casino is irrelevant to the casino itself. 1 GMBL will always be worth 1/1000 of an ETH.
  - [Roulette.sol](https://github.com/RabowNicholas/Casino/blob/main/contracts/Roulette.sol)
    - The roulette game is the first game implemented at the CryptoCasino. It runs like a normal roulette with a few limitations to the current setup. The first is the number of players. The game currently does not contain any mechanisms for multiple players to play at the same table, but rather at their own individual tables. A security issue needs to be resolved. The random number generated during the spinWheel function uses information from the blockchain and internal variables. This could potentially be a point of explotation. In order to fix this risk, an oracle such as Chainlink's VRF could be used to generate a verifiable random number.
- Tests
  - [Brownie](https://eth-brownie.readthedocs.io/en/stable/) Framework
  - Unit testing done in local ganache environment using [mocks](https://ethereum.org/en/developers/tutorials/how-to-mock-solidity-contracts-for-testing/)
  - Integration testing done using contracts deployed to the Rinkeby Testnet
- Front end
  - Node.js
  - React Framework

### Backend

#### Local Development

Test driven development was my main focus during this process of the development life cycle. I had a list of features that needed to be incorporated. In order to do so, I wrote tests that would demonstrate proper functionality. From there, I found the simpliest and most secure solution to the make the test pass and refactored as needed. This process allowed for more concise code, faster development and more secure contracts. I used Ganache and Brownie to run a local blockchain on my machine in order to execute these tests. The tests are written in python and use the pytest module. Upon satisfactory unit tests, I wrote a local integration test.

#### Testnet Deployment

The contracts were deployed to the Rinkeby Testnet. [Scripts](https://github.com/RabowNicholas/Casino/tree/main/scripts) were used to deploy the contracts and verify the source code on Etherscan (this proved vital to debugging and determining front end development later on). Once deployed, I was able to write a full integration [test](https://github.com/RabowNicholas/Casino/blob/main/tests/integration/test_playing_testnet.py) for the contracts.

<a href="https://drive.google.com/uc?export=view&id=1amtacTQk5GEfgszZqjr0ado2DZzcDLJq"><img src="https://drive.google.com/uc?export=view&id=1amtacTQk5GEfgszZqjr0ado2DZzcDLJq" style="width: 500px; max-width: 100%; height: auto" title="Click for the larger version." /></a>

### Frontend

Building out a front end was new to me. I used React JS to create the application and ethers.js to connect to the blockchain and my smart contracts. All of the images in the front end were created by myself using a few different softwares.

- Landing Page

<a href="https://drive.google.com/uc?export=view&id=1WlbKPHtBGGCA4Wl-uzZmlafvvTYnxY5H"><img src="https://drive.google.com/uc?export=view&id=1WlbKPHtBGGCA4Wl-uzZmlafvvTYnxY5H" style="width: 500px; max-width: 100%; height: auto" title="Click for the larger version." /></a>

- Stake

<a href="https://drive.google.com/uc?export=view&id=1Buj05BchkypF3sJFcrCIaM7L_FyMpQxE"><img src="https://drive.google.com/uc?export=view&id=1Buj05BchkypF3sJFcrCIaM7L_FyMpQxE" style="width: 500px; max-width: 100%; height: auto" title="Click for the larger version." /></a>

- Cage

<a href="https://drive.google.com/uc?export=view&id=1LxXGKXYY94SFC0jM4D_3sztj3tpUeXOr"><img src="https://drive.google.com/uc?export=view&id=1LxXGKXYY94SFC0jM4D_3sztj3tpUeXOr" style="width: 500px; max-width: 100%; height: auto" title="Click for the larger version." /></a>

- Play

<a href="https://drive.google.com/uc?export=view&id=1x01c-TTMV-68nCT6HrZY4hILCrx-ULFM"><img src="https://drive.google.com/uc?export=view&id=1x01c-TTMV-68nCT6HrZY4hILCrx-ULFM" style="width: 500px; max-width: 100%; height: auto" title="Click for the larger version." /></a>

- Roulette

<a href="https://drive.google.com/uc?export=view&id=124GDTAa5lUqv0C4xL3rsrif0Xb-lIN-U"><img src="https://drive.google.com/uc?export=view&id=124GDTAa5lUqv0C4xL3rsrif0Xb-lIN-U" style="width: 500px; max-width: 100%; height: auto" title="Click for the larger version." /></a>

### Future of Project

As far as the current contract goes, there is a security flaw that could potentially lead to explotation. Right now I am using a method to generate a random from blockchain information and a few internal variables. This could be improved by using an oracle service such as Chainlink's [VRF](https://docs.chain.link/docs/chainlink-vrf/) to generate a verifiable random number.
I also have plans to include more games as seen on the Play page (Slots and Blackjack).