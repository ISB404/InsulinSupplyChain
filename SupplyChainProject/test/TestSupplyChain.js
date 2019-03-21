const SupplyChain = artifacts.require('SupplyChain');
//artifacts.require('./contracts/cofeebase/SupplyChain.sol')

let accounts;

contract('SupplyChain', async (accs) => {
  accounts = accs;
  var VialID = 1
  var BatchID = 2
  var PackID = 1
  const ownerID = accounts[0]
  const ProducerID = accounts[1]
  const ProducerName = "Producer xx"
  const productNotes = "insulin"
  const productPrice = web3.toWei(1, "ether")
  const Pharmacy = accounts[2]
  const Consumer = accounts[3]
  const emptyAddress = '0x00000000000000000000000000000000000000'

  var StateProduced = 0;
  var StateTested = 1;
  var StatePacked = 2;
  var StatePackForSale = 3;
  var StatePackSold = 4;
  var StateShipped = 5;
  var StateReceived = 6;
  var StateVialForSale = 7;
  var StateVialSold = 8;
  var StateConsumed = 9;


  console.log("ganache-cli accounts used here...")
  console.log("Contract Owner: accounts[0] ", accounts[0])
  console.log("Producer: accounts[1] ", accounts[1])
  console.log("Pharmacy: accounts[2] ", accounts[2])
  console.log("Consumer: accounts[3] ", accounts[3])

  // Assigning Roles
  it("Assigning Roles", async () => {
    const supplyChain = await SupplyChain.deployed()

    // assigning rules
    await supplyChain.addProducer(ProducerID, {
      from: ownerID
    });
    await supplyChain.addPharmacy(Pharmacy, {
      from: ownerID
    });
    await supplyChain.addConsumer(Consumer, {
      from: ownerID
    });

    // Check if the roles were assigned
    let isProducer = await supplyChain.isProducer(ProducerID);
    let isPharmacy = await supplyChain.isPharmacy(Pharmacy);
    let isConsumer = await supplyChain.isConsumer(Consumer);

    // Verify the result set
    assert.isTrue(isProducer,'E: Producer not Assigned')
    assert.isTrue(isPharmacy, 'E: Pharmacy not Assigned')
    assert.isTrue(isConsumer, 'E: Consumer not Assigned')
  })

  // 1st Test
  it("Testing smart contract function Produce_New_Batch()", async () => {
    const supplyChain = await SupplyChain.deployed()

    // Declare and Initialize a variable for event
    var eventEmitted = false

    // Watch the emitted event Produced()
    var event = supplyChain.Produced()
    await event.watch((err, res) => {
      eventEmitted = true
    })

    // Mark an item as Produced by calling function Produce_New_Batch()
    await supplyChain.Produce_New_Batch(BatchID, ProducerID, ProducerName, productNotes, {
      from: ProducerID
    })

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchBatchBuffer.call(BatchID)
    //const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

    // Verify the result set
    assert.equal(resultBufferOne[0], BatchID, 'Error: Invalid item BatchID')
    assert.equal(resultBufferOne[1], ProducerID, 'Error: Missing or Invalid ProducerID')
    assert.equal(resultBufferOne[2], ProducerName, 'Error: Missing or Invalid ProducerName')
    assert.equal(resultBufferOne[3], productNotes, 'Error: Missing or Invalid productNotes')
    assert.equal(resultBufferOne[4].toNumber(), StateProduced, 'Error: Missing or Invalid itemState')
    assert.equal(eventEmitted, true, 'Invalid event emitted')
  })

  // 2nd Test
  it("Testing smart contract function TestItem()", async () => {
    const supplyChain = await SupplyChain.deployed()

    // Declare and Initialize a variable for event
    var eventEmitted = false

    // Watch the emitted event Tested()
    var event = supplyChain.Tested()
    await event.watch((err, res) => {
      eventEmitted = true
    })

    // Mark an item as Tested by calling function TestItem()
    await supplyChain.TestBatch(BatchID, {
      from: ProducerID
    })

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchBatchBuffer.call(BatchID)

    // Verify the result set
    assert.equal(resultBufferOne[0], BatchID, 'Error: Invalid item BatchID')
    assert.equal(resultBufferOne[4].toNumber(), StateTested, 'Error: Invalid State')


  })

  // 3rd Test
  it("Testing smart contract function Pack_insulin_vials()", async () => {
    const supplyChain = await SupplyChain.deployed()

    // Declare and Initialize a variable for event
    var eventEmitted = false

    // Watch the emitted event Packed()
    var event = supplyChain.Packed()
    await event.watch((err, res) => {
      eventEmitted = true
    })

    // Mark an item as Packed by calling function packItem()
    await supplyChain.Pack_insulin_vials(BatchID, {
      from: ProducerID
    })

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBatchBuffer = await supplyChain.fetchBatchBuffer.call(BatchID)
    const resultPackBuffer = await supplyChain.fetchPackBuffer.call(PackID)

    // Verify the result set

    // Pack
    assert.equal(resultPackBuffer[0], ProducerID, 'Error: Invalid item Owner')
    assert.equal(resultPackBuffer[4].toNumber(), StatePacked, 'Error: Invalid Pack State')

    // vial
    for (i = 0; i < resultPackBuffer[5].length; i++) {
      const resultVialBuffer = await supplyChain.fetchVialBuffer.call(resultPackBuffer[5][i].toNumber())
      assert.equal(resultVialBuffer[0].toNumber(), resultPackBuffer[5][i].toNumber(), 'Error: Invalid item VialID')
      assert.equal(resultVialBuffer[1], BatchID, 'Error: Invalid item BatchID')
      assert.equal(resultVialBuffer[7].toNumber(), StatePacked, 'Error: Missing or Invalid itemState')
    }


    // batch 
    assert.equal(resultBatchBuffer[0], BatchID, 'Error: Invalid item BatchID')
    assert.equal(resultBatchBuffer[4].toNumber(), StatePacked, 'Error: Invalid State')
    assert.equal(resultBatchBuffer[5], PackID, 'Error: Invalid State')

    assert.equal(eventEmitted, true, 'Invalid event emitted')


  })


  // 4th Test
  it("Testing smart contract function Add_Insulin_Pack_For_Sale()", async () => {
    const supplyChain = await SupplyChain.deployed()

    // Declare and Initialize a variable for event
    var eventEmitted = false

    // Watch the emitted event PackForSale()
    var event = supplyChain.PackForSale()
    await event.watch((err, res) => {
      eventEmitted = true
    })

    // Mark an item as Packed by calling function packItem()
    await supplyChain.Add_Insulin_Pack_For_Sale(VialID, productPrice, {
      from: ProducerID
    })

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultPackBuffer = await supplyChain.fetchPackBuffer.call(VialID)

    // Verify the result set
    assert.equal(resultPackBuffer[1].toNumber(), productPrice, 'Error: Invalid item Price')
    assert.equal(resultPackBuffer[4].toNumber(), StatePackForSale, 'Error: Missing or Invalid itemState')

    assert.equal(eventEmitted, true, 'Invalid event emitted')


  })

  // 5th Test
  it("Testing smart contract function Purchase_insulin_Pack()", async () => {
    const supplyChain = await SupplyChain.deployed()

    // Declare and Initialize a variable for event
    var eventEmitted = false

    // Watch the emitted event PackForSale()
    var event = supplyChain.PackSold()
    await event.watch((err, res) => {
      eventEmitted = true
    })

    // Mark an item as Packed by calling function packItem()
    await supplyChain.Purchase_insulin_Pack(PackID, {
      value: productPrice,
      from: Pharmacy
    })

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultPackBuffer = await supplyChain.fetchPackBuffer.call(VialID)

    // Verify the result set
    assert.equal(resultPackBuffer[0], Pharmacy, 'Error: Invalid item Owner')
    assert.equal(resultPackBuffer[1], productPrice, 'Error: Invalid item productPrice')
    assert.equal(resultPackBuffer[2], ProducerID, 'Error: Invalid item ProducerID')
    assert.equal(resultPackBuffer[3], Pharmacy, 'Error: Invalid item PharmacyID')
    assert.equal(resultPackBuffer[4].toNumber(), StatePackSold, 'Error: Invalid Pack State')

  })


  // 6th Test
  it("Testing smart contract function Ship_insulin_Pack()", async () => {
    const supplyChain = await SupplyChain.deployed()

    // Declare and Initialize a variable for event
    var eventEmitted = false

    // Watch the emitted event PackForSale()
    var event = supplyChain.Shipped()
    await event.watch((err, res) => {
      eventEmitted = true
    })

    // Mark an item as Packed by calling function packItem()
    await supplyChain.Ship_insulin_Pack(PackID, {
      from: ProducerID
    })

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultPackBuffer = await supplyChain.fetchPackBuffer.call(VialID)

    // Verify the result set
    assert.equal(resultPackBuffer[0], Pharmacy, 'Error: Invalid item Owner')
    assert.equal(resultPackBuffer[1], productPrice, 'Error: Invalid item productPrice')
    assert.equal(resultPackBuffer[2], ProducerID, 'Error: Invalid item ProducerID')
    assert.equal(resultPackBuffer[3], Pharmacy, 'Error: Invalid item PharmacyID')
    assert.equal(resultPackBuffer[4].toNumber(), StateShipped, 'Error: Invalid Pack State')

  })


  // 7th Test
  it("Testing smart contract function Receive_insulin_Pack()", async () => {
    const supplyChain = await SupplyChain.deployed()

    // Declare and Initialize a variable for event
    var eventEmitted = false

    // Watch the emitted event PackForSale()
    var event = supplyChain.Received()
    await event.watch((err, res) => {
      eventEmitted = true
    })

    // Mark an item as Packed by calling function packItem()
    await supplyChain.Receive_insulin_Pack(PackID, {
      from: Pharmacy
    })

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultPackBuffer = await supplyChain.fetchPackBuffer.call(VialID)

    // Verify the result set
    assert.equal(resultPackBuffer[0], Pharmacy, 'Error: Invalid item Owner')
    assert.equal(resultPackBuffer[1], productPrice, 'Error: Invalid item productPrice')
    assert.equal(resultPackBuffer[2], ProducerID, 'Error: Invalid item ProducerID')
    assert.equal(resultPackBuffer[3], Pharmacy, 'Error: Invalid item PharmacyID')
    assert.equal(resultPackBuffer[4].toNumber(), StateReceived, 'Error: Invalid Pack State')

  })

  // 8th Test
  it("Testing smart contract function Add_Insulin_Vial_For_Sale()", async () => {
    const supplyChain = await SupplyChain.deployed()

    // Declare and Initialize a variable for event
    var eventEmitted = false

    // Watch the emitted event PackForSale()
    var event = supplyChain.VialForSale()
    await event.watch((err, res) => {
      eventEmitted = true
    })

    // Mark an item as Packed by calling function packItem()
    await supplyChain.Add_Insulin_Vial_For_Sale(VialID, productPrice, {
      from: Pharmacy
    })

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultVialBuffer = await supplyChain.fetchVialBuffer.call(VialID)

    // Verify the result set
    assert.equal(resultVialBuffer[0], VialID, 'Error: Invalid item VialID')
    assert.equal(resultVialBuffer[2], Pharmacy, 'Error: Invalid item ownerID')
    assert.equal(resultVialBuffer[6], productPrice, 'Error: Invalid item productPrice')
    assert.equal(resultVialBuffer[7].toNumber(), StateVialForSale, 'Error: Invalid item itemState')



  })

  // 9th Test
  it("Testing smart contract function Purchase_Insulin_Vial()", async () => {
    const supplyChain = await SupplyChain.deployed()

    // Declare and Initialize a variable for event
    var eventEmitted = false

    // Watch the emitted event PackForSale()
    var event = supplyChain.VialSold()
    await event.watch((err, res) => {
      eventEmitted = true
    })

    // Mark an item as Packed by calling function packItem()
    await supplyChain.Purchase_Insulin_Vial(VialID, {
      value: productPrice,
      from: Consumer
    })

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultVialBuffer = await supplyChain.fetchVialBuffer.call(VialID)

    // Verify the result set
    assert.equal(resultVialBuffer[0], VialID, 'Error: Invalid item VialID')
    assert.equal(resultVialBuffer[2], Consumer, 'Error: Invalid item ownerID')
    assert.equal(resultVialBuffer[9], Consumer, 'Error: Invalid item consumerID')
    assert.equal(resultVialBuffer[7].toNumber(), StateVialSold, 'Error: Invalid item itemState')



  })

  // 10th Test
  it("Testing smart contract function Consume_Insulin()", async () => {
    const supplyChain = await SupplyChain.deployed()

    // Declare and Initialize a variable for event
    var eventEmitted = false

    // Watch the emitted event PackForSale()
    var event = supplyChain.Consumed()
    await event.watch((err, res) => {
      eventEmitted = true
    })

    // Mark an item as Packed by calling function packItem()
    await supplyChain.Consume_Insulin(VialID, {
      from: Consumer
    })

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultVialBuffer = await supplyChain.fetchVialBuffer.call(VialID)

    // Verify the result set
    assert.equal(resultVialBuffer[0], VialID, 'Error: Invalid item VialID')
    assert.equal(resultVialBuffer[2], Consumer, 'Error: Invalid item ownerID')
    assert.equal(resultVialBuffer[9], Consumer, 'Error: Invalid item consumerID')
    assert.equal(resultVialBuffer[7].toNumber(), StateConsumed, 'Error: Invalid item itemState')



  })

});


