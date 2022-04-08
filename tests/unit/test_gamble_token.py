from brownie import GambleToken, network
from scripts.helpful_scripts import get_account, LOCAL_BLOCKCHAIN_ENVIRONMENTS
from web3 import Web3
import pytest


def test_can_deploy():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()
    # arrange
    account = get_account()
    # act
    gamble_token = GambleToken.deploy({"from": account})
    # assert
    assert gamble_token.name() == 'Gamble'
    assert gamble_token.symbol() == 'GMBL'
    assert gamble_token.decimals() == 18

#
# def test_can_mint():
#     account = get_account()
#     gamble_token = GambleToken.deploy({"from": account})
#     # act
#     gamble_token.mint(accounts[1], Web3.toWei(1, 'ether') / 1000)
#     # assert
#     assert gamble_token.totalSupply() == 1e15
#     assert gamble_token.balanceOf(accounts[1]) == 1e15


def main():
    pass
