// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;
    uint256 public investment;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    
    event ReturnInvestment(uint256 amount);
    event Investments(uint256);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
        investment = 0; // initInvestment is not defined, so I set it to 0
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;

        // make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // emit the event
        emit Deposit(_amount);
    }

    // custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // withdraw the given amount
        balance -= _withdrawAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));

        // emit the event
        emit Withdraw(_withdrawAmount);
    }

    function getInvestment() public view returns(uint256) {
        return investment;
    }

    error returnError(uint256 balance, uint256 multiplier);
    error noneError(uint256 balance, uint256 currentInvesment);

    function collectInvestment(uint256 _multiplier) public payable {
        require(msg.sender == owner, "You are not the owner of this account.");

        uint _previousBalance = balance;

        if (_multiplier > 5) { // typo: 5 < multiplier should be _multiplier > 5
            revert returnError ({balance : balance, multiplier : _multiplier});
        }

        if (investment == 0) {
            revert noneError ({balance : balance, currentInvesment : investment});
        }

        investment += _multiplier;
        uint investmentsReturn = investment;
        balance += investment;
        investment = 0;

        assert(balance == (_previousBalance + investmentsReturn));

        emit ReturnInvestment(_multiplier);
    }

    error unableInvest(uint256 balance, uint256 investmentAmount);

    function invest(uint256 _investmentAmount) public payable {
        require(msg.sender == owner, "You are not the owner of this account");

        uint _previousBalance = balance;
        uint _previousInvestment = investment;

        if (_investmentAmount > balance) {
            revert unableInvest ({balance : balance, investmentAmount : _investmentAmount});
        }

        balance -= _investmentAmount;
        investment += _investmentAmount;

        assert(balance == (_previousBalance - _investmentAmount));
        assert(investment == (_previousInvestment + _investmentAmount));

        emit Investments(_investmentAmount);
    }
}
