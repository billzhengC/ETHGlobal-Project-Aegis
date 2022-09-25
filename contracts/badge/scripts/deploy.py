from brownie import BadgeNFT, network, config, accounts

def deploy():
    account = accounts.add(config["wallets"]["from_key"])  # accounts[0]
    badge = BadgeNFT.deploy(
        {"from": account}
    )  # todo:add publish source later
    return BadgeNFT[-1]


def mint_NFT(_type, _season_year, _season_unit, _isAllTime, _rank, _to_address):
    BadgeNFT = BadgeNFT[-1]
    tx = BadgeNFT.mint(
        _type, _season_year, _season_unit, _isAllTime, _rank, _to_address
    )
    tx.wait(1)


def main():
    deploy()
    # made_up_address = accounts[
    #     0
    # ].address  
    # mint_NFT(0, 2022, 2, False, 7, made_up_address)

   