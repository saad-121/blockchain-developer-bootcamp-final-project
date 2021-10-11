import React from 'react';
// import logo from './logo.svg';
import {abi, networks} from './build/PasswordManager.json';
import './App.css';
import Web3 from 'web3';
// import EthCrypto from 'eth-crypto';
import {ethUtil, sigUtil}  from 'ethereumjs-util';
import {encrypt} from 'eth-sig-util';
import { OnboardingButton } from './MetaMask_OnboardingButton';
import Button from './Button_Styled';

 
class App extends React.Component {

  async componentWillMount() {
    await this.loadWeb3();
    if (window.web3){
    await this.loadContractData();
    // await this.getOwner();
    }
  }

  async loadWeb3() {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Non-Ethereum browser detected. You should consider installing MetaMask!')
    }
  }

  async loadContractData() {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    this.setState({account: accounts[0]});

    window.ethereum.on('accountsChanged', (accounts) => {
      // console.log('new account = ' +accounts[0]);
      // alert('new account = ' +accounts[0]);
      this.setState({account: accounts[0]});
    });
    window.ethereum.on('chainChanged', (_chainId) => window.location.reload());

    const networkID = await web3.eth.net.getId();
    const networkData = networks[networkID];
    if (networkData){
      const contractAddress = networks[networkID].address;
      const passwordManager = new web3.eth.Contract(abi, contractAddress);
      const contractOwner = await passwordManager.methods.owner().call();
      this.setState({passwordManager});
      this.setState({contractOwner});
      console.log(`Contract address: ${contractAddress} and Password Manager contract is: ${passwordManager} and owner is: ${contractOwner}.`)
      console.log(passwordManager);

      /* Get public encryption Key */
      let encryptionPublicKey;

      window.ethereum
        .request({
          method: 'eth_getEncryptionPublicKey',
          params: [accounts[0]],
        })
        .then((result) => {
          encryptionPublicKey = result;
          console.log(encryptionPublicKey);
          this.setState({encryptionPublicKey})
        })
        .catch((error) => {
          if (error.code === 4001) {
            // EIP-1193 userRejectedRequest error
            console.log("We can't encrypt anything without the key.");
          } else {
            console.error(error);
          }
        });

        /* Get encrypted password list from contract */
        const pwdListEncrypted = await passwordManager.methods.getPasswordList().call()
        this.setState({pwdListEncrypted});

        if (pwdListEncrypted) {
          let pwdListDecrypted = [];
          let _domain;
          let _username;
          let _password;
          for (let pwd of pwdListEncrypted){
          _domain = this.decrypt(pwd.domain);
          _username = this.decrypt(pwd.username);
          _password = this.decrypt(pwd.password);
          let decryptedPassword = {domain: _domain, username: _username, password: _password};
          pwdListDecrypted.push(decryptedPassword);
          }
          this.setState({pwdListDecrypted})
        }

    } else {
      window.alert('Password Manager has not been deployed in this network yet. Please select Ropsten or Ganache. Thank you.')
    }
  }

  decrypt(encryptedContent){
    /* Decrypting */
    let decryptedResult = "";
    window.ethereum
    .request({
      method: 'eth_decrypt',
      params: [encryptedContent, this.state.account],
    })
    .then((decryptedMessage) =>
      // console.log('The decrypted message is:', decryptedMessage);
      decryptedResult = decryptedMessage
    )
    .catch((error) => console.log(error.message));

    return(decryptedResult);
  }

  async encrypt(content){
      /* Encrypting */
  // Currently this encryption method is not working (getting error messages). 
  //TODO: May implement other basic encryption/hash just to test the flow of the app and interactions with different functions in the contract.
  // const encryptedMessage = ethUtil.bufferToHex(
  //   Buffer.from(
  //     JSON.stringify(
  //       encrypt(
  //         this.state.encryptionPublicKey,
  //         { data: 'Hello world!' },
  //         'x25519-xsalsa20-poly1305'
  //       )
  //     ),
  //     'utf8'
  //   )
  // );

  let encryptedMessage = "";

  return encryptedMessage;
  }


  constructor(props) {
    super(props);

    this.state = {
      account: '',
      contractConnected: false,
      passwordManager: '',
      encryptionPublicKey: '',
      // pwdListDecrypted: [{domain: 1, username: 2, password: 3}, {domain: 4, username: 5, password: 6}, {domain: 7, username: 8, password: 9}],
      pwdListEncrypted: [],
      pwdListDecrypted: [],
      contractOwner: '',
      focusPwdIndex: null,
      focusPwdDomain: '', 
      focusPwdUsername: '', 
      focusPwdPassword: '',
      updateStatus: false
  };

    this.prepareToUpdate = this.prepareToUpdate.bind(this);
    this.deletePassword = this.deletePassword.bind(this);
    this.savePassword = this.savePassword.bind(this);
    this.updateParam = this.updateParam.bind(this);
        this.resetFields = this.resetFields.bind(this);
        this.decrypt = this.decrypt.bind(this);

        window.web3 = new Web3(window.ethereum);

  }
      

  updateParam(event) {
    
    const name = event.target.name;
    const value = event.target.value;

    this.setState({
      [name]: value})
      console.log(event);
    console.log(event.target.value);
    console.log(this.state.focusPwdDomain);
    console.log(this.state.focusPwdUsername);
    console.log(this.state.focusPwdPassword);
  }

  prepareToUpdate(_index) {

    console.log(_index);
    const focusPassword = this.state.pwdListDecrypted[_index];
    this.setState({
      updateStatus: true, 
      focusPwdIndex: _index, 
      focusPwdDomain: focusPassword.domain, 
      focusPwdUsername: focusPassword.username,
      focusPwdPassword: focusPassword.password
      })
  }


  async deletePassword(_index) {
    // const numberOfPasswords = this.state.pwdListDecrypted.length;
    // const pwdListDecryptedCopy = this.state.pwdListDecrypted;
    // if  (numberOfPasswords > 1) {
    //   pwdListDecryptedCopy[_index] = pwdListDecryptedCopy[numberOfPasswords-1];
    // }
    // pwdListDecryptedCopy.pop();
    // this.setState({pwdListDecrypted: pwdListDecryptedCopy})
    const passwordDeleted = await this.state.passwordManager.methods.deletePassword(_index).send({ from: this.state.account});
    console.log(passwordDeleted);
  }


  async savePassword(event) {
  
    event.preventDefault();
    console.log(event)

    let _domain = this.state.focusPwdDomain;
    let _username = this.state.focusPwdUsername;
    let _password = this.state.focusPwdPassword

    if (!_domain || !_password) {
      alert('You need to provide at least a domain and a password.');
      // this.resetFields();
      
    return "";
  }
  const newPassword = {domain: _domain, username: _username, password: _password};

  let pwdListDecryptedCopy = this.state.pwdListDecrypted;
  for (let p of pwdListDecryptedCopy) {
    if (p.domain == _domain && p.username == _username && p.password == _password) {
      alert('You already have this password saved.');
      // this.resetFields();
      
      return "";
    }
  }
      
  _domain = this.encrypt(_domain);
  _username = this.encrypt(_username);
  _password = this.encrypt(_password);

  // if (this.state.updateStatus) {
  //   let _index = this.state.focusPwdIndex;
  //   // pwdListDecryptedCopy[index] = newPassword;
  //   await this.state.passwordManager.methods.updatePassword(_index, _domain, _username, _password).send({from: this.state.account});
  // }else{
  //   // pwdListDecryptedCopy.push(newPassword);
  //   await this.state.passwordManager.methods.saveNewPassword(_domain, _username, _password).send({from: this.state.account});
  // }
  
  // this.setState({pwdListDecrypted: pwdListDecryptedCopy});
  this.resetFields();
  // alert('Done! Password saved.');

  }



  resetFields() {
    this.setState({focusPwdIndex: null});
  this.setState({focusPwdDomain: ''});
  this.setState({focusPwdUsername: ''});
  this.setState({focusPwdPassword: ''});
  this.setState({updateStatus: false});
  }

