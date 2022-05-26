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
    buy_in = 1e16
    init_player_gamble = gamble_token.balanceOf(players[0])
    print(f"Buying in with {buy_in/1e18} ETH...")
    cage.buyIn({"from": players[0], "value": buy_in})
    after_buy_player_gamble = gamble_token.balanceOf(players[0])
    print("Successful buy in.")
    # sit down at table
    print("Joining Table...")
    join_table = roulette.joinTable({"from": players[0]})
    assert join_table.events['PlayerSatDown']['player'] == players[0].address
    print("Successfully joined table.")
    # play
    init_user_gmbl = gamble_token.balanceOf(players[0])
    print(f"User GMBL balance: {init_user_gmbl / 1e18}")
    print("Place bet 5 GMBL on Red, 1 GMBL on High...")
    bet_amount = 6e18
    bet_amounts = [5e18, 1e18]
    bet_types = [BET['Red'], BET['High']]
    place_bet = roulette.placeBet(bet_amounts, bet_types, {"from": players[0]})
    assert place_bet.events['BetsPlaced']['totalBet'] == bet_amount
    print("Successfully placed bet.")

    # wait for payment of funds
    print("Dealer spinning wheel")
    winningNumber = roulette.getWinningNumber()
    print(f"The ball landed on {winningNumber}.")
    print("Dealer settling wagers...")
    # assert check all events and payout
    actual_payout = place_bet.events["WinningsPaidOut"]['payout']
    expected_payout = 0
    if winningNumber in [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]:
        expected_payout += 10e18
    if winningNumber in list(range(19,37)):
        expected_payout += 2e18

    assert expected_payout == actual_payout
    print("All debts settled")
    current_balance = gamble_token.balanceOf(players[0])
    assert current_balance == after_buy_player_gamble + actual_payout - bet_amount
    print(f"Current GMBL balance is: {current_balance / 1e18}")
    current_eth_balance = players[0].balance()
    print(f"Cashing out: {current_balance / 1e18}")
    cash_out = cage.cashOut(current_balance, {"from": players[0]})
    cash_out_amount = cash_out.events['CashOut']['amount']
    assert players[0].balance() == current_eth_balance + cash_out_amount


def main():
    pass
