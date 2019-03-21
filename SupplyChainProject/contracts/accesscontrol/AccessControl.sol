pragma solidity ^ 0.4 .24;

// Import the library 'Roles'
import "./ConsumerRole.sol";
import "./PharmacyRole.sol";
import "./ProducerRole.sol";

// Define a contract 'ConsumerRole' to manage this role - add, remove, check
contract AccessControl is ConsumerRole, PharmacyRole, ProducerRole {

  constructor() public {

  }

}