from brownie import network, exceptions, accounts, chain
from scripts.helpful_scripts import (
    deploy,
    SECONDS_IN_DAY
)
import pytest
from web3 import Web3


def test_can_deploy():
    """
    Description

    Parameters
    ----------
    name: type
        description
    Returns
    -------
    x : type
    Raises
    ------
    Error type
    """

    gamble_token, weth_token, cage, _ = deploy()

    assert cage.wethToken() == weth_token.address


def test_get_staked_amount():
    # arrange
    gamble_token, weth_token, cage, account = deploy()
    staking_amount = Web3.toWei(2, 'ether')
    weth_token.approve(cage.address, staking_amount, {"from": account})
    tx = cage.stake(staking_amount, {"from": account})
    # act
    actual = cage.getStakedAmount(account.address)
    # assert
    assert actual == staking_amount


def test_stake():
    # arrange
    gamble_token, weth_token, cage, account = deploy()
    staking_amount = Web3.toWei(2, 'ether')
    # act
    init_account_balance = weth_token.balanceOf(account.address)
    weth_token.approve(cage.address, staking_amount, {"from": account})
    tx = cage.stake(staking_amount, {"from": account})
    event = tx.events["Staked"]
    # assert
    assert weth_token.balanceOf(
        account.address) == init_account_balance - staking_amount
    assert weth_token.balanceOf(cage.address) == staking_amount
    assert event['user'] == account.address
    assert event['amount'] == staking_amount
    assert event['timestamp'] != 0
    user_stakes = cage.getStakeObj(account.address, 0)
    assert user_stakes['amount'] == staking_amount
    assert user_stakes['timestamp'] != 0
    assert cage.isStaker(account.address) == True


def test_stake_no_weth():
    # arrange
    gamble_token, weth_token, cage, account = deploy()
    staking_amount = Web3.toWei(2, 'ether')
    # act/assert
    with pytest.raises(exceptions.VirtualMachineError):
        tx = cage.stake(staking_amount, {"from": accounts[1]})


def test_withdraw_stake_same_amount():
    # arrange
    gamble_token, weth_token, cage, account = deploy()
    staking_amount = Web3.toWei(2, 'ether')
    weth_token.approve(cage.address, staking_amount, {"from": account})
    tx = cage.stake(staking_amount, {"from": account})
    tx.wait(1)
    # act
    withdraw_amount = staking_amount
    init_account_balance = weth_token.balanceOf(account.address)
    tx = cage.withdraw(withdraw_amount, {"from": account})
    tx.wait(1)
    event = tx.events["Withdrawn"]
    # assert
    assert weth_token.balanceOf(
        account.address) == init_account_balance + withdraw_amount
    actual = cage.getStakedAmount(account.address)
    assert actual == 0
    assert event["user"] == account.address
    assert event["amount"] == withdraw_amount
    assert cage.isStaker(account.address) == False


def test_withdraw_all_stake_twice():
    # arrange
    gamble_token, weth_token, cage, account = deploy()
    staking_amount = Web3.toWei(1, 'ether')
    weth_token.approve(cage.address, staking_amount * 2, {"from": account})
    tx = cage.stake(staking_amount, {"from": account})
    tx.wait(1)
    tx = cage.stake(staking_amount, {"from": account})
    tx.wait(1)
    # act
    withdraw_amount = staking_amount * 2
    init_account_balance = weth_token.balanceOf(account.address)
    tx = cage.withdraw(withdraw_amount, {"from": account})
    tx.wait(1)
    event = tx.events["Withdrawn"]
    # assert
    assert weth_token.balanceOf(
        account.address) == init_account_balance + withdraw_amount
    actual = cage.getStakedAmount(account.address)
    assert actual == 0
    assert event["user"] == account.address
    assert event["amount"] == withdraw_amount


def test_withdraw_some_stake_twice():
    # arrange
    gamble_token, weth_token, cage, account = deploy()
    staking_amount = Web3.toWei(1, 'ether')
    weth_token.approve(cage.address, staking_amount * 3, {"from": account})
    tx = cage.stake(staking_amount * 2, {"from": account})
    tx.wait(1)
    tx = cage.stake(staking_amount, {"from": account})
    tx.wait(1)
    # act
    withdraw_amount = staking_amount * 2
    init_account_balance = weth_token.balanceOf(account.address)
    tx = cage.withdraw(withdraw_amount, {"from": account})
    tx.wait(1)
    event = tx.events["Withdrawn"]
    # assert
    assert weth_token.balanceOf(
        account.address) == init_account_balance + withdraw_amount
    actual = cage.getStakedAmount(account.address)
    assert actual == staking_amount
    assert event["user"] == account.address
    assert event["amount"] == withdraw_amount


