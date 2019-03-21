pragma solidity ^ 0.4 .24;

import "../core/Ownable.sol";
import "../accesscontrol/AccessControl.sol";


// Define a contract 'Supplychain'
contract SupplyChain is AccessControl, Ownable {

  // Define a variable called 'BatchID' for Insulin Batches (BatchID)
  uint BatchID;

  // Define a variable called 'VialID' for Insulin Vials (VialID)
  uint VialID;

  // Define a variable called 'PackID' for Vials Pack (PackID)
  uint PackID;

  // Define a public mapping items 
  mapping(uint => Batch) batch;
  mapping(uint => Vials) vial;
  mapping(uint => Packs) pack;

  // Define a public mapping 'itemsHistory' that maps the BatchID to an array of TxHash, 
  // that track its journey through the supply chain -- to be sent from DApp.
  //mapping(uint => string[]) itemsHistory;

  // Define enum 'State' with the following values:
  enum State {
    Produced, // 0
    Tested, // 1
    Packed, // 2
    PackForSale, // 3
    PackSold, // 4
    Shipped, // 5
    Received, // 6
    VialForSale, // 7
    VialSold, // 8
    Consumed // 9
  }

  State constant defaultState = State.Produced;

  struct Batch {
    uint BatchID; // Unique Identifier for each insulin Batch
    uint PackID; // Unique Identifier for each insulin Vial Pack
    address originProducerID; // Metamask-Ethereum address of the Producer
    string originProducerName; // Producer Name
    string productNotes; // Product Notes
    State itemState; // Product State as represented in the enum above
  }

  struct Vials {
    uint VialID; // Unique Identifier for each insulin Vial
    uint BatchID; // the Unique Identifier for the insulin Batch used in this vial
    address ownerID; // Metamask-Ethereum address of the current owner
    address originProducerID; // Metamask-Ethereum address of the Producer
    string originProducerName; // Producer Name
    string productNotes; // Product Notes
    uint productPrice; // Product Price
    State itemState; // Product State as represented in the enum above
    address PharmacyID; // Metamask-Ethereum address of the Pharmacy
    address consumerID; // Metamask-Ethereum address of the Consumer
  }

  struct Packs {
    address ownerID; // Metamask-Ethereum address of the current owner
    uint PackID; // Unique Identifier for each insulin Vial Pack
    uint productPrice; // Product Price
    State itemState; // Product State as represented in the enum above
    address ProducerID; // Metamask-Ethereum address of the Producer
    address PharmacyID; // Metamask-Ethereum address of the Pharmacy, who bought the pack
    uint[10] VialArray; // array of vialID in the pack [limited to 10 vials per pack]

  }

  event Produced(uint BatchID);
  event Tested(uint BatchID);
  event Packed(uint PackID);
  event PackForSale(uint PackID);
  event PackSold(uint PackID);
  event Shipped(uint PackID);
  event Received(uint PackID);
  event VialForSale(uint VialID);
  event VialSold(uint VialID);
  event Consumed(uint VialID);

  // Define a modifer that checks to see if msg.sender == owner of the contract
  modifier onlyOwner() {
    require(msg.sender == owner());
    _;
  }

  // Define a modifer that verifies the Caller
  modifier verifyCaller(address _address) {
    require(msg.sender == _address, "Function Caller Does Not Match The Assigned Address");
    _;
  }

  // Define a modifier that checks if the paid amount is sufficient to cover the price
  modifier paidEnough(uint _price) {
    require(msg.value >= _price, "Not Paid Enough");
    _;
  }

  // Define a modifier that checks the price and refunds the remaining balance
  modifier checkValue(uint _price) {
    _;
    uint amountToRefund = msg.value - _price;
    msg.sender.transfer(amountToRefund);
  }

  // Define a modifier that checks if abatch ID is Duplicated 
  modifier UniqueBatchID(uint _BatchID) {
    require(batch[_BatchID].BatchID == 0 && _BatchID != 0, "This Batch ID Is Duplicated");
    _;
  }

  // Define a modifier that checks if an item.state of a BatchID is Produced
  modifier produced(uint _BatchID) {
    require(batch[_BatchID].itemState == State.Produced, "You Are Not Producer");
    _;
  }

  // Define a modifier that checks if an item.state of a BatchID is Produced
  modifier isBatchOwner(uint _BatchID) {
    require(batch[_BatchID].originProducerID == msg.sender, "You Are Not The Batch Owner");
    _;
  }

  // Define a modifier that checks if an item.state of a BatchID is Produced
  modifier isVialOwner(uint _VialID) {
    require(vial[_VialID].ownerID == msg.sender, "You Are Not The Vial Owner");
    _;
  }

  // Define a modifier that checks if an item.state of a BatchID is Tested
  modifier tested(uint _BatchID) {
    require(batch[_BatchID].itemState == State.Tested, "The Batch Has Yet To Be Tested");
    _;
  }

  // Define a modifier that checks if an item.state of a PackID is packed
  modifier packed(uint _PackID) {
    require(pack[_PackID].itemState == State.Packed, "The Batch Has Yet To Be Packed");
    _;
  }

  // Define a modifier that checks if an item.state of a _PackID is PackForSale
  modifier packForSale(uint _PackID) {
    require(pack[_PackID].itemState == State.PackForSale, "The Pack Has Yet To Be Put For Sale");
    _;
  }

  // Define a modifier that checks if an item.state of a _PackID is PackSold
  modifier packSold(uint _PackID) {
    require(pack[_PackID].itemState == State.PackSold, "The Pack Has Yet To Be Spld");
    _;
  }

  // Define a modifier that checks if an item.state of a _PackID is Shipped
  modifier shipped(uint _PackID) {
    require(pack[_PackID].itemState == State.Shipped, "The Pack Has Yet To Be Shipped");
    _;
  }

  // Define a modifier that checks if an item.state of a _VialID is Received
  modifier received(uint _VialID) {
    require(vial[_VialID].itemState == State.Received, "The Pack Has Yet To Be Received");
    _;
  }

  // Define a modifier that checks if an item.state of a _VialID is VialsForSale
  modifier vialForSale(uint _VialID) {
    require(vial[_VialID].itemState == State.VialForSale, "The Vial Has Yet To Be Put For Sale");
    _;
  }

  // Define a modifier that checks if an item.state of a _VialID is VialSold
  modifier vialSold(uint _VialID) {
    require(vial[_VialID].itemState == State.VialSold, "The Vial Has Yet To Be Sold");
    _;
  }

  // Define a modifier that checks if an item.state of a _VialID is Consumed
  modifier consumed(uint _VialID) {
    require(vial[_VialID].itemState == State.Consumed, "The Vial Has Yet To Be Consumed");
    _;
  }

  constructor() public payable {
    VialID = 1;
    BatchID = 1;
    PackID = 1;
  }

  // Define a function 'kill' if required
  function kill() public {
    if (msg.sender == owner()) {
      selfdestruct(msg.sender);
    }
  }

  function Produce_New_Batch(uint _BatchID, address _originProducerID, string _originProducerName, string _productNotes) public
  verifyCaller(_originProducerID)
  UniqueBatchID(_BatchID)
  onlyProducer() {
    // Add the new batch
    Batch memory NewInsulinBatch;
    NewInsulinBatch.itemState = State.Produced;
    NewInsulinBatch.BatchID = _BatchID;
    NewInsulinBatch.originProducerID = _originProducerID;
    NewInsulinBatch.originProducerName = _originProducerName;
    NewInsulinBatch.productNotes = _productNotes;

    batch[_BatchID] = NewInsulinBatch;

    //  Emit the appropriate event
    emit Produced(_BatchID);

  }

  function TestBatch(uint _BatchID) public
  onlyProducer()
  produced(_BatchID)
  isBatchOwner(_BatchID) {
    // Update the appropriate fields
    batch[_BatchID].itemState = State.Tested;

    // Emit the appropriate event
    emit Tested(_BatchID);

  }

  function Pack_insulin_vials(uint _batchID) public
  onlyProducer()
  tested(_batchID)
  isBatchOwner(_batchID) {
    // Update the appropriate fields
    batch[_batchID].itemState = State.Packed;
    batch[_batchID].PackID = PackID;
    Packs memory NewInsulinVialPack;
    NewInsulinVialPack.PackID = PackID;
    NewInsulinVialPack.itemState = State.Packed;
    NewInsulinVialPack.ownerID = batch[_batchID].originProducerID;
    NewInsulinVialPack.ProducerID = batch[_batchID].originProducerID;

    for (uint i = 0; i < NewInsulinVialPack.VialArray.length; i++) {
      Vials memory NewInsulinVial;
      NewInsulinVial.VialID = VialID;
      NewInsulinVial.BatchID = batch[_batchID].BatchID;
      NewInsulinVial.ownerID = batch[_batchID].originProducerID;
      NewInsulinVial.originProducerID = batch[_batchID].originProducerID;
      NewInsulinVial.originProducerName = batch[_batchID].originProducerName;
      NewInsulinVial.productNotes = batch[_batchID].productNotes;
      NewInsulinVial.itemState = State.Packed;
      vial[VialID] = NewInsulinVial;
      NewInsulinVialPack.VialArray[i] = NewInsulinVial.VialID;
      VialID = VialID + 1;

    }

    pack[PackID] = NewInsulinVialPack;
    PackID = PackID + 1;
    // Emit the appropriate event
    emit Packed(PackID);
  }

  function Add_Insulin_Pack_For_Sale(uint _PackID, uint _Price) public
  onlyProducer()
  packed(_PackID)
  isVialOwner(_PackID) {
    pack[_PackID].productPrice = _Price;
    pack[_PackID].itemState = State.PackForSale;

    emit PackForSale(_PackID);
  }


  function Purchase_insulin_Pack(uint _PackID) public payable
  onlyPharmacy()
  packForSale(_PackID)
  paidEnough(pack[_PackID].productPrice)
  checkValue(pack[_PackID].productPrice) {

    pack[_PackID].itemState = State.PackSold;
    pack[_PackID].ownerID = msg.sender;
    pack[_PackID].PharmacyID = msg.sender;

    pack[_PackID].ProducerID.transfer(pack[_PackID].productPrice);

    for (uint i = 0; i < pack[_PackID].VialArray.length; i++) {
      vial[pack[_PackID].VialArray[i]].ownerID = msg.sender;
      vial[pack[_PackID].VialArray[i]].PharmacyID = msg.sender;
    }

    emit PackSold(_PackID);

  }

  function Ship_insulin_Pack(uint _PackID) public
  onlyProducer()
  packSold(_PackID) {

    pack[_PackID].itemState = State.Shipped;

    for (uint i = 0; i < pack[_PackID].VialArray.length; i++) {
      vial[pack[_PackID].VialArray[i]].itemState = State.Shipped;
    }
    emit Shipped(_PackID);
  }

  function Receive_insulin_Pack(uint _PackID) public
  shipped(_PackID) {

    pack[_PackID].itemState = State.Received;

    for (uint i = 0; i < pack[_PackID].VialArray.length; i++) {
      vial[pack[_PackID].VialArray[i]].itemState = State.Received;
    }


    emit Received(_PackID);

  }


  function Add_Insulin_Vial_For_Sale(uint _VialID, uint _Price) public
  onlyPharmacy()
  received(_VialID)
  isVialOwner(_VialID) {

    vial[_VialID].productPrice = _Price;
    vial[_VialID].itemState = State.VialForSale;

    emit VialForSale(_VialID);
  }

  function Purchase_Insulin_Vial(uint _VialID) public payable
  onlyConsumer()
  vialForSale(_VialID)
  paidEnough(vial[_VialID].productPrice)
  checkValue(vial[_VialID].productPrice) {

    vial[_VialID].itemState = State.VialSold;
    vial[_VialID].ownerID = msg.sender;
    vial[_VialID].consumerID = msg.sender;

    vial[_VialID].PharmacyID.transfer(pack[_VialID].productPrice);

    emit VialSold(_VialID);
  }

  function Consume_Insulin(uint _VialID) public
  onlyConsumer()
  isVialOwner(_VialID) {

    vial[_VialID].itemState = State.Consumed;

    emit Consumed(_VialID);
  }


  // Define a function 'fetchItemBufferOne' that fetches the data
  function fetchBatchBuffer(uint _BatchID) public view returns
    (
      uint batchID,
      address originProducerID,
      string originProducerName,
      string productNotes,
      uint itemState,
      uint packID

    ) {
      // Assign values to the 4 parameters
      batchID = batch[_BatchID].BatchID;
      originProducerID = batch[_BatchID].originProducerID;
      originProducerName = batch[_BatchID].originProducerName;
      productNotes = batch[_BatchID].productNotes;
      itemState = uint(batch[_BatchID].itemState);
      packID = batch[_BatchID].PackID;


      /*

          assert.equal(resultBufferOne[0].toNumber(), VialID, 'Error: Invalid item VialID')
          assert.equal(resultBufferOne[1], BatchID, 'Error: Invalid item BatchID')
          assert.equal(resultBufferOne[2], accounts[1], 'Error: Invalid item ItemOwnerID')
          assert.equal(resultBufferOne[3], originProducerID, 'Error: Missing or Invalid originProducerID')
          assert.equal(resultBufferOne[4], originProducerName, 'Error: Missing or Invalid originProducerName')
          assert.equal(resultBufferOne[6], productNotes, 'Error: Missing or Invalid productNotes')
          assert.equal(resultBufferOne[8].toNumber(), 2, 'Error: Missing or Invalid itemState')


      */
      return (
        batchID,
        originProducerID,
        originProducerName,
        productNotes,
        itemState,
        packID

      );
    }

  // Define a function 'fetchPackBuffer' that fetches the data
  function fetchPackBuffer(uint _PackID) public view returns
    (
      address ownerID, //0
      uint productPrice, //1
      address ProducerID, //2
      address PharmacyID, //3
      uint itemState, //4
      uint[10] //5

    ) {
      // Assign values to the 4 parameters
      ownerID = pack[_PackID].ownerID;
      productPrice = pack[_PackID].productPrice;
      PharmacyID = pack[_PackID].PharmacyID;
      ProducerID = pack[_PackID].ProducerID;
      itemState = uint(pack[_PackID].itemState);
      uint[10] memory VialArray;
      VialArray = pack[_PackID].VialArray;

      /*
            assert.equal(resultPackBuffer[0], accounts[1], 'Error: Invalid item Owner')
            assert.equal(resultPackBuffer[1], 10, 'Error: Invalid item productPrice')
            assert.equal(resultPackBuffer[2], accounts[2], 'Error: Invalid item PharmacyID')
            assert.equal(resultPackBuffer[3], accounts[1], 'Error: Invalid item ProducerID')
            assert.equal(resultPackBuffer[4].toNumber(), 1, 'Error: Invalid Pack State')
            
            for (i = 0; i < 6; i++) {
              let index = i + 4;
              const resultVialBuffer = await supplyChain.fetchVialBuffer.call(resultPackBuffer[index].toNumber())
              assert.equal(resultVialBuffer[0].toNumber(), resultPackBuffer[index].toNumber(), 'Error: Invalid item VialID')
              assert.equal(resultVialBuffer[1], BatchID, 'Error: Invalid item BatchID')
              assert.equal(resultVialBuffer[8].toNumber(), 2, 'Error: Missing or Invalid itemState')
            }
      */

      return (
        ownerID,
        productPrice,
        ProducerID,
        PharmacyID,
        itemState,
        VialArray

      );
    }

  // Define a function 'fetchVialBuffer' that fetches the data
  function fetchVialBuffer(uint _vialID) public view returns
    (
      uint vialID,
      uint batchID,
      address ownerID,
      address originProducerID,
      string originProducerName,
      //      uint productID,
      string productNotes,
      uint productPrice,
      uint itemState,
      address PharmacyID,
      address consumerID
    ) {
      //Assign values to the 9 parameters
      vialID = vial[_vialID].VialID;
      batchID = vial[_vialID].BatchID;
      ownerID = vial[_vialID].ownerID;
      originProducerID = vial[_vialID].originProducerID;
      originProducerName = vial[_vialID].originProducerName;
      productNotes = vial[_vialID].productNotes;
      productPrice = vial[_vialID].productPrice;
      //productID = vial[_vialID].productID;
      itemState = uint(vial[_vialID].itemState);
      PharmacyID = vial[_vialID].PharmacyID;
      consumerID = vial[_vialID].consumerID;

      /*   
          assert.equal(resultVialBuffer[0], VialID, 'Error: Invalid item VialID')
          assert.equal(resultVialBuffer[1], batchID, 'Error: Invalid item batchID')
          assert.equal(resultVialBuffer[2], accounts[1], 'Error: Invalid item ownerID')
          assert.equal(resultVialBuffer[3], accounts[1], 'Error: Invalid item originProducerID')
          assert.equal(resultVialBuffer[4], originProducerName, 'Error: Invalid item originProducerName')
          assert.equal(resultVialBuffer[5], productNotes, 'Error: Invalid item productNotes')
          assert.equal(resultVialBuffer[6], productPrice, 'Error: Invalid item productPrice')
          assert.equal(resultVialBuffer[7].toNumber(), itemState, 'Error: Invalid item itemState')
          assert.equal(resultVialBuffer[8], accounts[2], 'Error: Invalid item PharmacyID')
          assert.equal(resultVialBuffer[9], accounts[3], 'Error: Invalid item consumerID')
      */


      return (
        vialID, //0
        batchID, //1
        ownerID, //2
        originProducerID, //3
        originProducerName, //4
        // productID, //5
        productNotes, //5
        productPrice, //6
        itemState, //7
        PharmacyID, //8
        consumerID //9
      );
    }
}