from brownie import exceptions, accounts
from scripts.helpful_scripts import(
    get_account,
    deploy_blackjack,
    place_bet,
    BLACKJACK_STATE
)
import pytest

#
# def test_can_deploy_blackjack():
#     # arrange/act
#     blackjack, gamble_token, dealer, player = deploy_blackjack()
#     # assert
#     assert blackjack.getCurrentState() == BLACKJACK_STATE["closed"]
#
#
# def test_join_empty_table():
#     # arrange
#     blackjack, gamble_token, dealer, player = deploy_blackjack()
#     # act
#     tx = blackjack.joinTable({"from": player})
#     # assert
#     assert blackjack.getPlayers()[0] == player.address
#
#
# def test_join_table_state_not_closed():
#     # arrange
#     blackjack, gamble_token, dealer, player = deploy_blackjack()
#     tx = blackjack.changeGameState(BLACKJACK_STATE["bet"], {"from": dealer})
#     # act
#     tx = blackjack.joinTable({"from": player})
#     # assert
#     assert blackjack.getTableQueue()[0] == player.address
#
#
# def test_join_table_full():
#     # arrange
#     blackjack, gamble_token, dealer, player = deploy_blackjack()
#     # act
#     for i in range(1, 7):
#         tx = blackjack.joinTable({"from": accounts[i]})
#         tx.wait(1)
#     # assert
#     tx = blackjack.joinTable({"from": accounts[7]})
#     assert len(blackjack.getPlayers()) == 6
#     assert blackjack.getTableQueue()[0] == accounts[7].address
#
#
# def test_start_game_1_player_in_queue():
#     # arrange
#     blackjack, gamble_token, dealer, player = deploy_blackjack()
#     # act
#     tx = blackjack.startGame({"from": dealer})
#     tx.wait(1)
#     # assert
#
#
# def test_change_game_state_owner():
#     # arrange
#     blackjack, gamble_token, dealer, player = deploy_blackjack()
#     # act
#     tx = blackjack.changeGameState(BLACKJACK_STATE["bet"], {"from": dealer})
#     # assert
#     assert blackjack.getCurrentState() == BLACKJACK_STATE["bet"]
#
#
# def test_change_game_state_player():
#     # arrange
#     blackjack, gamble_token, dealer, player = deploy_blackjack()
#     # act/assert
#     with pytest.raises(exceptions.VirtualMachineError):
#         tx = blackjack.changeGameState(
#             BLACKJACK_STATE["bet"], {"from": player})
#
#
# def test_place_bet():
#     # arrange
#     blackjack, gamble_token, dealer, player = deploy_blackjack()
#     tx = blackjack.changeGameState(BLACKJACK_STATE["bet"], {"from": dealer})
#     # act
#     init_gamble_balance = gamble_token.balanceOf(player.address)
#     bet_amount = 1e15  # 1/1000 of ETH
#     gamble_token.approve(blackjack.address, bet_amount, {"from": player})
#     tx = blackjack.placeBet(bet_amount, {"from": player})
#     # assert
#     assert gamble_token.balanceOf(blackjack.address) == bet_amount
#     assert gamble_token.balanceOf(
#         player.address) == init_gamble_balance - bet_amount
#     event = tx.events["PlacedBet"]
#     assert event["player"] == player.address
#     assert event["bet"] == bet_amount
#
#
# def test_place_bet_invalid_funds():
#     # arrange
#     blackjack, gamble_token, dealer, player = deploy_blackjack()
#     tx = blackjack.changeGameState(BLACKJACK_STATE["bet"], {"from": dealer})
#     # act/assert
#     bet_amount = 1e15
#     with pytest.raises(exceptions.VirtualMachineError):
#         tx = blackjack.placeBet(bet_amount, {"from": player})
#
#
# def test_deal():
#     # arrange
#     blackjack, gamble_token, dealer, player = deploy_blackjack()
#     tx = blackjack.changeGameState(BLACKJACK_STATE["bet"], {"from": dealer})
#     tx.wait(1)
#     bet_amount = 1e15
#     place_bet(gamble_token, blackjack, player, bet_amount)
#     tx.wait(1)
#     tx = blackjack.changeGameState(BLACKJACK_STATE["deal"], {"from": dealer})
#     tx.wait(1)
#     # act
#     tx = blackjack.deal({"from": dealer})
#     # assert
#     # player and dealer both have two cards in hand
#     assert blackjack.getHandLength(dealer) == 2
#     assert blackjack.getHandLength(player) == 2
#
#     # play


def main():
    pass
