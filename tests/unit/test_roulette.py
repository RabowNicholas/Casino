from brownie import Roulette, exceptions
from scripts.helpful_scripts import (
    deploy_contracts,
    get_account,
    get_contract,
    BET
)
import pytest


def test_join_table():
    # arrange
    roulette, gamble_token, _, _, dealer, players = deploy_contracts()
    # act
    tx = roulette.joinTable({"from": players[0]})
    event = tx.events["PlayerSatDown"]
    # assert
    assert roulette.isAtTable(players[0]) == True
    assert event['player'] == players[0].address


def test_join_table_no_gmbl():
    # arrange
    roulette, gamble_token, _, _, dealer, players = deploy_contracts()
    # act/assert
    with pytest.raises(exceptions.VirtualMachineError):
        roulette.joinTable({"from": get_account(index=9)})


def test_place_bet():
    # arrange
    roulette, gamble_token, _, cage, dealer, players = deploy_contracts()
    roulette.joinTable({"from": players[0]})
    bet_amount = 3e15
    bet_amounts = [1e15, 2e15]
    bet_types = [BET['Red'], BET['Black']]
    init_user_gmbl = gamble_token.balanceOf(players[0])
    # act
    gamble_token.approve(roulette.address, bet_amount, {"from": players[0]})
    tx = roulette.placeBet(bet_amounts, bet_types, {"from": players[0]})
    event = tx.events['BetsPlaced']
    # assert
    assert event['player'] == players[0].address
    assert event['totalBet'] == bet_amount
    assert roulette.getBets(players[0].address) == (
        (bet_amounts[0], bet_types[0]), (bet_amounts[1], bet_types[1]))
    assert gamble_token.balanceOf(players[0]) == init_user_gmbl - bet_amount


def test_place_bet_not_at_table():
    # arrange
    roulette, gamble_token, _, cage, dealer, players = deploy_contracts()
    # act/assert
    with pytest.raises(exceptions.VirtualMachineError):
        roulette.placeBet([1], [1], {"from": players[1]})


def test_place_bet_incorect_input():
    # arrange
    roulette, gamble_token, _, cage, dealer, players = deploy_contracts()
    # act/assert
    with pytest.raises(exceptions.VirtualMachineError):
        roulette.placeBet([1], [1, 1], {"from": players[1]})


def test_spin_wheel():
    # arrange
    roulette, gamble_token, _, cage, dealer, players = deploy_contracts()
    roulette.joinTable({"from": players[0]})
    bet_amount = 3e15
    bet_amounts = [1e15, 2e15]
    bet_types = [BET['Red'], BET['Black']]
    gamble_token.approve(roulette.address, bet_amount, {"from": players[0]})
    roulette.placeBet(bet_amounts, bet_types, {"from": players[0]})
    # act
    tx = roulette.spinWheel({"from": dealer})

    # assert
    winningNumber = tx.events['BallStopped']['winningNumber']
    assert winningNumber > 0
    assert winningNumber <= 38


def test_settle_bets_single():
    # arrange
    roulette, gamble_token, _, cage, dealer, players = deploy_contracts()
    roulette.joinTable({"from": players[0]})
    bet_amount = 1e15
    bet_amounts = [1e15]
    bet_types = [BET['One']]
    amount_won = 36e15
    gamble_token.approve(roulette.address, bet_amount, {"from": players[0]})
    roulette.placeBet(bet_amounts, bet_types, {"from": players[0]})
    init_user_gmbl = gamble_token.balanceOf(players[0])
    assert init_user_gmbl == 9e15
    tx = roulette.spinWheel({"from": dealer})
    winning_num = roulette.getWinningNumber()
    # act
    tx = roulette.settleAllBets({"from": dealer})
    # assert
    if winning_num == 1:
        expected_payout = amount_won
    else:
        expected_payout = 0
    assert gamble_token.balanceOf(
        players[0]) == init_user_gmbl + expected_payout
    assert roulette.getWinnings(players[0]) == expected_payout
    assert roulette.getLifetimeWinnings(players[0]) == expected_payout


def test_leave_table():
    # arrange
    roulette, gamble_token, _, cage, dealer, players = deploy_contracts()
    roulette.joinTable({"from": players[0]})
    # act
    tx = roulette.leaveTable({"from": players[0]})
    event = tx.events['LeftTable']
    # assert
    assert roulette.isAtTable(players[0]) == False
    assert event["player"] == players[0].address


def main():
    pass
