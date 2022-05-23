import os
import shutil

def copy_contract_json():
    contract_source_folder=r"/Users/nicholasrabow/Desktop/Projects/Blockchain/Casino/build/contracts/"
    destination_folder = r"/Users/nicholasrabow/Desktop/Projects/Blockchain/Casino/front-end/src/contracts_data/"

    for file_name in os.listdir(contract_source_folder):
        source = contract_source_folder + file_name
        destination = destination_folder + file_name
        if file_name in ["Cage.json", "GambleToken.json", "Roulette.json"]:
            shutil.copy(source, destination)
            print("copied", file_name)


def copy_address_map():
    address_source_path = r"/Users/nicholasrabow/Desktop/Projects/Blockchain/Casino/build/deployments/map.json"
    destination_file_path = r"/Users/nicholasrabow/Desktop/Projects/Blockchain/Casino/front-end/src/contracts_data/map.json"

    shutil.copy(address_source_path,destination_file_path)
    print("copied address map")

def main():
    copy_contract_json()
    copy_address_map()
