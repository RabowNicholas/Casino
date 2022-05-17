from brownie import network
from scripts.helpful_scripts import (
    deploy_contracts,
    BET,
    LOCAL_BLOCKCHAIN_ENVIRONMENTS
)
from web3 import Web3
import pytest


def test_playing():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()

    # deploy all contracts correctly
    roulette, gamble_token, cage, dealer, players = deploy_contracts()
    # exchange weth for gamble
    buy_in = 10e15
    init_player_gamble = gamble_token.balanceOf(players[0])
    print(f"Buying in with {buy_in}...")
    cage.buyIn({"from": players[0], "value": buy_in})
    after_buy_player_gamble = gamble_token.balanceOf(players[0])
    assert after_buy_player_gamble == buy_in + init_player_gamble
    print("Successful buy in.")
    # sit down at table
    print("Joining Table...")
    join_table = roulette.joinTable({"from": players[0]})
    assert join_table.events['PlayerSatDown']['player'] == players[0].address
    print("Successfully joined table.")
    # make bet
    print("Place bet 1 GMBL on Red, 1 GMBL on 69 split...")
    bet_amounts = [1e15, 1e15]
    bet_types = [BET['Red'], BET['Split_6_9']]
    gamble_token.approve(roulette.address, 2e15, {"from": players[0]})
    place_bet = roulette.placeBet(bet_amounts, bet_types, {"from": players[0]})
    assert place_bet.events['BetsPlaced']['totalBet'] == 2e15
    print("Successfully placed bet.")

    # wait for payment of funds
    print("Dealer spinning wheel")
    spin = roulette.spinWheel({"from": dealer})
    winningNumber = roulette.getWinningNumber()
    print(f"The ball landed on {winningNumber}.")
    print("Dealer settling wagers...")
    init_balance = gamble_token.balanceOf(players[0])
    settle = roulette.settleAllBets({"from": dealer})
    # assert check all events and payout
    actual_payout = settle.events["WinningsPaidOut"]['payout']
    expected_payout = 0
    if winningNumber in [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]:
        expected_payout += 2e15
    if winningNumber in [6, 9]:
        expected_payout += 18e15

    assert expected_payout == actual_payout
    print("All debts settled")
    current_balance = gamble_token.balanceOf(players[0])
    assert current_balance == init_balance + actual_payout
    print(f"Current GMBL balance is: {current_balance}")
    current_eth_balance = players[0].balance()
    cash_out = cage.cashOut(actual_payout, {"from": players[0]})
    cash_out_amount = cash_out.events['CashOut']['amount']
    assert players[0].balance() == current_eth_balance + cash_out_amount


def main():
    pass
