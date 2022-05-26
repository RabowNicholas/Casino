from brownie import network, Contract
from scripts.deploy import deploy
from scripts.helpful_scripts import (
    get_account,
    BET,
    LOCAL_BLOCKCHAIN_ENVIRONMENTS
)
from web3 import Web3
import pytest
import json



def test_playing():
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()


    print("Starting test on Testnet")
    # deploy all contracts correctly
    address_source_path = r"/Users/nicholasrabow/Desktop/Projects/Blockchain/Casino/build/deployments/map.json"
    f = open(address_source_path, 'r')
    data = json.loads(f.read())
    roulette = Contract.from_explorer(data['4']['Roulette'][0])
    gamble_token = Contract.from_explorer(data['4']['GambleToken'][0])
    cage = Contract.from_explorer(data['4']['Cage'][0])
    account = get_account()
    f.close()
    # exchange weth for gamble
    buy_in = 1e16
    init_player_gamble = gamble_token.balanceOf(account)
    print(f"Buying in with {buy_in / 1e18} ETH...")

    cage.buyIn({"from": account, "value": buy_in})
    after_buy_player_gamble = gamble_token.balanceOf(account)
    assert after_buy_player_gamble == buy_in*1000 + init_player_gamble
    print("Successful buy in.")
    print(f"GMBL amount increased from {init_player_gamble/1e18} GMBL to {after_buy_player_gamble/1e18} GMBL.")
    # sit down at table
    print("Joining Table...")
    join_table = roulette.joinTable({"from": account})
    assert join_table.events['PlayerSatDown']['player'] == account.address
    print("Successfully joined table.")
    # make bet
    print("Place bet 1 GMBL on Red and 1 GMBL on High...")
    bet_amount = 2e18
    bet_amounts = [1e18, 1e18]
    bet_types = [BET['Red'], BET['High']]
    place_bet = roulette.placeBet(bet_amounts, bet_types, {"from": account})
    assert place_bet.events['BetsPlaced']['totalBet'] == 2e18
    print("Successfully placed bet.")
    print(f"After bet player gamble balance: {(after_buy_player_gamble-bet_amount)/1e18} GMBL")

    # wait for payment of funds
    print("Dealer spinning wheel")
    winningNumber = place_bet.events['BallStopped']['winningNumber']
    print(f"The ball landed on {winningNumber}.")
    expected_payout = 0
    if winningNumber in [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]:
        print("Number was Red")
        expected_payout += 2e18
    if winningNumber in list(range(19,37)):
        print("Number was High")
        expected_payout += 2e18
    print("Dealer settling wagers...")
    # assert check all events and payout
    actual_payout = place_bet.events["WinningsPaidOut"]['payout']
    print(f"Actually paid out: {actual_payout/1e18} GMBL")
    print(f"Expected to payout: {expected_payout /1e18} GMBL")
    assert expected_payout == actual_payout
    print("All debts settled")
    gmbl_balance = gamble_token.balanceOf(account)
    print(f"Current balance: {gmbl_balance / 1e18} GMBL")

    # make another bet
    print("Place bet 1 GMBL on Black and 1 on Even...")
    bet_amounts = [1e18, 1e18]
    bet_types = [BET['Black'], BET['Even']]
    place_bet = roulette.placeBet(bet_amounts, bet_types, {"from": account})
    assert place_bet.events['BetsPlaced']['totalBet'] == 2e18
    print("Successfully placed bet.")
    print(f"After bet player gamble balance: {(gmbl_balance-bet_amount) /1e18} GMBL")

    # wait for payment of funds for second bet
    print("Dealer spinning wheel")
    winningNumber = roulette.getWinningNumber()
    print(f"The ball landed on {winningNumber}.")
    expected_payout = 0
    if winningNumber in [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35]:
        print("Number was Black")
        expected_payout += 2e18
    if winningNumber in [2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36]:
        print("Number was Even")
        expected_payout += 2e18
    print("Dealer settling wagers...")
    # assert check all events and payout
    actual_payout = place_bet.events["WinningsPaidOut"]['payout']
    print(f"Actually paid out: {actual_payout/1e18} GMBL")
    print(f"Expected to payout: {expected_payout/1e18} GMBL")
    assert expected_payout == actual_payout
    print("All debts settled")
    gmbl_balance = gamble_token.balanceOf(account)
    print(f"Current balance: {gmbl_balance / 1e18} GMBL")

    #cash out
    current_balance = gamble_token.balanceOf(account)
    assert current_balance == after_buy_player_gamble + actual_payout - bet_amount
    print(f"Current GMBL balance is: {current_balance/1e18} GMBL")
    assert actual_payout == expected_payout
    cash_out_amount_expected = 5e18
    print(f"Cashing out {cash_out_amount_expected /1e18} GMBL")
    cash_out = cage.cashOut(cash_out_amount_expected, {"from": account})
    cash_out_amount_actual = cash_out.events['CashOut']['amount']
    print(f"Cashed out {cash_out_amount_actual /1e15} GMBL")
    assert cash_out_amount_expected/1000 == cash_out_amount_actual
    gmbl_balance_end = gamble_token.balanceOf(account)
    print(f"Current balance: {gmbl_balance_end / 1e18} GMBL")


def main():
    pass
