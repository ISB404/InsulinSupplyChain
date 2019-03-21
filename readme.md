# About This Project 
This Project Is a Simplifayed SupplyChain For Insulin Production tell Consumtion. the prokect have three actors at it's current stage Producer, Pharmacy and Consumer. 
In this project the insulin can be represented as:
-	insulin Batch: a newly created batch of insulin that have yet to be packed
-	insulin Pack: a pack of insulin vials (10 vials) that can be sold as a to pharmacy
-	insulin Vial: a vial of insulin that can be sold to consumer and consumed

an insulin batch Lifecycle:
Produced => Tested => Packed.

an insulin vial Lifecycle:
Packed => PackForSale => PackSold => Shipped => Received.

an insulin vial Lifecycle:
Packed => Shipped => Received => VialForSale => VialSold => Consumed.


# UML 
- You can find the UML diagrams in UML folder 

# Libraries
This Project Uses The Role Library And The starter code skeleton Provided from the project page

# IPFS
- IPFS was not used in this project

# Version
- Solidity v0.4.24
- Truffle v4.1.15
- Ganache v1.2.3
- node v8.12.0 
- web3 v1.0.0-beta.37

# To Run
- you will need to have ganache and truffle installed

to compile and test use the following command
```
truffle compile
truffle test
``
to run the front-end part run the following command
``
truffle migrate --reset
truffle develop
```
and then open a new tap in the terminal and go to the following path

	InsulinSupplyChain\SupplyChainProject\app\src
	
then run the following command
```
npm run dev
```

# Deploy smart contract on a public test network (Rinkeby)
Transaction ID: 0xb9f9d321648d4145e5f9b909fe6780f2d89ec260f5183f4c5fb38677f19ac576
Contract address:
-  AccessControl: 0x7503fe5a1da2ca1b891bc1965ac35c6c1dd6161b
-  ProducerRole: 0x860a1c2e4c99e5612da87b9bee493eebfe514951
-  PharmacyRole: 0x77ab7268c837c5c66f124bf691f0862a5e9a877c
-  ConsumerRole: 0x253398018e172be0c14d96c28964197370427fef
-  SupplyChain: 0x723d41e24be4550ea900f36eb79814f619367c51
 


