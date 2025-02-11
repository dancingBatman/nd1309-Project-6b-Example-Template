// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact
var SupplyChain = artifacts.require('SupplyChain')

contract('SupplyChain', function (accounts) {
    // Declare few constants and assign a few sample accounts generated by ganache-cli
    var sku = 1
    var upc = 1
    const ownerID = accounts[0]
    const originFarmerID = accounts[1]
    const originFarmName = "John Doe"
    const originFarmInformation = "Yarray Valley"
    const originFarmLatitude = "-38.239770"
    const originFarmLongitude = "144.341490"
    var productID = sku + upc
    const productNotes = "Best beans for Espresso"
    const productPrice = web3.toWei(1, "ether")
    var itemState = 0
    const distributorID = accounts[2]
    const retailerID = accounts[3]
    const consumerID = accounts[4]
    const emptyAddress = '0x00000000000000000000000000000000000000'
    const gasPrice = 20000000000 //wei

    ///Available Accounts
    ///==================
    ///(0) 0x27d8d15cbc94527cadf5ec14b69519ae23288b95
    ///(1) 0x018c2dabef4904ecbd7118350a0c54dbeae3549a
    ///(2) 0xce5144391b4ab80668965f2cc4f2cc102380ef0a
    ///(3) 0x460c31107dd048e34971e57da2f99f659add4f02
    ///(4) 0xd37b7b8c62be2fdde8daa9816483aebdbd356088
    ///(5) 0x27f184bdc0e7a931b507ddd689d76dba10514bcb
    ///(6) 0xfe0df793060c49edca5ac9c104dd8e3375349978
    ///(7) 0xbd58a85c96cc6727859d853086fe8560bc137632
    ///(8) 0xe07b5ee5f738b2f87f88b99aac9c64ff1e0c7917
    ///(9) 0xbd3ff2e3aded055244d66544c9c059fa0851da44

    console.log("ganache-cli accounts used here...")
    console.log("Contract Owner: accounts[0] ", accounts[0])
    console.log("Farmer: accounts[1] ", accounts[1])
    console.log("Distributor: accounts[2] ", accounts[2])
    console.log("Retailer: accounts[3] ", accounts[3])
    console.log("Consumer: accounts[4] ", accounts[4])

    // 0 test add roles
    it("Testing smart contract ability to assign roles", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        supplyChain.addFarmer(accounts[1]);
        supplyChain.addDistributor(accounts[2]);
        supplyChain.addRetailer(accounts[3]);
        supplyChain.addConsumer(accounts[4]);

        // Retrieve role for each account
        const isFarmer = await supplyChain.isFarmer(accounts[1]);
        const isRetailer = await supplyChain.isDistributor(accounts[2]);
        const isDistributor = await supplyChain.isRetailer(accounts[3]);
        const isConsumer = await supplyChain.isConsumer(accounts[4]);

        // Verify the result set
        assert.equal(isFarmer, true, 'Error: Account one is not a farmer.')
        assert.equal(isRetailer, true, 'Error: Account two is not a retailer.')
        assert.equal(isDistributor, true, 'Error: Account three is not a distributor.')
        assert.equal(isConsumer, true, 'Error: Account four is not a consumer.')
    })

    // 1st Test
    it("Testing smart contract function harvestItem() that allows a farmer to harvest coffee", async () => {
        const supplyChain = await SupplyChain.deployed({ from: ownerID })
        const expectedState = 0;

        // Declare and Initialize a variable for event
        var eventEmitted = false
        // Mark an item as Harvested by calling function harvestItem()
        const tx = await supplyChain.harvestItem(upc, originFarmerID, originFarmName, originFarmInformation, originFarmLatitude, originFarmLongitude, productNotes, { from: originFarmerID })
        const { logs } = tx;

        if (logs[0].event == "Harvested") {
            eventEmitted = true
        }

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], originFarmerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[5], expectedState, 'Error: Invalid item State')
        assert.equal(eventEmitted, true, 'Invalid event emitted')
    })

    // 2nd Test
    it("Testing smart contract function processItem() that allows a farmer to process coffee", async () => {
        const supplyChain = await SupplyChain.deployed({ from: ownerID })
        const expectedState = 1;
        // Declare and Initialize a variable for event
        var eventEmitted = false;

        // Mark an item as Processed by calling function processtItem()

        const tx = await supplyChain.processItem(upc, {from: originFarmerID})

        // Watch the emitted event Processed()
        const { logs } = tx;
        if (logs[0].event == "Processed") {
            eventEmitted = true
        }

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[2], originFarmerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferTwo[5], expectedState, 'Error: Invalid item State')
        assert.equal(eventEmitted, true, 'Invalid event emitted')

    })

    // 3rd Test
    it("Testing smart contract function packItem() that allows a farmer to pack coffee", async () => {
        const supplyChain = await SupplyChain.deployed()
        const expectedState = 2;
        // Declare and Initialize a variable for event
        var eventEmitted = false;

        // Mark an item as Processed by calling function processtItem()

        const tx = await supplyChain.packItem(upc, {from: originFarmerID})

        // Watch the emitted event Packed()
        const { logs } = tx;
        if (logs[0].event == "Packed") {
            eventEmitted = true
        }

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[2], originFarmerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferTwo[5], expectedState, 'Error: Invalid item State')
        assert.equal(eventEmitted, true, 'Invalid event emitted')

    })

    // 4th Test
    it("Testing smart contract function sellItem() that allows a farmer to sell coffee", async () => {
        const supplyChain = await SupplyChain.deployed()
        const expectedState = 3;
        // Declare and Initialize a variable for event
        var eventEmitted = false;

        // Mark an item as Processed by calling function processtItem()

        const tx = await supplyChain.sellItem(upc, productPrice, {from: originFarmerID})

        // Watch the emitted event ForSale()
        const { logs } = tx;
        if (logs[0].event == "ForSale") {
            eventEmitted = true
        }

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[2], originFarmerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Invalid item Price')
        assert.equal(resultBufferTwo[5], expectedState, 'Error: Invalid item State')
        assert.equal(eventEmitted, true, 'Invalid event emitted')

    })

    // 5th Test
    it("Testing smart contract function buyItem() that allows a distributor to buy coffee", async () => {
        const supplyChain = await SupplyChain.deployed()
        const expectedState = 4;
        // Declare and Initialize a variable for event
        var eventEmitted = false;

        let distributorStartBalance = await web3.eth.getBalance(distributorID)
        let farmerStartBalance = await web3.eth.getBalance(originFarmerID)

        const tx = await supplyChain.buyItem(upc, {from: distributorID, value: productPrice})
        const gasUsed = tx.receipt.cumulativeGasUsed

        // Watch the emitted event Sold()
        const { logs } = tx;
        if (logs[0].event == "Sold") {
            eventEmitted = true
        }

        let distributorEndBalance = await web3.eth.getBalance(distributorID)
        let farmerEndBalance = await web3.eth.getBalance(originFarmerID)

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        let transactionCost = distributorStartBalance - distributorEndBalance.toNumber() - productPrice

        // Verify the result set
        assert.equal(resultBufferOne[2], distributorID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferTwo[5], expectedState, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[6], distributorID, 'Error: Missing or Invalid distributorID')
        // assert.equal(distributorEndBalance.toNumber(), distributorStartBalance - productPrice - gasUsed * gasPrice, 'Error: wrong distributor account balance')
        // assert.equal(farmerEndBalance, farmerStartBalance + productPrice, 'Error: wrong farmer account balance')
        assert.equal(eventEmitted, true, 'Invalid event emitted')

    })

    // 6th Test
    it("Testing smart contract function shipItem() that allows a distributor to ship coffee", async () => {
        const supplyChain = await SupplyChain.deployed()
        const expectedState = 5;
        // Declare and Initialize a variable for event
        var eventEmitted = false;


        const tx = await supplyChain.shipItem(upc, {from: distributorID})

        // Watch the emitted event Sold()
        const { logs } = tx;
        if (logs[0].event == "Shipped") {
            eventEmitted = true
        }

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[2], distributorID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferTwo[5], expectedState, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[6], distributorID, 'Error: Missing or Invalid distributorID')
        assert.equal(eventEmitted, true, 'Invalid event emitted')
    })

    // 7th Test
    it("Testing smart contract function receiveItem() that allows a retailer to mark coffee received", async () => {
        const supplyChain = await SupplyChain.deployed()
        const expectedState = 6;
        // Declare and Initialize a variable for event
        var eventEmitted = false;

        const tx = await supplyChain.receiveItem(upc, {from: retailerID})

        // Watch the emitted event Received()
        const { logs } = tx;
        if (logs[0].event == "Received") {
            eventEmitted = true
        }

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[2], retailerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferTwo[5], expectedState, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[7], retailerID, 'Error: Missing or Invalid retailerID')
        assert.equal(eventEmitted, true, 'Invalid event emitted')

    })

    // 8th Test
    it("Testing smart contract function purchaseItem() that allows a consumer to purchase coffee", async () => {
        const supplyChain = await SupplyChain.deployed()
        const expectedState = 7;

        // Declare and Initialize a variable for event
        var eventEmitted = false;

        // Watch the emitted event Purchased()
        const tx = await supplyChain.purchaseItem(upc, {from: consumerID, value: productPrice})

        // Mark an item as Sold by calling function purchaseItem()
        const { logs } = tx;
        if (logs[0].event == "Purchased") {
            eventEmitted = true
        }

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[2], consumerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferTwo[5], expectedState, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[8], consumerID, 'Error: Missing or Invalid consumerID')
        assert.equal(eventEmitted, true, 'Invalid event emitted')


    })

    // 9th Test
    it("Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain", async () => {
        const supplyChain = await SupplyChain.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], consumerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
    })

    // 10th Test
    it("Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain", async () => {
        const supplyChain = await SupplyChain.deployed()
        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)
        expectedState = 7
        // Verify the result set
        assert.equal(resultBufferTwo[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferTwo[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferTwo[2], productID, 'Error: Invalid productID')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Invalid product notes')
        assert.equal(resultBufferTwo[4], productPrice, `Error: Invalid item price`)
        assert.equal(resultBufferTwo[5], expectedState, `Error: Invalid item State`)
        assert.equal(resultBufferTwo[6], distributorID, `Error: Invalid distributorID`)
        assert.equal(resultBufferTwo[7], retailerID, `Error: Invalid retailerID`)
        assert.equal(resultBufferTwo[8], consumerID, `Error: Invalid consumerID`)
    })

});

