https://ethereum.org/en/developers/tutorials/how-to-write-and-deploy-an-nft/#write-contract

How to mint an NFT Tutorial

from Etherium.org

Part 1/3: Deploying Smart Contract



Ropsten Etherscan:

https://ropsten.etherscan.io/tx/0x3b45f9c3e5b2e52e14f76554872dd0d733c4d047524088dc0fdcb0a305d87fc3


Explorer page:

Here you’ll see a handful of JSON-RPC calls that Hardhat/Ethers made under the hood for us when we called the .deploy() function. Two important ones to call out here are eth_sendRawTransaction, which is the request to actually write our smart contract onto the Ropsten chain, and eth_getTransactionByHash which is a request to read information about our transaction given the hash (a typical pattern when sending transactions). To learn more about sending transactions, check out this tutorial on sending transactions using Web3.

https://dashboard.alchemyapi.io/explorer?time_min=1641964226970&time_range_preset=last5Minutes

//////////////////////////////////////////////////////////////////////////////

PART 2 

MINT NFT

Etherscan
https://ropsten.etherscan.io/tx/0x6f4b3896cca3e2d0e5cab3c1f9de48dd10bb0b65c42431d1c00bdbe9db1c4d7c


Alchemy Mempool watcher
https://dashboard.alchemyapi.io/mempool/eth-ropsten/tx/0x6f4b3896cca3e2d0e5cab3c1f9de48dd10bb0b65c42431d1c00bdbe9db1c4d7c



STEP 1: CONNECT TO THE ETHEREUM NETWORK
There are a bunch of ways to make requests to the Ethereum blockchain, but to make things easy, we’ll use a free account on Alchemy, a blockchain developer platform and API that allows us to communicate with the Ethereum chain without having to run our own nodes.

In this tutorial, we’ll also take advantage of Alchemy’s developer tools for monitoring and analytics to understand what’s going on under the hood in our smart contract deployment. If you don’t already have an Alchemy account, you can sign up for free here.

STEP 2: CREATE YOUR APP (AND API KEY)
Once you’ve created an Alchemy account, you can generate an API key by creating an app. This will allow us to make requests to the Ropsten test network. Check out this guide if you’re curious to learn more about test networks.

Navigate to the “Create App” page in your Alchemy Dashboard by hovering over “Apps” in the nav bar and clicking “Create App”
Create your app

Name your app (we chose “My First NFT!”), offer a short description, select “Staging” for the Environment (used for your app bookkeeping), and choose “Ropsten” for your network.
Configure and publish your app

Click “Create app” and that’s it! Your app should appear in the table below.
STEP 3: CREATE AN ETHEREUM ACCOUNT (ADDRESS)
We need an Ethereum account to send and receive transactions. For this tutorial, we’ll use MetaMask, a virtual wallet in the browser used to manage your Ethereum account address. If you want to understand more about how transactions on Ethereum work, check out this page from the Ethereum foundation.

You can download and create a MetaMask account for free here. When you are creating an account, or if you already have an account, make sure to switch over to the “Ropsten Test Network” in the upper right (so that we’re not dealing with real money).

Set Ropsten as your network

STEP 4: ADD ETHER FROM A FAUCET
In order to deploy our smart contract to the test network, we’ll need some fake ETH. To get ETH you can go to the Ropsten faucet and enter your Ropsten account address, then click “Send Ropsten ETH.” You should see ETH in your MetaMask account soon after!

STEP 5: CHECK YOUR BALANCE
To double check our balance is there, let’s make an eth_getBalance request using Alchemy’s composer tool. This will return the amount of ETH in our wallet. After you input your MetaMask account address and click “Send Request”, you should see a response like this:

`{"jsonrpc": "2.0", "id": 0, "result": "0xde0b6b3a7640000"}`

NOTE: This result is in wei, not ETH. Wei is used as the smallest denomination of ether. The conversion from wei to ETH is 1 eth = 1018 wei. So if we convert 0xde0b6b3a7640000 to decimal we get 1*1018 wei, which equals 1 ETH.

Phew! Our fake money is all there.

STEP 6: INITIALIZE OUR PROJECT
First, we’ll need to create a folder for our project. Navigate to your command line and type:

mkdir my-nft
cd my-nft

Now that we’re inside our project folder, we’ll use npm init to initialize the project. If you don’t already have npm installed, follow these instructions (we’ll also need Node.js, so download that too!).