def test_withdraw_more_than_allowed():
    # arrange
    gamble_token, weth_token, cage, account = deploy()
    staking_amount = Web3.toWei(2, 'ether')
    weth_token.approve(cage.address, staking_amount, {"from": account})
    tx = cage.stake(staking_amount, {"from": account})
    tx.wait(1)
    # act
    withdraw_amount = staking_amount * 2
    # assert
    with pytest.raises(exceptions.VirtualMachineError):
        cage.withdraw(withdraw_amount, {"from": account})


def test_withdraw_not_staker():
    # arrange
    gamble_token, weth_token, cage, account = deploy()
    withdraw_amount = Web3.toWei(2, 'ether')
    # act
    # assert
    with pytest.raises(exceptions.VirtualMachineError):
        cage.withdraw(withdraw_amount, {"from": accounts[1]})


def test_claim_reward_simple():
   # arrange
    gamble_token, weth_token, cage, account = deploy()
    staking_amount = Web3.toWei(1, 'ether')
    weth_token.approve(cage.address, staking_amount, {"from": account})
    tx = cage.stake(staking_amount, {"from": account})
    tx.wait(1)
    chain.sleep(SECONDS_IN_DAY)
    # act
    init_gamble_balance = gamble_token.balanceOf(account.address)
    reward = 1e15
    tx = cage.claimReward({"from": account})
    tx.wait(1)
    # assert
    assert gamble_token.balanceOf(
        account.address) == init_gamble_balance + reward


def test_claim_reward_mult_stakes():
   # arrange
    gamble_token, weth_token, cage, account = deploy()
    staking_amount = Web3.toWei(1, 'ether')
    weth_token.approve(cage.address, staking_amount * 3, {"from": account})
    tx = cage.stake(staking_amount, {"from": account})
    tx.wait(1)
    chain.sleep(SECONDS_IN_DAY)
    tx = cage.stake(staking_amount * 2, {"from": account})
    tx.wait(1)
    chain.sleep(SECONDS_IN_DAY)
    # act
    init_gamble_balance = gamble_token.balanceOf(account.address)
    reward = 1e15 * 4
    tx = cage.claimReward({"from": account})
    tx.wait(1)
    # assert
    assert gamble_token.balanceOf(
        account.address) == init_gamble_balance + reward


def test_claim_reward_not_staker():
    # arrange
    gamble_token, weth_token, cage, account = deploy()
    # act/assert
    with pytest.raises(exceptions.VirtualMachineError):
        tx = cage.claimReward({"from": account})


def test_buy_in():
    # arrange
    gamble_token, weth_token, cage, account = deploy()
    buy_in = Web3.toWei(1, 'ether')
    # act
    init_gamble_balance = gamble_token.balanceOf(account.address)
    expected = 1e15
    init_weth_balance = weth_token.balanceOf(account.address)
    weth_token.approve(cage.address, buy_in, {"from": account})
    tx = cage.buyIn(buy_in, {"from": account})
    # assert
    assert gamble_token.balanceOf(
        account.address) == init_gamble_balance + expected
    assert weth_token.balanceOf(account.address) == init_weth_balance - buy_in


def test_buy_in_zero():
    # arrange
    gamble_token, weth_token, cage, account = deploy()
    buy_in = Web3.toWei(1, 'ether')
    # act
    with pytest.raises(exceptions.VirtualMachineError):
        cage.buyIn(buy_in, {"from": account})


def test_buy_in_more_than_in_wallet():
    # arrange
    gamble_token, weth_token, cage, account = deploy()
    buy_in = Web3.toWei(100, 'ether')
    # act
    with pytest.raises(exceptions.VirtualMachineError):
        cage.buyIn(buy_in, {"from": account})


def test_cash_out():
    # arrange
    gamble_token, weth_token, cage, account = deploy()
    buy_in = Web3.toWei(1, 'ether')
    weth_token.approve(cage.address, buy_in, {"from": account})
    tx = cage.buyIn(buy_in, {"from": account})
    tx.wait(1)
    # act
    init_gamble_balance = gamble_token.balanceOf(account.address)
    cash_out = init_gamble_balance
    init_weth_balance = weth_token.balanceOf(account.address)
    tx = cage.cashOut(cash_out, {"from": account})
    # assert
    assert gamble_token.balanceOf(
        account.address) == init_gamble_balance - cash_out
    assert weth_token.balanceOf(
        account.address) == init_weth_balance + buy_in


def test_cash_out_more_than_won():
    # arrange
    gamble_token, weth_token, cage, account = deploy()
    buy_in = Web3.toWei(1, 'ether')
    weth_token.approve(cage.address, buy_in, {"from": account})
    tx = cage.buyIn(buy_in, {"from": account})
    tx.wait(1)
    # act
    init_gamble_balance = gamble_token.balanceOf(account.address)
    cash_out = init_gamble_balance
    init_weth_balance = weth_token.balanceOf(account.address)
    # assert
    with pytest.raises(exceptions.VirtualMachineError):
        tx = cage.cashOut(cash_out * 2, {"from": account})


def main():
    pass
