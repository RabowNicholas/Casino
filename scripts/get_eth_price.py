from brownie import (
    network,
    config,
    GambleToken,
    Cashier,
    StakingPool
)
from scripts.helpful_scripts import get_account, get_contract, INITIAL_GAMBLE_SUPPLY
from web3 import Web3


def get_eth_price():

    # arrange
    account = get_account()
    gamble_token = GambleToken.deploy(INITIAL_GAMBLE_SUPPLY, {"from": account})
    cashier = Cashier.deploy(gamble_token.address, {"from": account})
    weth_token = get_contract("weth_token")
    print(get_contract('eth_usd_price_feed'))
    staking_pool = StakingPool.deploy(
        gamble_token.address,
        weth_token.address,
        get_contract('eth_usd_price_feed'),
        {"from": account}
    )
    # act
    price = staking_pool.getEthPrice()
    # price = Web3.fromWei(price, 'ether')
    # assert
    print(f"ETH/USD: {price}")


def main():
    get_eth_price()


if __name__ == '__main__':
    main()
