// Import the page's CSS. Webpack will know what to do with it.
//import '../styles/app.css'

// Import libraries we need.
import {
  default as Web3
} from 'web3'
import {
  default as contract
} from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import SupplyChainArtifact from '../../build/contracts/SupplyChain.json'

// SupplyChain is our usable abstraction, which we'll use through the code below.
const SupplyChain = contract(SupplyChainArtifact)

let accounts;
let account;
let Owner;
let Producer;
let Pharmacy;
let Consumer;

// Variables
let VialID = 1;
let BatchID = 1;
let PackID = 1;
let ProducerName = "Producer xx";
let productNotes = "insulin";
let PackPrice = web3.toWei(1, "ether");
let PackPayment = web3.toWei(1, "ether");
let VialPrice = web3.toWei(1, "ether");
let VialPayment = web3.toWei(1, "ether");



function StateToText(State) {
  switch (State * 1) {
    case 0:
      return "Produced";
      break;
    case 1:
      return "Tested";
      break;
    case 2:
      return "Packed";
      break;
    case 3:
      return "PackForSale";
      break;
    case 4:
      return "PackSold";
      break;
    case 5:
      return "Shipped";
      break;
    case 6:
      return "Received";
      break;
    case 7:
      return "VialForSale";
      break;
    case 8:
      return "VialSold";
      break;
    case 9:
      return "Consumed";
      break;
    default:
      return State;
  }
}

function UpdateVariables() {
  BatchID = document.getElementById("BatchID").value;
  PackID = document.getElementById("PackID").value;
  ProducerName = document.getElementById("ProducerName").value;
  productNotes = document.getElementById("productNotes").value;
  PackPrice = document.getElementById("PackPrice").value;
  PackPayment = document.getElementById("PackPayment").value;
  VialID = document.getElementById("VialID").value;
  VialPrice = document.getElementById("VialPrice").value;
  VialPayment = document.getElementById("VialPayment").value;

}

const ProduceBatch = async () => {

  const instance = await SupplyChain.deployed();
  UpdateVariables();

  await instance.Produce_New_Batch(BatchID, Owner, ProducerName, productNotes, {
    from: Owner
  }).then(function () {
    App.setStatus("New Insulin Batch <br/> ID:  " + BatchID +
      "<br/> From: " + ProducerName +
      "<br/> Note: " + productNotes);
  }).catch(function (err) {
    console.log(err.message);
    App.setStatus(err.message.split("revert")[1]);
  });

}

const TestBatch = async () => {

  const instance = await SupplyChain.deployed();
  UpdateVariables();

  await instance.TestBatch(BatchID, {
    from: Owner
  }).then(function () {
    App.setStatus("[BatchID " + BatchID + "] has been tested ");
  }).catch(function (err) {
    console.log(err.message);
    App.setStatus(err.message.split("revert")[1]);
  });

}

const PackBatch = async () => {

  const instance = await SupplyChain.deployed();
  UpdateVariables();

  await instance.Pack_insulin_vials(BatchID, {
    from: Owner
  }).then(function () {
    App.setStatus("[BatchID " + BatchID + "] has been Packed ");
  }).catch(function (err) {
    console.log(err.message);
    App.setStatus(err.message.split("revert")[1]);
  });
}

const AddPackForSale = async () => {

  const instance = await SupplyChain.deployed();
  UpdateVariables();

  await instance.Add_Insulin_Pack_For_Sale(PackID, PackPrice, {
    from: Owner
  }).then(function () {
    App.setStatus("[PackID " + PackID + "] Is now for sale for PackPrice ");
  }).catch(function (err) {
    console.log(err.message);
    App.setStatus(err.message.split("revert")[1]);
  });
}

const PurchaseInsulinPack = async () => {

  const instance = await SupplyChain.deployed();
  UpdateVariables();

  await instance.Purchase_insulin_Pack(PackID, {
    value: PackPayment,
    from: Owner
  }).then(function () {
    App.setStatus("[PackID " + PackID + "] has been Purchased ");
  }).catch(function (err) {
    console.log(err.message);
    App.setStatus(err.message.split("revert")[1]);
  });
}

const ShipInsulinPack = async () => {

  const instance = await SupplyChain.deployed();
  UpdateVariables();

  await instance.Ship_insulin_Pack(PackID, {
    from: Owner
  }).then(function () {
    App.setStatus("[PackID " + PackID + "] has been Shipped ");
  }).catch(function (err) {
    console.log(err.message);
    App.setStatus(err.message.split("revert")[1]);
  });
}

const ReceiveInsulinPack = async () => {

  const instance = await SupplyChain.deployed();
  UpdateVariables();

  await instance.Receive_insulin_Pack(PackID, {
    from: Owner
  }).then(function () {
    App.setStatus("[PackID " + PackID + "] has been Received ");
  }).catch(function (err) {
    console.log(err.message);
    App.setStatus(err.message.split("revert")[1]);
  });
}

