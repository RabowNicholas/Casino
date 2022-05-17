from brownie import network
from scripts.deploy import deploy
from scripts.helpful_scripts import (
    get_contract,
    BET,
    LOCAL_BLOCKCHAIN_ENVIRONMENTS
)
from web3 import Web3
import pytest


def test_playing():
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()

    # deploy all contracts correctly
    roulette, gamble_token, cage, account = deploy()
    # exchange weth for gamble
    buy_in = 10e15
    init_player_gamble = gamble_token.balanceOf(account)
    print(f"Buying in with {buy_in}...")

    cage.buyIn({"from": account, "value": buy_in})
    after_buy_player_gamble = gamble_token.balanceOf(account)
    assert after_buy_player_gamble == buy_in + init_player_gamble
    print("Successful buy in.")
    # sit down at table
    print("Joining Table...")
    join_table = roulette.joinTable({"from": account})
    assert join_table.events['PlayerSatDown']['player'] == account.address
    print("Successfully joined table.")
    # make bet
    print("Place bet 1 GMBL on Red, 1 GMBL on 69 split...")
    bet_amounts = [1e15, 1e15]
    bet_types = [BET['Red'], BET['Split_6_9']]
    gamble_token.approve(roulette.address, 2e15, {"from": account})
    place_bet = roulette.placeBet(bet_amounts, bet_types, {"from": account})
    assert place_bet.events['BetsPlaced']['totalBet'] == 2e15
    print("Successfully placed bet.")

    # wait for payment of funds
    print("Dealer spinning wheel")
    spin = roulette.spinWheel({"from": account})
    winningNumber = roulette.getWinningNumber()
    print(f"The ball landed on {winningNumber}.")
    print("Dealer settling wagers...")
    init_balance = gamble_token.balanceOf(account)
    settle = roulette.settleAllBets({"from": account})
    # assert check all events and payout
    actual_payout = settle.events["WinningsPaidOut"]['payout']
    expected_payout = 0
    if winningNumber in [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]:
        expected_payout += 2e15
    if winningNumber in [6, 9]:
        expected_payout += 18e15

    assert expected_payout == actual_payout
    print("All debts settled")
    current_balance = gamble_token.balanceOf(account)
    assert current_balance == init_balance + actual_payout
    print(f"Current GMBL balance is: {current_balance}")
    assert actual_payout == expected_payout
    cash_out = cage.cashOut(actual_payout, {"from": account})
    cash_out_amount = cash_out.events['CashOut']['amount']


def main():
    pass
