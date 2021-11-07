import React from 'react';
// import logo from './logo.svg';
import {abi, networks} from './build/PasswordManager.json';
import './App.css';
import Web3 from 'web3';
import {bufferToHex}  from 'ethereumjs-util';
import {encrypt} from 'eth-sig-util';
import { OnboardingButton } from './MetaMask_OnboardingButton';
import Button from './Button_Styled';
 
class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      account: '',
      contractConnected: false,
      passwordManager: '',
      encryptionPublicKey: '',
      pwdListEncrypted: [],
      pwdListTemporary: [],
      pwdListDecrypted: [],
      contractOwner: '',
      focusPwdIndex: null,
      focusPwdDomain: '', 
      focusPwdUsername: '', 
      focusPwdPassword: '',
      updateStatus: false,
      loading: false,
      isBusy: false,
 
  };

  this.getPasswordList = this.getPasswordList.bind(this);
  this.decrypt = this.decrypt.bind(this);
    this.prepareToUpdate = this.prepareToUpdate.bind(this);
    this.deletePassword = this.deletePassword.bind(this);
    this.savePassword = this.savePassword.bind(this);
    this.updateParam = this.updateParam.bind(this);
    this.resetFields = this.resetFields.bind(this);
    this.flipLoading = this.flipLoading.bind(this);

    this.setBusy = this.setBusy.bind(this);
  }

  setBusy() {
    this.setState({isBusy: true})
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
      window.alert('Non-Ethereum browser detected. You should consider installing MetaMask!');
      return
    }

    // Get user account
    const accounts = await web3.eth.getAccounts();
    this.setState({account: accounts[0]});
    window.ethereum.on('accountsChanged', (accounts) => {
      window.location.reload();
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

      this.state.passwordManager.events.allEvents({filter: {$0: this.state.account}})
      .on('data', async (event) => {
        let announce;
        switch(event.event) {
          case "PasswordSaved":
            announce = 'Congratulations! Your password was saved on the blockchain.'
            break;
          case 'PasswordUpdated':
            announce = 'Congratulations! Your password was updated on the blockchain.'
            break;
          case 'PasswordDeleted':
          announce = 'Your password has been deleted.'
          break;
          default:
            announce = `${event.event} was emitted by \n${event.returnValues[0]}`
        }
          alert(announce); 
          this.flipLoading();
          await this.getPasswordList();
          this.setState({isBusy: false});
          this.flipLoading();
      })
      .on('error', ( (error) => {
        console.error(error);
        this.setState({isBusy: false});
        }))

              /* Get encrypted password list from contract */
        try{   
        await this.getPasswordList();
        } catch(error) {
          console.log(error);
                  this.setState({isBusy: false});
        }
    } 
    else {
      window.alert('Password Manager has not been deployed in this network yet. Please select Ropsten or Ganache. Thank you.')
    }
    }

  async getPasswordList() {
   this.setState({pwdListEncrypted: []});

    try {
          //Because of the design of the contract, you have to specify 'from' address; otherwise will revert because of modifier.
          let pwdListEncrypted = await this.state.passwordManager.methods.getPasswordList().call({from: this.state.account});
          this.setState({pwdListEncrypted});
          // let pwdListDecrypted =  pwdListEncrypted;
          console.log(`pwdListEncrypted: ${pwdListEncrypted}`);
          // console.log(`pwdListDecrypted: ${pwdListDecrypted}`);
         

          // this.setState({pwdListDecrypted});
  
  

} catch (error) {
  console.log(error);

  this.setState({isBusy: false});
}
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
                alert("We can't encrypt anything without the key.");
                window.location.reload();
              } else {
                console.error(error);
              }
            });
  }


    decrypt(encryptedContent){
    /* Decrypting */
   const decryptedResult =  window.ethereum
    .request({
      method: 'eth_decrypt',
      params: [encryptedContent, this.state.account],
    })
    .then((initialPWD) => JSON.parse(initialPWD))

    return decryptedResult;
  }

  encrypt(content){
      /* Encrypting */
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

  // prepareToUpdate(_index) {

  //   console.log(_index);
  //   const focusPassword = this.state.pwdListDecrypted[_index];
  //   this.setState({
  //     updateStatus: true, 
  //     focusPwdIndex: _index, 
  //     focusPwdDomain: focusPassword.domain, 
  //     focusPwdUsername: focusPassword.username,
  //     focusPwdPassword: focusPassword.password

  //     })
  // }

  prepareToUpdate(_pwd) {

    console.log(_pwd.index);
    const focusPwdPassword = _pwd.password;
    this.setState({
      updateStatus: true, 
      focusPwdIndex: _pwd.index, 
      focusPwdDomain: _pwd.domain, 
      focusPwdUsername: _pwd.username,
      focusPwdPassword

      })
  }


  async savePassword(event) {
    event.preventDefault();
    console.log(event)

    let _domain = this.state.focusPwdDomain;
    let _username = this.state.focusPwdUsername;
    let _password = this.state.focusPwdPassword

    if (!_domain || !_password) {
      alert('You need to provide at least a domain and a password.');
      this.setState({isBusy: false});
      return "";
    }

    const _newPartToBeEncrypted = {username: _username, password: _password};

    // for (let p of this.state.pwdListDecrypted) {
    //   if (p.domain === _domain && p.username === _username && p.password === _password) {
    //     alert('You already have this password saved.');
    //     this.setState({isBusy: false});
    //     return "";
    //   }
    // }

    let newPartToBeEncrypted = JSON.stringify(_newPartToBeEncrypted);

          // /* Get public encryption Key */
          if (!this.state.encryptionPublicKey) {

                  try{
await this.getEncryptionKey();      
} catch(error) {
        console.log(error);
        alert('The encryption key is needed to save passwords.');
        this.setState({isBusy: false});
      }
          }

  let _newEncryptedPart = this.encrypt(newPartToBeEncrypted);
  console.log(`_newEncryptedPart: ${_newEncryptedPart}`);

    for (let p of this.state.pwdListEncrypted) {

      if (p.unencryptedPart === _domain && p.encryptedPart === _newEncryptedPart) {
        alert('You already have this password saved.');
        this.setState({isBusy: false});
        return "";
      }
    }

this.setState({isBusy: true});

  if (this.state.updateStatus) {
    let _index = this.state.focusPwdIndex;
    
        try{
    const passwordUpdated = await this.state.passwordManager.methods.updatePassword(_index, _domain, _newEncryptedPart).send({from: this.state.account});
    console.log(passwordUpdated);
      } catch(error) {
        console.log(error);
        this.setState({isBusy: false});
      }

  }else{
    try{
      const passwordSaved = await this.state.passwordManager.methods.saveNewPassword(_domain, _newEncryptedPart).send({from: this.state.account});
          console.log(passwordSaved);

      } catch(error) {
        console.log(error);
        this.setState({isBusy: false});
      }
  }

  this.resetFields();

  }

  resetFields() {
    this.setState({focusPwdIndex: null});
  this.setState({focusPwdDomain: ''});
  this.setState({focusPwdUsername: ''});
  this.setState({focusPwdPassword: ''});
  this.setState({updateStatus: false});
  }

  async deletePassword(_index) {
        try{
    const passwordDeleted = await this.state.passwordManager.methods.deletePassword(_index).send({ from: this.state.account});
        console.log(passwordDeleted);

      } catch(error) {
        console.log(error);
        this.setState({isBusy: false});
      }

  }


render() {
  console.log(this.state.pwdListDecrypted);
  console.log(this.state.pwdListDecrypted.length);
  console.log(this.state.pwdListDecrypted[0]);

  return (
    <div>
    <AppHeader/>
    <OnboardingButton
    />

     <h2>Password List - Account {this.state.account ? this.state.account.slice(0, 4)+'...'+this.state.account.slice(-4)/*this.state.account*/ : '[No account connected]'}</h2>

    {this.state.account? this.state.loading ?
    "Loading password list.....":  (
      <>
      <PWList id='pwdList'
      decrypt = {this.decrypt}
                setBusy = {this.setBusy}
                isBusy = {this.state.isBusy}
      // pwdListDecrypted = {this.state.pwdListDecrypted}
      pwdListEncrypted = {this.state.pwdListEncrypted}

      prepareToUpdate = {this.prepareToUpdate}
      deletePassword = {this.deletePassword}
      // showPassword = {this.showPassword}
      loading = {this.state.loading}
      />
  
    {this.state.updateStatus ? <h2>Update Password</h2> : <h2>Add new Password</h2>}
  
      <AddOrUpdatePWD
                setBusy = {this.setBusy}
                isBusy = {this.state.isBusy}
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
      ):""}


     </div>

  );
      }
  
}