render() {

  return (
    <div>
    <AppHeader/>
    <MetaMaskConnectButton>{this.state.account ? this.state.account : 'No account'}</MetaMaskConnectButton> 
    {/* <ContractConnectButton /> */}
    <div className="Connect-Button">
    <OnboardingButton>{this.state.account ? this.state.account : 'No account'}</OnboardingButton>
    </div>
     <h2>Password List - Account {this.state.account ? this.state.account : '[No account connected]'}</h2>
      {/* <h3>{this.getOwner()}</h3> */}

    <PWList
      pwdListDecrypted = {this.state.pwdListDecrypted}
      prepareToUpdate = {this.prepareToUpdate}
      deletePassword = {this.deletePassword}
       />

{this.state.updateStatus ? <h2>Update Password</h2> : <h2>Add new Password</h2>}

      <AddOrUpdatePWD

        focusPwdIndex = {this.state.focusPwdIndex}
        focusPwdDomain = {this.state.focusPwdDomain}
        focusPwdUsername = {this.state.focusPwdUsername}
        focusPwdPassword = {this.state.focusPwdPassword}
        updateParam = {this.updateParam}
        savePassword = {this.savePassword} 
        resetFields = {this.resetFields}
        />


     </div>

  );
      }
  
}

/* App Header Class */
class AppHeader extends React.Component {


  render(){
    return(
      

    <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <h1>
          Password Manager
        </h1> 
        <p> 
          Version 1.0
        </p>      
      </header>
      
    )
  }
}

/* MetaMask Button Class */
class MetaMaskConnectButton extends React.Component {

