# Supply chain project

This repo contains code associated with Supply chain Udacity project

## UML diagramms

All the UML diagramms are in project-6/uml/ folder.

## versions used

Truffle v4.1.14 (core: 4.1.14)

Solidity v0.4.24 (solc-js)

web3: 1.2.1

## Libraries

Following libraries were used

* `truffle` - truffle the most popular development framework for Ethereum, which simplifies testing and deployment

* `web3` - library to communicate with ethereum blockchain

* `"truffle-hdwallet-provider": "truffle-hdwallet-provider@1.0.17"` - to be ably to deploy smart contract on testnet

### Running the project locally

1. Navigate into the project-6 folder in terminal
1. Install dependencies using `npm install`
1. Start the Ganache CLI, the newtork will be listening on `http://localhost:8545/`
1. Compile the contracts `truffle compile`
1. Deploy the contracts `truffle migrate`
1. Open front end application using `npm run dev`, site will be opened at `http://localhost:3000/`
1. Profit

# Rinkeby testnet deployment
tx - 0x277d23c2220117c6e59d3b05c1987bc179a64217f9226541063bab34b4b3a24a

contract address - 0x1b4B44a8d17A7B51B88c015Aa140296a90c3c1ae

link: https://rinkeby.etherscan.io/address/0x1b4b44a8d17a7b51b88c015aa140296a90c3c1ae

harvest - 0x1ab2ef242a971f940642c89a95a16a7bfca7d98784cbfee051d8bd1244cfb221

process - 0x126ca30d71061f7c31c48f280ab4a3102b692bfd5d2193be44adcc9595c664f4

Pack - 0x815963c2577da43987319c73f96280e51a9a22729ca2f709dcfb52f26c725ab8

ForSale - 0x795bd0163f4094ac62bf3106b50989f725f6ae4339827d80ad7df00dff7c3c9e

Sold - 0xf156b1a9eb8b48dce576c3b88df83c2760354dba92b20455a77cba8552d5b787

Shipped - 0x1efdf2c4bdcc6efb64788c5426e7642e716247fafe17cc4c2346738dd3674a46

Received - 0x67cb687a983472ea36530f8126022285409a7e11037e795f5cee86548ed9b819

Purchased - 0xf23c1fe0d1fe6afabc29cd39816abe9f10b91d6cd68f06ded5b0a6e222a949c5

### Using Truffle to test/migrate

You'll need to create a `.secret` file with your rinkeby account private key stored in it

## Testing

Testing works fine and well for all except for account balances checks. Found that there was a bug in gas estimate for ganache version
so I just left it be.
