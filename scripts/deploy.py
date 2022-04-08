from brownie import (
    network,
    config,
    interface,
    GambleToken,
    Cage,
    Roulette
)
from scripts.helpful_scripts import (
    get_account,
    get_contract
)


def deploy():

    account = get_account()
    print(f"Account is {account}")
    gamble_token = GambleToken.deploy({"from": account})
    weth_token = get_contract('weth_token')
    cage = Cage.deploy(
        gamble_token.address,
        weth_token.address,
        1000,
        1000,
        {"from": account}
    )
    roulette = Roulette.deploy(
        gamble_token.address,
        cage.address,
        {"from": account},
        publish_source=config["networks"][network.show_active()].get('verify')
    )
    return roulette, gamble_token, cage, account


def main():
    _, _, _, _, _ = deploy()


if __name__ == "__main__":
    main()
