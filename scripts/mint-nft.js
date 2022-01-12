require("dotenv").config()
const API_URL = process.env.API_URL
const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(API_URL)
const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json")


const contractAddress = "0xEA73Ea9be491368f5B185525Bc0EEf9a873De636"

const nftContract = new web3.eth.Contract(contract.abi, contractAddress)
