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
    roulette, gamble_token,cage, dealer, players = deploy_contracts()
    # act
    tx = roulette.joinTable({"from": players[0]})
    event = tx.events["PlayerSatDown"]
    # assert
    assert roulette.isAtTable(players[0]) == True
    assert event['player'] == players[0].address


def test_join_table_no_gmbl():
    # arrange
    roulette, gamble_token, cage, dealer, players = deploy_contracts()
    # act/assert
    with pytest.raises(exceptions.VirtualMachineError):
        roulette.joinTable({"from": get_account(index=9)})


def test_play():
    # arrange
    roulette, gamble_token, cage, dealer, players = deploy_contracts()
    roulette.joinTable({"from": players[0]})
    bet_amount = 3e18
    bet_amounts = [1e18, 2e18]
    bet_types = [BET['Red'], BET['Black']]
    init_user_gmbl = gamble_token.balanceOf(players[0])
    print(init_user_gmbl)
    # act
    # gamble_token.approve(roulette.address, bet_amount, {"from": players[0]})
    tx = roulette.placeBet(bet_amounts, bet_types, {"from": players[0]})
    events = tx.events
    print(gamble_token.balanceOf(players[0]))
    # assert
    assert events['BetsPlaced']['player'] == players[0].address
    assert events['BetsPlaced']['totalBet'] == bet_amount
    assert roulette.getBets(players[0].address) == (
        (bet_amounts[0], bet_types[0], True), (bet_amounts[1], bet_types[1], True))


def test_place_bet_not_at_table():
    # arrange
    roulette, gamble_token, cage, dealer, players = deploy_contracts()
    # act/assert
    with pytest.raises(exceptions.VirtualMachineError):
        roulette.placeBet([1], [1], {"from": players[1]})


def test_place_bet_incorect_input():
    # arrange
    roulette, gamble_token, cage, dealer, players = deploy_contracts()
    # act/assert
    with pytest.raises(exceptions.VirtualMachineError):
        roulette.placeBet([1], [1, 1], {"from": players[1]})


# def test_spin_wheel():
#     # arrange
#     roulette, gamble_token, cage, dealer, players = deploy_contracts()
#     roulette.joinTable({"from": players[0]})
#     bet_amount = 3e15
#     bet_amounts = [1e15, 2e15]
#     bet_types = [BET['Red'], BET['Black']]
#     gamble_token.approve(roulette.address, bet_amount, {"from": players[0]})
#     roulette.placeBet(bet_amounts, bet_types, {"from": players[0]})
#     # act
#     tx = roulette.spinWheel({"from": dealer})
#
#     # assert
#     winningNumber = tx.events['BallStopped']['winningNumber']
#     assert winningNumber > 0
#     assert winningNumber <= 38


def test_settle_bets_single():
    # arrange
    roulette, gamble_token, cage, dealer, players = deploy_contracts()
    roulette.joinTable({"from": players[0]})
    init_user_gmbl = gamble_token.balanceOf(players[0])
    bet_amount = 1e18
    bet_amounts = [1e18]
    bet_types = [BET['Red']]
    amount_won = 2e18
    tx= roulette.placeBet(bet_amounts, bet_types, {"from": players[0]})
    winning_num = roulette.getWinningNumber()
    print(winning_num)
    # act
    assert roulette.getBets(players[0]) == ((bet_amounts[0], bet_types[0], True),)
    event = tx.events['WinningsPaidOut']
    print(event["payout"])
    # assert
    if winning_num in [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]:
        expected_payout = amount_won
        assert gamble_token.balanceOf(
        players[0]) == after_bet_user_gmbl + expected_payout
        assert roulette.getWinnings(players[0]) == expected_payout
        assert event["player"] == players[0].address
        assert event["payout"] == expected_payout
    else:
        assert roulette.getWinnings(players[0]) == 0
        assert event["player"] == players[0].address
        assert event["payout"] == 0
    assert roulette.getBets(players[0]) == ((bet_amounts[0], bet_types[0], True),)

def test_settle_bets_twice():
    # arrange
    roulette, gamble_token, cage, dealer, players = deploy_contracts()
    roulette.joinTable({"from": players[0]})
    init_user_gmbl = gamble_token.balanceOf(players[0])
    bet_amount = 1e18
    bet_amounts = [1e18]
    bet_types = [BET['Red']]
    amount_won = 2e18
    tx = roulette.placeBet(bet_amounts, bet_types, {"from": players[0]})
    winning_num = roulette.getWinningNumber()
    print(winning_num)
    bets = roulette.getBets(players[0])
    print(bets)
    assert bets == ((bet_amounts[0], bet_types[0], True),)
    event = tx.events['WinningsPaidOut']
    print(event["payout"])
    bets = roulette.getBets(players[0])
    print(bets)
    #act
    init_user_gmbl = gamble_token.balanceOf(players[0])
    tx = roulette.placeBet(bet_amounts, bet_types, {"from": players[0]})
    winning_num = roulette.getWinningNumber()
    print(winning_num)
    bets=roulette.getBets(players[0])
    assert bets == ((bet_amounts[0], bet_types[0], True),(bet_amounts[0], bet_types[0], True))
    event = tx.events['WinningsPaidOut']
    # assert
    if winning_num in [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]:
        expected_payout = amount_won
        assert gamble_token.balanceOf(
        players[0]) == after_bet_user_gmbl + expected_payout
        assert roulette.getWinnings(players[0]) == expected_payout
        assert event["player"] == players[0].address
        assert event["payout"] == expected_payout
    else:
        assert roulette.getWinnings(players[0]) == 0
        assert event["player"] == players[0].address
        assert event["payout"] == 0
    bets=roulette.getBets(players[0])
    assert bets == ((bet_amounts[0], bet_types[0], True),(bet_amounts[0], bet_types[0], True))


def test_get_bets():
    # arrange
    roulette, gamble_token, cage, dealer, players = deploy_contracts()
    roulette.joinTable({"from": players[0]})
    init_user_gmbl = gamble_token.balanceOf(players[0])
    bet_amount = 1e18
    bet_amounts = [1e18]
    bet_types = [BET['Red']]
    amount_won = 2e18
    roulette.placeBet(bet_amounts, bet_types, {"from": players[0]})
    # act
    bets = roulette.getBets(players[0])
    print(bets)
    # assert
    assert bets == ((bet_amount, bet_types[0], True),)

def test_play_2():
    # arrange
    roulette, gamble_token, cage, dealer, players = deploy_contracts()
    roulette.joinTable({"from": players[0]})
    init_user_gmbl = gamble_token.balanceOf(players[0])
    bet_amount = 1e18
    bet_amounts = [1e18]
    bet_types = [BET['Red']]
    amount_won = 2e18
    roulette.placeBet(bet_amounts, bet_types, {"from": players[0]})
    bets = roulette.getBets(players[0])
    print(bets)
    roulette.placeBet(bet_amounts, bet_types, {"from": players[0]})
    # act
    bets = roulette.getBets(players[0])
    print(bets)
    assert bets == ((1e18,0,True),(1e18,0,True))


def test_leave_table():
    # arrange
    roulette, gamble_token, cage, dealer, players = deploy_contracts()
    roulette.joinTable({"from": players[0]})
    # act
    tx = roulette.leaveTable({"from": players[0]})
    event = tx.events['LeftTable']
    # assert
    assert roulette.isAtTable(players[0]) == False
    assert event["player"] == players[0].address


def main():
    pass
