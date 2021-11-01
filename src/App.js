import React from 'react';
// import logo from './logo.svg';
import {abi, networks} from './build/PasswordManager.json';
import './App.css';
import Web3 from 'web3';
import {bufferToHex}  from 'ethereumjs-util';
import {encrypt} from 'eth-sig-util';
import { OnboardingButton } from './MetaMask_OnboardingButton';
import Button from './Button_Styled';
import { getEncryptionPublicKey } from 'eth-sig-util';
 
class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      account: '',
      contractConnected: false,
      passwordManager: '',
      encryptionPublicKey: '',
      pwdListEncrypted: [],
      pwdListDecrypted: [],
      contractOwner: '',
      focusPwdIndex: null,
      focusPwdDomain: '', 
      focusPwdUsername: '', 
      focusPwdPassword: '',
      updateStatus: false,
      loading: false,
      
  };

  this.getPasswordList = this.getPasswordList.bind(this);
  this.decrypt = this.decrypt.bind(this);
    this.prepareToUpdate = this.prepareToUpdate.bind(this);
    this.deletePassword = this.deletePassword.bind(this);
    this.savePassword = this.savePassword.bind(this);
    this.updateParam = this.updateParam.bind(this);
    this.resetFields = this.resetFields.bind(this);
    this.flipLoading = this.flipLoading.bind(this);

  }

  flipLoading() {
    let flipLoading = !this.state.loading;
    this.setState({loading: flipLoading});
  }

  componentWillUnmount(){

    window.ethereum.removeAllListeners('accountsChanged');
    window.ethereum.removeAllListeners('chainChanged');
  }


  async componentDidMount() {
    // Set web3
    let web3;
    if(window.ethereum) {
      web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Non-Ethereum browser detected. You should consider installing MetaMask!')
    }

    // Get user account
    const accounts = await web3.eth.getAccounts();
    this.setState({account: accounts[0]});
    window.ethereum.on('accountsChanged', (accounts) => {
      this.setState({account: accounts[0]});
      // this.render();
    });
    window.ethereum.on('chainChanged', (_chainId) => window.location.reload());

    // Get contract
    const networkID = await web3.eth.net.getId();

    const networkData = networks[networkID];
    if (networkData){
      const contractAddress = networks[networkID].address;
      const passwordManager = new web3.eth.Contract(abi, contractAddress);
      const contractOwner = await passwordManager.methods.owner().call();
      this.setState({passwordManager});
      this.setState({contractOwner});

      // let saveEvent = passwordManager.events.allEvents({filter: {ReturnValues: this.state.account}, fromBlock: 0, toBlock: 'latest'}, (error, event) => { console.log(event); this.render() });





              /* Get encrypted password list from contract */
        try{
                  
         
        await this.getPasswordList();
        console.log("Enc: " + this.state.pwdListEncrypted);
        await this.getDecryptedList();

        console.log(this.state.pwdListDecrypted);
        console.log(this.state.pwdListDecrypted.length);
        console.log(this.state.pwdListDecrypted[0]);

        } catch(error) {
          console.log(error);
        }
    } 
    else {
      window.alert('Password Manager has not been deployed in this network yet. Please select Ropsten or Ganache. Thank you.')
    }
    }