npm init

It doesn’t really matter how you answer the installation questions; here is how we did it for reference:

package name: (my-nft)
version: (1.0.0)
description: My first NFT!
entry point: (index.js)
test command:
git repository:
keywords:
author:
license: (ISC)
About to write to /Users/thesuperb1/Desktop/my-nft/package.json:

{
  "name": "my-nft",
  "version": "1.0.0",
  "description": "My first NFT!",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}

Show all
Approve the package.json, and we’re good to go!

STEP 7: INSTALL HARDHAT
Hardhat is a development environment to compile, deploy, test, and debug your Ethereum software. It helps developers when building smart contracts and dApps locally before deploying to the live chain.

Inside our my-nft project run:

npm install --save-dev hardhat

Check out this page for more details on installation instructions.

STEP 8: CREATE HARDHAT PROJECT
Inside our project folder run:

npx hardhat

You should then see a welcome message and option to select what you want to do. Select “create an empty hardhat.config.js”:

888    888                      888 888               888
888    888                      888 888               888
888    888                      888 888               888
8888888888  8888b.  888d888 .d88888 88888b.   8888b.  888888
888    888     "88b 888P"  d88" 888 888 "88b     "88b 888
888    888 .d888888 888    888  888 888  888 .d888888 888
888    888 888  888 888    Y88b 888 888  888 888  888 Y88b.
888    888 "Y888888 888     "Y88888 888  888 "Y888888  "Y888
👷 Welcome to Hardhat v2.0.11 👷‍
? What do you want to do? …
Create a sample project
❯ Create an empty hardhat.config.js
Quit

Show all
This will generate a hardhat.config.js file for us which is where we’ll specify all of the set up for our project (on step 13).

STEP 9: ADD PROJECT FOLDERS
To keep our project organized, we’ll create two new folders. Navigate to the root directory of your project in your command line and type:

mkdir contracts
mkdir scripts

contracts/ is where we’ll keep our NFT smart contract code

scripts/ is where we’ll keep scripts to deploy and interact with our smart contract

STEP 10: WRITE OUR CONTRACT
Now that our environment is set up, on to more exciting stuff: writing our smart contract code!

Open up the my-nft project in your favorite editor (we like VSCode). Smart contracts are written in a language called Solidity which is what we will use to write our MyNFT.sol smart contract.‌

Navigate to the contracts folder and create a new file called MyNFT.sol

Below is our NFT smart contract code, which we based on the OpenZeppelin library’s ERC-721 implementation. Copy and paste the contents below into your MyNFT.sol file.

//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract MyNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() public ERC721("MyNFT", "NFT") {}

    function mintNFT(address recipient, string memory tokenURI)
        public onlyOwner
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
}

Show less
📋 Copy
Because we are inheriting classes from the OpenZeppelin contracts library, in your command line run npm install @openzeppelin/contracts to install the library into our folder.

So, what does this code do exactly? Let’s break it down, line-by-line.

At the top of our smart contract, we import three OpenZeppelin smart contract classes:

@openzeppelin/contracts/token/ERC721/ERC721.sol contains the implementation of the ERC-721 standard, which our NFT smart contract will inherit. (To be a valid NFT, your smart contract must implement all the methods of the ERC-721 standard.) To learn more about the inherited ERC-721 functions, check out the interface definition here.

@openzeppelin/contracts/utils/Counters.sol provides counters that can only be incremented or decremented by one. Our smart contract uses a counter to keep track of the total number of NFTs minted and set the unique ID on our new NFT. (Each NFT minted using a smart contract must be assigned a unique ID—here our unique ID is just determined by the total number of NFTs in existence. For example, the first NFT we mint with our smart contract has an ID of "1," our second NFT has an ID of "2," etc.)

