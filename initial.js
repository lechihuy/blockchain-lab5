const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
const ABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "num1",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "num2",
				"type": "uint256"
			}
		],
		"name": "arithmetics",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "sum",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "product",
				"type": "uint256"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "num1",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "num2",
				"type": "uint256"
			}
		],
		"name": "multiply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	}
];
const bytecode = "0x608060405234801561001057600080fd5b506102bb806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063165c4a161461003b5780638c12d8f01461006b575b600080fd5b610055600480360381019061005091906100ed565b61009c565b604051610062919061013c565b60405180910390f35b610085600480360381019061008091906100ed565b6100b2565b604051610093929190610157565b60405180910390f35b600081836100aa91906101d6565b905092915050565b60008082846100c19190610180565b915082846100cf91906101d6565b90509250929050565b6000813590506100e78161026e565b92915050565b6000806040838503121561010457610103610269565b5b6000610112858286016100d8565b9250506020610123858286016100d8565b9150509250929050565b61013681610230565b82525050565b6000602082019050610151600083018461012d565b92915050565b600060408201905061016c600083018561012d565b610179602083018461012d565b9392505050565b600061018b82610230565b915061019683610230565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156101cb576101ca61023a565b5b828201905092915050565b60006101e182610230565b91506101ec83610230565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff04831182151516156102255761022461023a565b5b828202905092915050565b6000819050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600080fd5b61027781610230565b811461028257600080fd5b5056fea26469706673582212209ec32dd9a4d9b91432ceb891b5b5cb7355a07e9dde4f0949ec77ce83e8ef1b5e64736f6c63430008070033";

console.log("Byte code:", bytecode);
console.log("ABI:", ABI);

let data1 = '';

const http = require('http');
const express = require('express');
const { urlencoded } = require('express');
const app = express();
const hostname = '127.0.0.1';
const port = 3000;

app.listen(port, () => {
    console.log("Application started and listening on port 3000");
})

app.use(express.static(__dirname));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + 'index.html');
})

app.post('/', (req, res) => {
    const { num1, num2 } = req.body;
    const contract = new web3.eth.Contract(ABI);
    web3.eth.getAccounts().then((accounts) => {
        console.log("Accounts: ", accounts);

        mainAccount = accounts[0];
        contract
            .deploy({ data: bytecode })
            .send({ from: mainAccount, gas: 4700000 })
            .on('receipt', (receipt) => {
                console.log('Contract address: ', receipt.contractAddress);
            })
            .then(async (initialContract) => {
                await initialContract.methods.arithmetics(num1, num2).call((err, data) => {
                    data1 = data;
                    console.log('Result: ', data);
                });
                res.send(data1);
            });
    });
})