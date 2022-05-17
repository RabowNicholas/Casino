from brownie import (
    network,
    accounts,
    config,
    Contract,
    interface,
    MockWETH,
    MockV3Aggregator,
    VRFCoordinatorV2Mock,
    GambleToken,
    LinkToken,
    Cage,
    Roulette
)
import pytest

INITIAL_PRICE_FEED_VALUE = 2e11
DECIMALS = 18
SECONDS_IN_DAY = 86400
BET = {
    'Red': 0,
    'Black': 1,
    'Even': 2,
    'Odd': 3,
    'High': 4,
    'Low': 5,
    'Column1_34': 6,
    'Column2_35': 7,
    'Column3_36': 8,
    'FirstDozen': 9,
    'SecondDozen': 10,
    'ThirdDozen': 11,
    'Zero': 12,
    'DoubleZero': 13,
    'One': 14,
    'Two': 15,
    'Three': 16,
    'Four': 17,
    'Five': 18,
    'Six': 19,
    'Seven': 20,
    'Eight': 21,
    'Nine': 22,
    'Ten': 23,
    'Eleven': 24,
    'Twelve': 25,
    'Thirteen': 26,
    'Fourteen': 27,
    'Fifteen': 28,
    'Sixteen': 29,
    'Seventeen': 30,
    'Eighteen': 31,
    'Nineteen': 32,
    'Twenty': 33,
    'Twentyone': 34,
    'Twentytwo': 35,
    'Twentythree': 36,
    'Twentyfour': 37,
    'Twentyfive': 38,
    'Twentysix': 39,
    'Twentyseven': 40,
    'Twentyeight': 41,
    'Twentynine': 42,
    'Thirty': 43,
    'Thirtyone': 44,
    'Thirtytwo': 45,
    'Thirtythree': 46,
    'Thirtyfour': 47,
    'Thirtyfive': 48,
    'Thirtysix': 49,
    'Split_1_4': 50,
    'Split_1_2': 51,
    'Split_2_3': 52,
    'Split_2_5': 53,
    'Split_3_6': 54,
    'Split_4_5': 55,
    'Split_4_7': 56,
    'Split_5_6': 57,
    'Split_5_8': 58,
    'Split_6_9': 59,
    'Split_7_8': 60,
    'Split_7_10': 61,
    'Split_8_9': 62,
    'Split_8_11': 63,
    'Split_9_12': 64,
    'Split_10_11': 65,
    'Split_10_13': 66,
    'Split_11_12': 67,
    'Split_11_14': 68,
    'Split_12_15': 69,
    'Split_13_14': 70,
    'Split_13_16': 71,
    'Split_14_15': 72,
    'Split_14_17': 73,
    'Split_15_18': 74,
    'Split_16_17': 75,
    'Split_16_19': 76,
    'Split_17_18': 77,
    'Split_17_20': 78,
    'Split_18_21': 79,
    'Split_19_20': 80,
    'Split_19_22': 81,
    'Split_20_21': 82,
    'Split_20_23': 83,
    'Split_21_24': 84,
    'Split_22_23': 85,
    'Split_22_25': 86,
    'Split_23_24': 87,
    'Split_23_26': 88,
    'Split_24_27': 89,
    'Split_25_26': 90,
    'Split_25_28': 91,
    'Split_26_27': 92,
    'Split_26_29': 93,
    'Split_27_30': 94,
    'Split_28_29': 95,
    'Split_28_31': 96,
    'Split_29_30': 97,
    'Split_29_32': 98,
    'Split_30_33': 99,
    'Split_31_32': 100,
    'Split_31_34': 101,
    'Split_32_33': 102,
    'Split_32_35': 103,
    'Split_33_36': 104,
    'Split_34_35': 105,
    'Split_35_36': 106,
    'Square_1245': 107,
    'Square_2356': 108,
    'Square_4578': 109,
    'Square_5689': 110,
    'Square_781011': 111,
    'Square_891112': 112,
    'Square_10111314': 113,
    'Square_11121415': 114,
    'Square_13141617': 115,
    'Square_14151718': 116,
    'Square_16171920': 117,
    'Square_17182021': 118,
    'Square_19202223': 119,
    'Square_20212324': 120,
    'Square_22232526': 121,
    'Square_23242627': 122,
    'Square_25262829': 123,
    'Square_26272930': 124,
    'Square_28293132': 125,
    'Square_29303233': 126,
    'Square_31323435': 127,
    'Square_32333536': 128
}

BLACKJACK_STATE = {
    "open": 0,
    "bet": 1,
    "deal": 2,
    "play": 3,
    "settle": 4
}

NON_FORKED_LOCAL_BLOCKCHAIN_ENVIRONMENTS = [
    "hardhat", "development", "ganache"]