async getDecryptedList() {
  let newList = await this.state.pwdListEncrypted.map(async (pwd) => 
  {
    let decPwd = await this.decrypt(pwd);
    console.log("decPWD: " + decPwd)
    
    console.log("decPWD.domain: " + decPwd.domain)
    this.setState({pwdListDecrypted: [...this.state.pwdListDecrypted, decPwd]});
  });
  console.log(newList);
  console.log(newList.length);
  console.log(newList[0].domain);
    

}
  async getPasswordList() {

          //Because of the design of the contract, you have to specify 'from' address; otherwise will revert because of modifier.
        // let pwdListEncrypted = await this.state.passwordManager.methods.getPasswordList().call({from: this.state.account})
        // let newPwdListDecrypted = await this.state.passwordManager.methods.getPasswordList().call({from: this.state.account})
        //   .then( async (pwdListEncrypted) => {

          // let pwdListEncrypted = await this.state.passwordManager.methods.getPasswordList().call({from: this.state.account})
          // let pwdListDecrypted = await this.state.pwdListEncrypted.map( (pwd) =>  this.decrypt(pwd));

          let pwdListEncrypted = await this.state.passwordManager.methods.getPasswordList().call({from: this.state.account})//.map( (pwd) =>  this.decrypt(pwd));
          

          // this.setState({pwdListEncrypted, loading: false});

          
          await pwdListEncrypted.map(async (pwd) => 
          {
            let decryptedPwd = await this.decrypt(pwd);
            console.log("decryptedPWD: " + decryptedPwd)
            
            console.log("decryptedPWD.domain: " + decryptedPwd.domain)
            this.setState({pwdListDecrypted: [...this.state.pwdListDecrypted, decryptedPwd]});
          });

          //   await pwdListEncrypted.map( (pwd) =>  this.decrypt(pwd))
          // })
          // // .then((newPwdListDecrypted) => 
          // this.setState({pwdListDecrypted: newPwdListDecrypted, loading: false});
          // )
          
          
  }

  async getEncryptionKey() {
          /* Get public encryption Key */
          let encryptionPublicKey;

          await window.ethereum
            .request({
              method: 'eth_getEncryptionPublicKey',
              params: [this.state.account],
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
  }


  async  decrypt(encryptedContent){
    /* Decrypting */
   const decryptedResult = await window.ethereum
    .request({
      method: 'eth_decrypt',
      params: [encryptedContent, this.state.account],
    })
    .then((initialPWD) => JSON.parse(initialPWD))
    
    // .then((decryptedMessage) => {
    //   console.log('The decrypted message is:' + decryptedMessage);
    //   // decryptedResult = decryptedMessage;
    //   // console.log('The decryptedResult is:' + decryptedResult);
      
    // })
    // .catch((error) => console.log(error.message));
    // // console.log(decryptedResult);
    // // return(decryptedResult);
    return decryptedResult;
  }

  encrypt(content){
      /* Encrypting */
  // Currently this encryption method is not working (getting error messages). 
  //TODO: May implement other basic encryption/hash just to test the flow of the app and interactions with different functions in the contract.
  const encryptedMessage = bufferToHex(
    Buffer.from(
      JSON.stringify(
        encrypt(
          this.state.encryptionPublicKey,
          { data: content },
          'x25519-xsalsa20-poly1305'
        )
      ),
      'utf8'
    )
  );

  // let encryptedMessage = "";

  return encryptedMessage;
  }



      

  updateParam(event) {
    
    const name = event.target.name;
    const value = event.target.value;

    this.setState({
      [name]: value});
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
    try{
    const passwordDeleted = await this.state.passwordManager.methods.deletePassword(_index).send({ from: this.state.account});
    console.log(passwordDeleted);
   
                  
         
      await this.getPasswordList();

      let pwdListDecrypted = await this.state.pwdListEncrypted.map( (pwd) =>  this.decrypt(pwd));;
      this.setState({pwdListDecrypted});
          console.log(this.state.pwdListDecrypted);

      } catch(error) {
        console.log(error);
      }

  }


  async savePassword(event) {
    // this.setState({loading: true});
    event.preventDefault();
    console.log(event)

    let _domain = this.state.focusPwdDomain;
    let _username = this.state.focusPwdUsername;
    let _password = this.state.focusPwdPassword

    if (!_domain || !_password) {
      alert('You need to provide at least a domain and a password.');
      return "";
    }

    const _newPassword = {domain: _domain, username: _username, password: _password};

    for (let p of this.state.pwdListDecrypted) {
      if (p.domain === _domain && p.username === _username && p.password === _password) {
        alert('You already have this password saved.');
        return "";
      }
    }

    let newPassword = JSON.stringify(_newPassword);

          // /* Get public encryption Key */
          if (!this.state.encryptionPublicKey) await this.getEncryptionKey();

  let _encryptedPassword = this.encrypt(newPassword);
  console.log(`_encryptedPassword: ${_encryptedPassword}`);
  
  try{

  if (this.state.updateStatus) {
    let _index = this.state.focusPwdIndex;
    await this.state.passwordManager.methods.updatePassword(_index, _encryptedPassword).send({from: this.state.account});

  }else{

    await this.state.passwordManager.methods.saveNewPassword(_encryptedPassword).send({from: this.state.account});
  }
  
         
      await this.getPasswordList();

      let pwdListDecrypted = await this.state.pwdListEncrypted.map( (pwd) =>  this.decrypt(pwd));
      this.setState({pwdListDecrypted});
          console.log(this.state.pwdListDecrypted);

      } catch(error) {
        console.log(error);
      }

  this.resetFields();
  // let saveEvent = this.state.passwordManager.events.PasswordSaved({filter: {from: this.state.account}}, (error, event) => { 
  //   console.log(event); this.render()})

  alert('Done! Password saved.');

  // this.setState({loading: false});
 
  }



  resetFields() {
    this.setState({focusPwdIndex: null});
  this.setState({focusPwdDomain: ''});
  this.setState({focusPwdUsername: ''});
  this.setState({focusPwdPassword: ''});
  this.setState({updateStatus: false});
  // this.setState({loading: false});
  }

render() {
  console.log(this.state.pwdListDecrypted);
  console.log(this.state.pwdListDecrypted.length);
  console.log(this.state.pwdListDecrypted[0]);

  const displayAndUpdateList =     (
    <>
    <PWList id='pwdList'
    pwdListDecrypted = {this.state.pwdListDecrypted}
    prepareToUpdate = {this.prepareToUpdate}
    deletePassword = {this.deletePassword}
    loading = {this.state.loading}
    />

  {this.state.updateStatus ? <h2>Update Password</h2> : <h2>Add new Password</h2>}

    <AddOrUpdatePWD
      flipLoading = {this.flipLoading}
      focusPwdIndex = {this.state.focusPwdIndex}
      focusPwdDomain = {this.state.focusPwdDomain}
      focusPwdUsername = {this.state.focusPwdUsername}
      focusPwdPassword = {this.state.focusPwdPassword}
      updateParam = {this.updateParam}
      savePassword = {this.savePassword} 
      resetFields = {this.resetFields}
      />
      </>
    )
  return (
    <div>
    <AppHeader/>

    {/* Still working on buttons and testing. Work in progress  */}
    <MetaMaskConnectButton account = {this.state.account}/>
    {/* <ContractConnectButton /> */}
    {/* <div className="Connect-Button">
    <OnboardingButton>{this.state.account ? this.state.account : 'No account'}</OnboardingButton>
    </div> */}

     <h2>Password List - Account {this.state.account ? this.state.account : '[No account connected]'}</h2>
      {/* <h3>{this.getOwner()}</h3> */}

    {this.state.loading ?
    "Loading password list.....":  (
      <>
      <PWList id='pwdList'
      pwdListDecrypted = {this.state.pwdListDecrypted}
      prepareToUpdate = {this.prepareToUpdate}
      deletePassword = {this.deletePassword}
      loading = {this.state.loading}
      />
  
    {this.state.updateStatus ? <h2>Update Password</h2> : <h2>Add new Password</h2>}
  
      <AddOrUpdatePWD
        flipLoading = {this.flipLoading}
        focusPwdIndex = {this.state.focusPwdIndex}
        focusPwdDomain = {this.state.focusPwdDomain}
        focusPwdUsername = {this.state.focusPwdUsername}
        focusPwdPassword = {this.state.focusPwdPassword}
        updateParam = {this.updateParam}
        savePassword = {this.savePassword} 
        resetFields = {this.resetFields}
        />
        </>
      )}


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
          Version 0.3.0
        </p>      
      </header>
      
    )
  }
}

/* MetaMask Button Class */
class MetaMaskConnectButton extends React.Component {




 connectMM() {
    


    let accounts = null;
    // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    try {
       accounts = window.ethereum.request({ method: 'eth_accounts' });
       const account = accounts[0];
      console.log(account);
// const listener1 = window.ethereum.on('accountsChanged', (accounts) => {
    window.ethereum.on('accountsChanged', (accounts) => {
    console.log('new account = ' +accounts[0]);
  alert('new account = ' +accounts[0]);
});
// const listener2 = window.ethereum.on('chainChanged', (_chainId) => window.location.reload());
  window.ethereum.on('chainChanged', (_chainId) => window.location.reload());

let connectButton = document.getElementById('connectMMButton')
connectButton.innerHTML = (`Connected to ${account}`)
    } catch (error) {
      console.error(error);
    }



  }


  render(){
    let account = this.props.account;
    
    return(
    <Button id='connectMMButton' onClick = {this.connectMM} disabled = {account}>
     
     {account ? `Connected to ${account}` : 'Connect to Metamask'}
    </Button>
    )
  }
}

/* Password List Class */
class PWList extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     loading: true
  //   }
  // }

  async componentDidMount(){



    // if (numberOfPasswords != this.props.pwdListDecrypted.length) {
    // let pwdListDecrypted = this.props.pwdListEncrypted.map((pwd) => this.props.decrypt(pwd));
    // this.setState({pwdListDecrypted});
    // }

  }

  render(){

    let pwdListDecrypted = this.props.pwdListDecrypted;
    let numberOfPasswords = pwdListDecrypted.length;
    let index = 0;
      for (let p of pwdListDecrypted) {
        p.index = index;
        index++;
      }
     
    const passwords = pwdListDecrypted.map((pwd) =>
    
          < DisplayPW
          
          flipLoading = {this.props.flipLoading}

          key = {pwd.index}

          pwd = {pwd}
               prepareToUpdate = {this.props.prepareToUpdate}
     deletePassword = {this.props.deletePassword}
          />
          ); 

          console.log("List: " + pwdListDecrypted);
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
      let pwd = this.props.pwd;
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