@openzeppelin/contracts/access/Ownable.sol sets up access control on our smart contract, so only the owner of the smart contract (you) can mint NFTs. (Note, including access control is entirely a preference. If you'd like anyone to be able to mint an NFT using your smart contract, remove the word Ownable on line 10 and onlyOwner on line 17.)

After our import statements, we have our custom NFT smart contract, which is surprisingly short — it only contains a counter, a constructor, and single function! This is thanks to our inherited OpenZeppelin contracts, which implement most of the methods we need to create an NFT, such as ownerOf which returns the owner of the NFT, and transferFrom, which transfers ownership of the NFT from one account to another.

In our ERC-721 constructor, you’ll notice we pass 2 strings, “MyNFT” and “NFT.” The first variable is the smart contract’s name, and the second is its symbol. You can name each of these variables whatever you wish!

Finally, we have our function mintNFT(address recipient, string memory uri) that allows us to mint an NFT! You'll notice this function takes in two variables:

address recipient specifies the address that will receive your freshly minted NFT

string memory tokenURI is a string that should resolve to a JSON document that describes the NFT's metadata. An NFT's metadata is really what brings it to life, allowing it to have configurable properties, such as a name, description, image, and other attributes. In part 2 of this tutorial, we will describe how to configure this metadata.

mintNFT calls some methods from the inherited ERC-721 library, and ultimately returns a number that represents the ID of the freshly minted NFT.

STEP 11: CONNECT METAMASK & ALCHEMY TO YOUR PROJECT
Now that we’ve created a MetaMask wallet, Alchemy account, and written our smart contract, it’s time to connect the three.

Every transaction sent from your virtual wallet requires a signature using your unique private key. To provide our program with this permission, we can safely store our private key (and Alchemy API key) in an environment file.

To learn more about sending transactions, check out this tutorial on sending transactions using web3.

First, install the dotenv package in your project directory:

npm install dotenv --save

Then, create a .env file in the root directory of our project, and add your MetaMask private key and HTTP Alchemy API URL to it.

Follow these instructions to export your private key from MetaMask

See below to get HTTP Alchemy API URL and copy it to your clipboard

Copy your Alchemy API URL

Your .env should now look like this:

API_URL="https://eth-ropsten.alchemyapi.io/v2/your-api-key"
PRIVATE_KEY="your-metamask-private-key"

To actually connect these to our code, we’ll reference these variables in our hardhat.config.js file on step 13.

STEP 12: INSTALL ETHERS.JS
Ethers.js is a library that makes it easier to interact and make requests to Ethereum by wrapping standard JSON-RPC methods with more user friendly methods.

Hardhat makes it super easy to integrate Plugins for additional tooling and extended functionality. We’ll be taking advantage of the Ethers plugin for contract deployment (Ethers.js has some super clean contract deployment methods).

In your project directory type:

npm install --save-dev @nomiclabs/hardhat-ethers 'ethers@^5.0.0'

We’ll also require ethers in our hardhat.config.js in the next step.

STEP 13: UPDATE HARDHAT.CONFIG.JS
We’ve added several dependencies and plugins so far, now we need to update hardhat.config.js so that our project knows about all of them.

Update your hardhat.config.js to look like this:

/**
* @type import('hardhat/config').HardhatUserConfig
*/
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
const { API_URL, PRIVATE_KEY } = process.env;
module.exports = {
   solidity: "0.8.0",
   defaultNetwork: "ropsten",
   networks: {
      hardhat: {},
      ropsten: {
         url: API_URL,
         accounts: [`0x${PRIVATE_KEY}`]
      }
   },
}

Show less
STEP 14: COMPILE OUR CONTRACT
To make sure everything is working so far, let’s compile our contract. The compile task is one of the built-in hardhat tasks.

From the command line run:

npx hardhat compile

You might get a warning about SPDX license identifier not provided in source file , but no need to worry about that — hopefully everything else looks good! If not, you can always message in the Alchemy discord.

STEP 15: WRITE OUR DEPLOY SCRIPT
Now that our contract is written and our configuration file is good to go, it’s time to write our contract deploy script.

Navigate to the scripts/ folder and create a new file called deploy.js, adding the following contents to it:

async function main() {
  const MyNFT = await ethers.getContractFactory("MyNFT")

  // Start deployment, returning a promise that resolves to a contract object
  const myNFT = await MyNFT.deploy()
  await myNFT.deployed()
  console.log("Contract deployed to address:", myNFT.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

Show all
📋 Copy
Hardhat does an amazing job of explaining what each of these lines of code does in their Contracts tutorial, we’ve adopted their explanations here.

const MyNFT = await ethers.getContractFactory("MyNFT");

A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts, so MyNFT here is a factory for instances of our NFT contract. When using the hardhat-ethers plugin ContractFactory and Contract instances are connected to the first signer by default.

const myNFT = await MyNFT.deploy();

Calling deploy() on a ContractFactory will start the deployment, and return a Promise that resolves to a Contract. This is the object that has a method for each of our smart contract functions.

STEP 16: DEPLOY OUR CONTRACT
We’re finally ready to deploy our smart contract! Navigate back to the root of your project directory, and in the command line run:

npx hardhat --network ropsten run scripts/deploy.js

You should then see something like:

Contract deployed to address: 0x81c587EB0fE773404c42c1d2666b5f557C470eED

If we go to the Ropsten etherscan and search for our contract address we should able to see that it has been deployed successfully. The transaction will look something like this:

View your transaction address on Etherscan

The From address should match your MetaMask account address and the To address will say “Contract Creation.” If we click into the transaction, we’ll see our contract address in the To field:

View your contract address on Etherscan

Yasssss! You just deployed your NFT smart contract to the Ethereum chain!

To understand what’s going on under the hood, let’s navigate to the Explorer tab in our Alchemy dashboard . If you have multiple Alchemy apps make sure to filter by app and select “MyNFT”.

View calls made “under the hood” with Alchemy’s Explorer Dashboard

Here you’ll see a handful of JSON-RPC calls that Hardhat/Ethers made under the hood for us when we called the .deploy() function. Two important ones to call out here are eth_sendRawTransaction, which is the request to actually write our smart contract onto the Ropsten chain, and eth_getTransactionByHash which is a request to read information about our transaction given the hash (a typical pattern when sending transactions). To learn more about sending transactions, check out this tutorial on sending transactions using Web3.

That’s all for Part 1 of this tutorial. In Part 2, we’ll actually interact with our smart contract by minting an NFT, and in Part 3 we’ll show you how to view your NFT in your Ethereum wallet!


////////////////////////////////////////////////////////////////////////////////////////////////////

HOW TO MINT AN NFT (PART 2/3 OF NFT TUTORIAL SERIES)
NFTS
ERC-721
ALCHEMY
SOLIDITY
SMART CONTRACTS
BEGINNER
✍️Sumi Mudgil
📆April 21, 2021
⏱️9 minute read
On this page
Beeple: $69 Million 3LAU: $11 Million Grimes: $6 Million

All of them minted their NFT’s using Alchemy’s powerful API. In this tutorial, we’ll teach you how to do the same in <10 minutes.

“Minting an NFT” is the act of publishing a unique instance of your ERC-721 token on the blockchain. Using our smart contract from Part 1 of this NFT tutorial series, let’s flex our web3 skills and mint an NFT. At the end of this tutorial, you’ll be able to mint as many NFTs as your heart (and wallet) desires!

Let’s get started!

STEP 1: INSTALL WEB3
If you followed the first tutorial on creating your NFT smart contract, you already have experience using Ethers.js. Web3 is similar to Ethers, as it is a library used to make creating requests to the Ethereum blockchain easier. In this tutorial we’ll be using Alchemy Web3, which is an enhanced web3 library that offers automatic retries and robust WebSocket support.

In your project home directory run:

npm install @alch/alchemy-web3

STEP 2: CREATE A MINT-NFT.JS FILE
Inside your scripts directory, create an mint-nft.js file and add the following lines of code:

require("dotenv").config()
const API_URL = process.env.API_URL
const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(API_URL)

📋 Copy
STEP 3: GRAB YOUR CONTRACT ABI
Our contract ABI (Application Binary Interface) is the interface to interact with our smart contract. You can learn more about Contract ABIs here. Hardhat automatically generates an ABI for us and saves it in the MyNFT.json file. In order to use this we’ll need to parse out the contents by adding the following lines of code to our mint-nft.js file:

const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json")

📋 Copy
If you want to see the ABI you can print it to your console:

console.log(JSON.stringify(contract.abi))

📋 Copy
To run mint-nft.js and see your ABI printed to the console navigate to your terminal and run

node scripts/mint-nft.js

📋 Copy
STEP 4: CONFIGURE THE METADATA FOR YOUR NFT USING IPFS
If you remember from our tutorial in Part 1, our mintNFT smart contract function takes in a tokenURI parameter that should resolve to a JSON document describing the NFT's metadata— which is really what brings the NFT to life, allowing it to have configurable properties, such as a name, description, image, and other attributes.

Interplanetary File System (IPFS) is a decentralized protocol and peer-to-peer network for storing and sharing data in a distributed file system.

We will use Pinata, a convenient IPFS API and toolkit, to store our NFT asset and metadata to ensure our NFT is truly decentralized. If you don’t have a Pinata account, sign up for a free account here and complete the steps to verify your email.

Once you’ve created an account:

Navigate to the “Files” page and click the blue "Upload" button at the top-left of the page.

Upload an image to pinata — this will be the image asset for your NFT. Feel free to name the asset whatever you wish

After you upload, you'll see the file info in the table on the Files page. You'll also see a CID column. You can copy the CID by clicking the copy button next to it. You can view your upload at: https://gateway.pinata.cloud/ipfs/<CID>. You can find the image we used on IPFS here, for example.

For the more visual learners, the steps above are summarized here:

How to upload your image to Pinata

Now, we’re going to want to upload one more document to Pinata. But before we do that, we need to create it!

In your root directory, make a new file called nft-metadata.json and add the following json code:

{
  "attributes": [
    {
      "trait_type": "Breed",
      "value": "Maltipoo"
    },
    {
      "trait_type": "Eye color",
      "value": "Mocha"
    }
  ],
  "description": "The world's most adorable and sensitive pup.",
  "image": "https://gateway.pinata.cloud/ipfs/QmWmvTJmJU3pozR9ZHFmQC2DNDwi2XJtf3QGyYiiagFSWb",
  "name": "Ramses"
}

Show all
📋 Copy
Feel free to change the data in the json. You can remove or add to the attributes section. Most importantly, make sure image field points to the location of your IPFS image — otherwise, your NFT will include a photo of a (very cute!) dog.

Once you’re done editing the json file, save it and upload it to Pinata, following the same steps we did for uploading the image.

How to upload your nft-metadata.json to Pinata

STEP 5: CREATE AN INSTANCE OF YOUR CONTRACT
Now, to interact with our contract, we need to create an instance of it in our code. To do so we’ll need our contract address which we can get from the deployment or Etherscan by looking up the address you used to deploy the contract.

View your contract address on Etherscan

In the above example, our contract address is 0x81c587EB0fE773404c42c1d2666b5f557C470eED.

Next we will use the web3 contract method to create our contract using the ABI and address. In your mint-nft.js file, add the following:

const contractAddress = "0x81c587EB0fE773404c42c1d2666b5f557C470eED"

const nftContract = new web3.eth.Contract(contract.abi, contractAddress)

📋 Copy
STEP 6: UPDATE THE .ENV FILE
Now, in order to create and send transactions to the Ethereum chain, we’ll use your public ethereum account address to get the account nonce (will explain below).

Add your public key to your .env file — if you completed part 1 of the tutorial, our .env file should now look like this:

API_URL = "https://eth-ropsten.alchemyapi.io/v2/your-api-key"
PRIVATE_KEY = "your-private-account-address"
PUBLIC_KEY = "your-public-account-address"

📋 Copy
STEP 7: CREATE YOUR TRANSACTION
First, let’s define a function named mintNFT(tokenData) and create our transaction by doing the following:

Grab your PRIVATE_KEY and PUBLIC_KEY from the .env file.

Next, we’ll need to figure out the account nonce. The nonce specification is used to keep track of the number of transactions sent from your address — which we need for security purposes and to prevent replay attacks. To get the number of transactions sent from your address, we use getTransactionCount.

Finally we’ll set up our transaction with the following info:

'from': PUBLIC_KEY — The origin of our transaction is our public address

'to': contractAddress — The contract we wish to interact with and send the transaction

'nonce': nonce — The account nonce with the number of transactions send from our address

'gas': estimatedGas — The estimated gas needed to complete the transaction

'data': nftContract.methods.mintNFT(PUBLIC_KEY, md).encodeABI() — The computation we wish to perform in this transaction — which in this case is minting a NFT

Your mint-nft.js file should look like this now:

   require('dotenv').config();
   const API_URL = process.env.API_URL;
   const PUBLIC_KEY = process.env.PUBLIC_KEY;
   const PRIVATE_KEY = process.env.PRIVATE_KEY;

   const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
   const web3 = createAlchemyWeb3(API_URL);

   const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json");
   const contractAddress = "0x81c587EB0fE773404c42c1d2666b5f557C470eED";
   const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

   async function mintNFT(tokenURI) {
     const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); //get latest nonce

   //the transaction
     const tx = {
       'from': PUBLIC_KEY,
       'to': contractAddress,
       'nonce': nonce,
       'gas': 500000,
       'data': nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI()
     };
   }​

Show less
📋 Copy
STEP 8: SIGN THE TRANSACTION
Now that we’ve created our transaction, we need to sign it in order to send it off. Here is where we’ll use our private key.

web3.eth.sendSignedTransaction will give us the transaction hash, which we can use to make sure our transaction was mined and didn't get dropped by the network. You'll notice in the transaction signing section, we've added some error checking so we know if our transaction successfully went through.

require("dotenv").config()
const API_URL = process.env.API_URL
const PUBLIC_KEY = process.env.PUBLIC_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY

const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(API_URL)

const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json")
const contractAddress = "0x81c587EB0fE773404c42c1d2666b5f557C470eED"
const nftContract = new web3.eth.Contract(contract.abi, contractAddress)

async function mintNFT(tokenURI) {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest") //get latest nonce

  //the transaction
  const tx = {
    from: PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: 500000,
    data: nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI(),
  }

  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log(
              "The hash of your transaction is: ",
              hash,
              "\nCheck Alchemy's Mempool to view the status of your transaction!"
            )
          } else {
            console.log(
              "Something went wrong when submitting your transaction:",
              err
            )
          }
        }
      )
    })
    .catch((err) => {
      console.log(" Promise failed:", err)
    })
}