  async connectMM() {
    let accounts = null;
    // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    try {
       accounts = await window.ethereum.request({ method: 'eth_accounts' });
    } catch (error) {
      console.error(error);
    }

const account = accounts[0];
console.log(account);
const listener1 = window.ethereum.on('accountsChanged', (accounts) => {
  console.log('new account = ' +accounts[0]);
  alert('new account = ' +accounts[0]);
});
const listener2 = window.ethereum.on('chainChanged', (_chainId) => window.location.reload());

  }

  /* Get public encryption Key */
  // let encryptionPublicKey;

  // ethereum
  //   .request({
  //     method: 'eth_getEncryptionPublicKey',
  //     params: [accounts[0]], // you must have access to the specified account
  //   })
  //   .then((result) => {
  //     encryptionPublicKey = result;
  //   })
  //   .catch((error) => {
  //     if (error.code === 4001) {
  //       // EIP-1193 userRejectedRequest error
  //       console.log("We can't encrypt anything without the key.");
  //     } else {
  //       console.error(error);
  //     }
  //   });

  /* Encrypting */
  // const ethUtil = require('ethereumjs-util');

  // const encryptedMessage = ethUtil.bufferToHex(
  //   Buffer.from(
  //     JSON.stringify(
  //       sigUtil.encrypt(
  //         encryptionPublicKey,
  //         { data: 'Hello world!' },
  //         'x25519-xsalsa20-poly1305'
  //       )
  //     ),
  //     'utf8'
  //   )
  // );

  /* Decrypting */
  // ethereum
  // .request({
  //   method: 'eth_decrypt',
  //   params: [encryptedMessage, accounts[0]],
  // })
  // .then((decryptedMessage) =>
  //   console.log('The decrypted message is:', decryptedMessage)
  // )
  // .catch((error) => console.log(error.message));

  render(){
    return(
    <Button onClick = {this.connectMM}>
      Connect to MetaMask   
    </Button>
    )
  }
}

/* Password List Class */
class PWList extends React.Component {

  render(){
    const numberOfPasswords = this.props.pwdListDecrypted.length;
    const pwdListDecrypted = this.props.pwdListDecrypted;
    let index = 0;
      for (let p of pwdListDecrypted) {
        p.index = index;
        index++;
      }
     
    const passwords = pwdListDecrypted.map((pwd) =>
          < DisplayPW
          key = {pwd.index}
          pwd = {pwd}
               prepareToUpdate = {this.props.prepareToUpdate}
     deletePassword = {this.props.deletePassword}
          />
          ) 
        return(
          <div>
          <h3>{numberOfPasswords > 0 ? "No of passwords: " + numberOfPasswords : "No saved passwords."} </h3>
     
          {numberOfPasswords > 0 && passwords}
          
          </div>
            
        )
  }
}

/*Display Password Class */
class DisplayPW extends React.Component {
  constructor(props) {
    super(props);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

    handleUpdate(e) {
      e.preventDefault();
    this.props.prepareToUpdate(this.props.pwd.index);
  }

    handleDelete(e) {
      e.preventDefault();
    this.props.deletePassword(this.props.pwd.index);
  }
  render(){
      const pwd = this.props.pwd;
        return(
          <form onSubmit={this.handleUpdate}>
          <label>
            Domain:
            </label>
            <input type="text" name="domain" value={pwd.domain} readOnly/>
            <label>
            Username:
            </label>
             <input type="text" name="username" value={pwd.username} readOnly/>
            <label>
            Password:
            </label>
             <input type="text" name="password" value={pwd.password} readOnly/>
          
          {/* <input type="submit" value="Update" /> */}
          <Button type="submit">
            Update
            </Button>
          <Button onClick={this.handleDelete}>
          Delete
          </Button>
        </form>
        )
  }
}

/*Save New Password Class */
class AddOrUpdatePWD extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

    handleChange(e) {
    this.props.updateParam(e);
  }

    handleSave(e) {
    this.props.savePassword(e);
  }

      handleCancel(e) {
    this.props.resetFields();
  }


  render(){
        return(

          // <form onSubmit={this.handleSave}>
          <form >

      <label>
        Domain *:
        <input type="text" name="focusPwdDomain" placeholder="Enter Domain" value={this.props.focusPwdDomain} onChange={this.handleChange}/>
        </label>

        <label>
        Username:
         <input type="text" name="focusPwdUsername" placeholder="Enter Username" value={this.props.focusPwdUsername} onChange={this.handleChange}/>
         </label>

         <label>
        Password *:
         <input type="text" name="focusPwdPassword" placeholder="Enter Password" value={this.props.focusPwdPassword} onChange={this.handleChange}/>
         </label>

      {/* <input type="submit" value="Save" /> */}
      <Button onClick={this.handleSave} >
          Save
          </Button>

                <Button onClick={this.handleCancel}>
          Cancel
          </Button>
      </form>
        )
  }
}



export default App;
