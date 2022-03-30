from brownie import GambleToken
from scripts.helpful_scripts import get_account
from web3 import Web3


def test_can_deploy():
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