Show less
📋 Copy
STEP 9: CALL MINTNFT AND RUN NODE CONTRACT-INTERACT.JS
Remember the metadata.json you uploaded to Pinata? Get its hashcode from Pinata and pass the following as parameter to the function mintNFT https://gateway.pinata.cloud/ipfs/<metadata-hash-code>

Here’s how to get the hashcode:

How to get your nft metadata hashcode on PinataHow to get your nft metadata hashcode on Pinata

Double check that the hashcode you copied links to your metadata.json by loading https://gateway.pinata.cloud/ipfs/<metadata-hash-code> into a separate window. The page should look similar to the screenshot below:

Your page should display the json metadata
Your page should display the json metadata

Altogether, your code should look something like this:

require("dotenv").config()
const API_URL = process.env.API_URL
const PUBLIC_KEY = process.env.PUBLIC_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY

const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(API_URL)

const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json")
const contractAddress = "0x81c587EB0fE773404c42c1d2666b5f557C470eED"
const nftContract = new web3.eth.Contract(contract.abi, contractAddress)

async function mintNFT(tokenURI) {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest") //get latest nonce

  //the transaction
  const tx = {
    from: PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: 500000,
    data: nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI(),
  }

  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log(
              "The hash of your transaction is: ",
              hash,
              "\nCheck Alchemy's Mempool to view the status of your transaction!"
            )
          } else {
            console.log(
              "Something went wrong when submitting your transaction:",
              err
            )
          }
        }
      )
    })
    .catch((err) => {
      console.log("Promise failed:", err)
    })
}

mintNFT(
  "https://gateway.pinata.cloud/ipfs/QmYueiuRNmL4MiA2GwtVMm6ZagknXnSpQnB3z2gWbz36hP"
)

Show less
📋 Copy
Now, run node scripts/mint-nft.js to deploy your NFT. After a couple of seconds, you should see a response like this in your terminal:

The hash of your transaction is: 0x10e5062309de0cd0be7edc92e8dbab191aa2791111c44274483fa766039e0e00

Check Alchemy's Mempool to view the status of your transaction!

Next, visit your Alchemy mempool to see the status of your transaction (whether it’s pending, mined, or got dropped by the network). If your transaction got dropped, it’s also helpful to check Ropsten Etherscan and search for your transaction hash.

View your NFT transaction hash on Etherscan
View your NFT transaction hash on Etherscan

And that’s it! You’ve now deployed AND minted with a NFT on the Ethereum blockchain 🤑

Using the mint-nft.js you can mint as many NFT's as your heart (and wallet) desires! Just be sure to pass in a new tokenURI describing the NFT's metadata (otherwise, you'll just end up making a bunch of identical ones with different IDs).

Presumably, you’d like to be able to show off your NFT in your wallet — so be sure to check out Part 3: How to View Your NFT in Your Wallet!