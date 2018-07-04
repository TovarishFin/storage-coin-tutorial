pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/PausableToken.sol";


contract StorageCoin is PausableToken {
  string public name;
  string public symbol;
  uint8 public constant decimals = 18;

  constructor(
    string _name, 
    string _symbol, 
    uint256 _totalSupply
  )
    public
  {
    name = _name;
    symbol = _symbol;
    totalSupply_ = _totalSupply;
    balances[msg.sender] = totalSupply();
    paused = true;
  }
}

    /*
    slot 0: balance
    slot 1: totalSupply
    slot 2: allowance
    slot 3.1: paused
    slot 3.2: owner
    slot 4: name
    slot 5: symbol
    */