const AddVialForSale = async () => {

  const instance = await SupplyChain.deployed();
  UpdateVariables();

  await instance.Add_Insulin_Vial_For_Sale(VialID, VialPrice, {
    from: Owner
  }).then(function () {
    App.setStatus("[VialID " + VialID + "] is now for sale for " + VialPrice);
  }).catch(function (err) {
    console.log(err.message);
    App.setStatus(err.message.split("revert")[1]);
  });
}

const PurchaseInsulinVial = async () => {

  const instance = await SupplyChain.deployed();
  UpdateVariables();

  await instance.Purchase_Insulin_Vial(VialID, {
    value: VialPayment,
    from: Owner
  }).then(function () {
    App.setStatus("[VialID " + VialID + "] has been Purchased");
  }).catch(function (err) {
    console.log(err.message);
    App.setStatus(err.message.split("revert")[1]);
  });
}

const ConsumeInsulin = async () => {

  const instance = await SupplyChain.deployed();
  UpdateVariables();

  await instance.Consume_Insulin(VialID, {
    from: Owner
  }).then(function () {
    App.setStatus("[VialID " + VialID + "] has been Consumed");
  }).catch(function (err) {
    console.log(err.message);
    App.setStatus(err.message.split("revert")[1]);
  });
}

// functions for lookUp
const lookUpBatch = async () => {
  const instance = await SupplyChain.deployed();
  BatchID = document.getElementById("ProductID").value;
  let BatchInfo = await instance.fetchBatchBuffer(BatchID, {
    from: account
  });
  App.setStatus2("batchID: " + BatchInfo.batchID +
    "<br/> originProducerID: " + BatchInfo.originProducerID +
    "<br/> originProducer Name: " + BatchInfo.originProducerName +
    "<br/> product Notes: " + BatchInfo.productNotes +
    "<br/> PackID: " + BatchInfo.packID +
    "<br/> State: " + StateToText(BatchInfo.itemState));
}

const lookUpPack = async () => {
  const instance = await SupplyChain.deployed();
  PackID = document.getElementById("ProductID").value;
  let PackInfo = await instance.fetchPackBuffer(PackID, {
    from: account
  });
  //console.log(PackInfo);
  App.setStatus2("ownerID: " + PackInfo.ownerID +
    "<br/> productPrice: " + PackInfo.productPrice +
    "<br/> ProducerID: " + PackInfo.ProducerID +
    "<br/> PharmacyID: " + PackInfo.PharmacyID +
    "<br/> Vials List: " + PackInfo[5] +
    "<br/> State: " + StateToText(PackInfo.itemState));
}

const lookUpVial = async () => {
  const instance = await SupplyChain.deployed();
  VialID = document.getElementById("ProductID").value;
  let VialInfo = await instance.fetchVialBuffer(VialID, {
    from: account
  });
  //console.log(PackInfo);
  App.setStatus2("vialID: " + VialInfo.vialID +
    "<br/> batchID: " + VialInfo.batchID +
    "<br/> ownerID: " + VialInfo.ownerID +
    "<br/> originProducerID: " + VialInfo.originProducerID +
    "<br/> originProducer Name: " + VialInfo.originProducerName +
    "<br/> product Notes: " + VialInfo.productNotes +
    "<br/> product Price: " + VialInfo.productPrice +
    "<br/> PharmacyID: " + VialInfo.PharmacyID +
    "<br/> consumerID: " + VialInfo.consumerID +
    "<br/> State: " + StateToText(VialInfo.itemState));
}

//

const App = {
  start: function () {
    const self = this

    // Bootstrap the MetaCoin abstraction for Use.
    SupplyChain.setProvider(web3.currentProvider)

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      accounts = accs
      Owner = accounts[0]
      ProducerID = accounts[1]
      Pharmacy = accounts[2]
      Consumer = accounts[3]

    })
  },

  setStatus: function (message) {
    const status = document.getElementById('status')
    status.innerHTML = message
  },

  setStatus2: function (message) {
    const status = document.getElementById('status2')
    status.innerHTML = message
  },

  ProduceBatch: function () {
    ProduceBatch();
  },

  TestBatch: function () {
    TestBatch();
  },

  PackBatch: function () {
    PackBatch();
  },

  AddPackForSale: function () {
    AddPackForSale();
  },

  PurchaseInsulinPack: function () {
    PurchaseInsulinPack();
  },

  ShipInsulinPack: function () {
    ShipInsulinPack();
  },

  ReceiveInsulinPack: function () {
    ReceiveInsulinPack();
  },

  AddVialForSale: function () {
    AddVialForSale();
  },

  PurchaseInsulinVial: function () {
    PurchaseInsulinVial();
  },

  ConsumeInsulin: function () {
    ConsumeInsulin();
  },

  lookUpBatch: function () {
    lookUpBatch();
  },

  lookUpPack: function () {
    lookUpPack();
  },

  lookUpVial: function () {
    lookUpVial();
  },

}

window.App = App

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      ' If you find that your accounts don\'t appear or you have 0 MetaCoin,' +
      ' ensure you\'ve configured that source properly.' +
      ' If using MetaMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:7545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'))
  }

  App.start()
})