LOCAL_BLOCKCHAIN_ENVIRONMENTS = NON_FORKED_LOCAL_BLOCKCHAIN_ENVIRONMENTS + [
    "mainnet-fork",
    "binance-fork",
    "matic-fork",
]

contract_to_mock = {
    "weth_token": MockWETH,
    "eth_usd_price_feed": MockV3Aggregator,
    "vrf_coordinator": VRFCoordinatorV2Mock,
    "link_token": LinkToken
}


def get_account(index=None, id=None):
    if index:
        return accounts[index]
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        return accounts[0]
    if id:
        return accounts.load(id)
    return accounts.add(config["wallets"]["from_key"])


def get_contract(contract_name):
    """If you want to use this function, go to the brownie config and add a new entry for
    the contract that you want to be able to 'get'. Then add an entry in the in the variable 'contract_to_mock'.
    You'll see examples like the 'link_token'.
        This script will then either:
            - Get a address from the config
            - Or deploy a mock to use for a network that doesn't have it

        Args:
            contract_name (string): This is the name that is refered to in the
            brownie config and 'contract_to_mock' variable.

        Returns:
            brownie.network.contract.ProjectContract: The most recently deployed
            Contract of the type specificed by the dictonary. This could be either
            a mock or the 'real' contract on a live network.
    """
    contract_type = contract_to_mock[contract_name]
    if network.show_active() in NON_FORKED_LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        if len(contract_type) <= 0:
            deploy_mocks()
        contract = contract_type[-1]
    else:
        try:
            contract_address = config["networks"][network.show_active(
            )][contract_name]
            contract = Contract.from_abi(
                contract_type._name, contract_address, contract_type.abi
            )
        except KeyError:
            print(
                f"{network.show_active()} address not found, perhaps you should add it to the config or deploy mocks?"
            )
            print(
                f"brownie run scripts/deploy_mocks.py --network {network.show_active()}"
            )
    return contract


def deploy_mocks(decimals=DECIMALS, initial_value=INITIAL_PRICE_FEED_VALUE):
    """
    Use this script if you want to deploy mocks to a testnet
    """
    print(f"The active network is {network.show_active()}")
    print("Deploying Mocks...")
    account = get_account()
    if len(MockWETH) <= 0:
        print("Deploying Mock WETH")
        weth_token = MockWETH.deploy({"from": account})
        print(f"Deployed to {weth_token.address}")
        print("Deploying Mock Link Token...")
        link_token = LinkToken.deploy({"from": account})
        print(f"Deployed to {link_token.address}")
        print("Deploying VRFCoordinatorMock")
        vrf_coordinator = VRFCoordinatorV2Mock.deploy(
            config["networks"]["development"]["fee"], 10000, {"from": account})
        print(f"Deployed to {vrf_coordinator.address}")


def deploy_cage():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()
    account = get_account()
    gamble_token = GambleToken.deploy({"from": account})
    cage = Cage.deploy(
        gamble_token.address,
        1000,
        1000,
        {"from": account}
    )
    return gamble_token, cage, account


def deploy_contracts():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()
    dealer = get_account(index=0)
    players = []
    gamble_token = GambleToken.deploy({"from": dealer})
    print("Deploying Cage...")
    cage = Cage.deploy(
        gamble_token.address,
        1000,
        1000,
        {"from": dealer}
    )
    print(f"Cage deployed to {cage.address}")
    link_token = get_contract('link_token')
    print("Deploying Roulette...")
    roulette = Roulette.deploy(
        gamble_token.address,
        cage.address,
        {"from": dealer})
    print(f"Roulette deployed to {roulette.address}")
    for i in range(1, 9):
        players.append(get_account(index=i))
        gamble_token.mint(players[i - 1], 10e15, {"from": dealer})
    print("Funded all players")

    return(
        roulette,
        gamble_token,
        cage,
        dealer,
        players
    )


# # We didn't have this in the video, but it's a helpful script to have you issue the tokens!
# def issue_tokens():
#     """You can call this function once you have deployed your TokenFarm contract to a live network
#     and have users that have staked tokens.
#
#     Note that it relies on get_contract, so be mindful to correctly configure your Token Farm contract
#     into brownie-config.yaml as well as the contract_to_mock dict as described in the get_contract docstring
#
#     Run this function with this command: `brownie run scripts/issue_tokens.py --network kovan`
#
#         This function will:
#             - Print your account address and deployed TokenFarm contract address to confirm that you're using the right ones
#             - Call issueTokens on your deployed TokenFarm contract to issue the DAPP token reward to your users
#     """
#     account = get_account()
#     print(f"Issue Tokens called by: {account}")
#     token_farm = get_contract("TokenFarm")
#     print(f"TokenFarm contract called to issue tokens: {token_farm}")
#     tx = token_farm.issueTokens({"from": account})
#     tx.wait(1)