/* App Header Class */
class AppHeader extends React.Component {


  render(){
    return(
      

    <header className="App-header">
        <h1>
          Password Manager
        </h1> 
        <p> 
          Version 1.0.0
        </p>      
      </header>
      
    )
  }
}


/* Password List Class */
class PWList extends React.Component {
  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     pwdListDecrypted: []
  //   }
  // }
  render(){

    let _pwdListEncrypted = [];
    let numberOfPasswords = this.props.pwdListEncrypted.length;
    let i = 0;
      for (let p of this.props.pwdListEncrypted) {
        // Object.assign({index: i}, p)
        // console.log(`pwdListDecrypted ${i}: ${pwdListDecrypted[i]}`);
        // let [a,] = 
        // console.log(`pwdListDecrypted ${i}.$0: ${pwdListDecrypted($0)}`);
        console.log(`p: ${p}`);
        let [a,b] = p;
        
        let newP = {domain: a, _encryptedPart: b, index: i, decrypted: false, hidden: true};
        _pwdListEncrypted.push(newP);
        i++;
      }
             console.log(`_pwdListEncrypted: ${_pwdListEncrypted}`);

    const passwords = _pwdListEncrypted.map((pwd) =>
    
          < DisplayPW
          decrypt = {this.props.decrypt}
          setBusy = {this.props.setBusy}
          isBusy = {this.props.isBusy}

          flipLoading = {this.props.flipLoading}

          key = {pwd.index}

          pwd = {pwd}
          showPassword = {this.props.showPassword}
               prepareToUpdate = {this.props.prepareToUpdate}
     deletePassword = {this.props.deletePassword}
          />
          ); 

          return(
          <div>
          <h3>{numberOfPasswords > 0 ? "No of passwords: " + numberOfPasswords : "No saved passwords."} </h3>
     
          {numberOfPasswords > 0 && passwords}
          
          </div>
            
        )
  }
}

