pragma solidity ^ 0.4 .24;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'PharmacyRole' to manage this role - add, remove, check
contract PharmacyRole {
  using Roles
  for Roles.Role;

  // Define 2 events, one for Adding, and other for Removing
  event PharmacyAdded(address indexed account);
  event PharmacyRemoved(address indexed account);

  // Define a struct 'Pharmacies' by inheriting from 'Roles' library, struct Role
  Roles.Role private Pharmacies;

  // In the constructor make the address that deploys this contract the 1st Pharmacy
  constructor() public {
    _addPharmacy(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyPharmacy() {
    require(isPharmacy(msg.sender));
    _;
  }

  // Define a function 'isPharmacy' to check this role
  function isPharmacy(address account) public view returns(bool) {
    return Pharmacies.has(account);
  }

  // Define a function 'addPharmacy' that adds this role
  function addPharmacy(address account) public onlyPharmacy {
    _addPharmacy(account);
  }

  // Define a function 'renouncePharmacy' to renounce this role
  function renouncePharmacy() public {
    _removePharmacy(msg.sender);
  }

  // Define an internal function '_addPharmacy' to add this role, called by 'addPharmacy'
  function _addPharmacy(address account) internal {
    Pharmacies.add(account);
    emit PharmacyAdded(account);
  }

  // Define an internal function '_removePharmacy' to remove this role, called by 'removePharmacy'
  function _removePharmacy(address account) internal {
    Pharmacies.remove(account);
    emit PharmacyRemoved(account);
  }
}