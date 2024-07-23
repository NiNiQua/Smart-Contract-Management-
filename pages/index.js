import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [investment, setInvest] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }

    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      const balance = await atm.getBalance();
      setBalance(balance.toString());
    }
  };

  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait()
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait()
      getBalance();
    }
  };

  const getInvestment = async () => {
    if (atm) {
      setInvest((await atm.getInvestment()).toNumber());
    }
  };

  const depositFive = async () => {
    if (atm) {
      let tx = await atm.deposit(5);
      await tx.wait();
      getBalance();
    }
  };

  const depositTen = async () => {
    if (atm) {
      let tx = await atm.deposit(10);
      await tx.wait();
      getBalance();
    }
  };

  const withdrawFive = async () => {
    if (atm) {
      let tx = await atm.withdraw(5);
      await tx.wait();
      getBalance();
    }
  };

  const withdrawTen = async () => {
    if (atm) {
      let tx = await atm.withdraw(10);
      await tx.wait();
      getBalance();
    }
  };

  const invest = async () => {
    if (atm) {
      let tx = await atm.invest(3);
      await tx.wait();
      getBalance();
      getInvestment();
    }
  };

  const collectInvestment = async () => {
    if (atm) {
      let tx = await atm.collectInvestment(4);
      await tx.wait();
      getBalance();
      getInvestment();
    }
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (balance == undefined) {
      getBalance();
    }

    if (investment == undefined) {
      getInvestment();
    }

    return (
      <div>
        <p className="info"><b>Your Account:</b> {account}</p>
        <p className="info"><b>Your Balance:</b> {balance} ETH</p>
        <p className="info"><b>Your Invested Amount:</b> {investment} ETH</p>
        <br></br>
        <button className="btn" onClick={deposit}>Deposit 1 ETH</button>  
        <button className="btn" onClick={withdraw}>Withdraw 1 ETH</button>
        <br></br>
        <button className="btn" onClick={depositFive}>Deposit 5 ETH</button> 
        <button className="btn" onClick={withdrawFive}>Withdraw 5 ETH</button>
        <br></br>
        <button className="btn" onClick={depositTen}>Deposit 10 ETH</button>
        <button className="btn" onClick={withdrawTen}>Withdraw 10 ETH</button>
        <br></br>
        <br></br>
        <br></br>
        <button className="btn" onClick={collectInvestment}>Collect Investment</button>
        <button className="btn" onClick={invest}>Invest 3 ETH</button>
      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      <header><h1>Welcome to the Metacrafters ATM!</h1></header>
      {initUser()}
      <style jsx global>{`
        .container {
          text-align: center;
          max-width: 400px;
          margin: 40px auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          font-family: Arial, sans-serif;
          background-color: #99e69; 
        }

        header {
          color: black;
          padding: 10px;
          text-align: center;
          font-size: 24px;
          font-weight: bold;
        }

        .info {
          font-size: 18px;
          margin-bottom: 10px;
        }
        
        button, .btn {
          background-color: #4CAF50;
          color: #fff; 
          padding: 15px 30px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin: 10px;
        }

        .btn {
          width: 45%;
        }

        button:hover {
          background-color: #3e8e41;
        }

        .btn:hover {
          background-color: #3e8e41;
        }


      `}
      </style>
    </main>
  )
}