/*Display Password Class */
//TODO:
class DisplayPW extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pwd: ''
    }
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleShowPassword = this.handleShowPassword.bind(this);
  }



    async handleUpdate(e) {
      e.preventDefault();
      
      let pwd = this.state.pwd ? this.state.pwd : this.props.pwd;
      
      if (pwd.decrypted){

    this.props.prepareToUpdate(pwd);
  } else {
        await this.decryptAndShow(pwd)
    // do{}while(!pwd.decrypted);
    // this.props.prepareToUpdate(this.state.pwd);
      }
  }

    handleDelete(e) {
      e.preventDefault();
 
      this.props.setBusy();
      this.props.deletePassword(this.props.pwd.index);
  }

  async decryptAndShow(_pwd){

    const decrypt = this.props.decrypt;
    console.log(_pwd);
    let _domain = _pwd.domain;
    let _encryptedPart = _pwd._encryptedPart;
    let decryptedPassword = await decrypt(_encryptedPart);     
    let _username = decryptedPassword.username;
    let _password = decryptedPassword.password;
    let pwd = {domain: _domain, username: _username, password: _password, index: _pwd.index, hidden: false, decrypted: true}; 
    this.setState({pwd});

    // let usernameField = document.getElementById('usernameField');
    // let passwordField = document.getElementById('passwordField');
    // usernameField.value = this.state.pwd.username;
    // passwordField.value = this.state.pwd.password;
  }

  handleShowPassword(e) {
          e.preventDefault();

          let pwd = this.state.pwd? this.state.pwd : this.props.pwd;
          if(!pwd.decrypted){
            this.decryptAndShow(pwd);
          }
          let newP = {...pwd, hidden: !pwd.hidden}
          this.setState({pwd: newP});
  }

  render(){
      let pwd = this.state.pwd? this.state.pwd : this.props.pwd;

        return(
          <form onSubmit={this.handleUpdate}>
          <label>
            Domain:
            </label>
            <input type="text" name="domain" value={pwd.domain} readOnly/>

            <label>
            Username:
            </label>
             <input id='usernameField' type="text" name="username" value={pwd.hidden? "********************" : pwd.username} readOnly/>
            <label>
            Password:
            </label>
             <input id='passwordField' type="text" name="password" value={pwd.hidden? "********************" : pwd.password} readOnly/>

          
           <Button id='updateButton' type="submit" disabled = {this.props.isBusy}>
            {pwd.decrypted?'Update':'Decrypt'}
            </Button>
          <Button id='deleteButton' onClick={this.handleDelete} disabled = {this.props.isBusy}>
          Delete
          </Button>
                
                <Button id='showButton' onClick={this.handleShowPassword} disabled = {this.props.isBusy}>
          {pwd.hidden? "Show Password" : "Hide Password"}
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

      this.props.setBusy();
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

      <Button id='saveButton' onClick={this.handleSave} disabled = {this.props.isBusy}>
          Save
          </Button>

                <Button id='cancelButton' onClick={this.handleCancel} disabled = {this.props.isBusy}>
          Cancel
          </Button>
          
      </form>
        )
  }
}



export default App;