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
  - [GambleToken.sol](https://github.com/RabowNicholas/Casino/blob/main/contracts/GambleToken.sol)
  - [Roulette.sol](https://github.com/RabowNicholas/Casino/blob/main/contracts/Roulette.sol)
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
Building out a front end was new to me. I used React JS to create the application and ethers.js to connect to the blockchain and my smart contracts.
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



