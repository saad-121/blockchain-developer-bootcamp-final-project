import React from 'react';
// import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import {ABI, contractAddress} from './Contract';

// const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
// web3.eth.getAccounts().then(console.log);

 
class App extends React.Component {
  constructor(props) {
    super(props);

    // const passwordManager = new Web3.eth.Contract(ABI, contractAddress);

    this.state = {
      // passwordManager: passwordManager,
    // pwdListRaw: [{index: 0, domain: 1, username: 2, password: 3}, {index: 1, domain: 4, username: 5, password: 6}, {index: 2, domain: 7, username: 8, password: 9}],
        pwdListRaw: [{domain: 1, username: 2, password: 3}, {domain: 4, username: 5, password: 6}, {domain: 7, username: 8, password: 9}],
    focusPwdIndex: null,
    focusPwdDomain: '', 
    focusPwdUsername: '', 
    focusPwdPassword: '',
    updateStatus: false
  };

    // this.getOwner = this.getOwner.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.deletePassword = this.deletePassword.bind(this);
    this.savePassword = this.savePassword.bind(this);
    this.updateParam = this.updateParam.bind(this);
        this.resetFields = this.resetFields.bind(this);
  }

      // getOwner() {
      //   const {owner} = this.state.passwordManager;
      //   owner ((err, owner) => {
      //     if (err) console.error('An error ocurred: ', err);
      //     console.log('This is the owner: ', owner);
      //   })

      // }


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

      updatePassword(_index) {

        console.log(_index);
        const focusPassword = this.state.pwdListRaw[_index];
        this.setState({
          updateStatus: true, 
          focusPwdIndex: _index, 
          focusPwdDomain: focusPassword.domain, 
          focusPwdUsername: focusPassword.username,
          focusPwdPassword: focusPassword.password
          })
      }


      deletePassword(_index) {
        const numberOfPasswords = this.state.pwdListRaw.length;
        const pwdListRawCopy = this.state.pwdListRaw;
        if  (numberOfPasswords > 1) {
          pwdListRawCopy[_index] = pwdListRawCopy[numberOfPasswords-1];
        }
        pwdListRawCopy.pop();
        this.setState({pwdListRaw: pwdListRawCopy})
      }


      savePassword(event) {
      
        event.preventDefault();
        console.log(event)

        if (!this.state.focusPwdDomain || !this.state.focusPwdPassword) {
          this.resetFields();
        return "";
      }
      const newPassword = {domain: this.state.focusPwdDomain, username: this.state.focusPwdUsername, password: this.state.focusPwdPassword};

      let pwdListRawCopy = this.state.pwdListRaw;
      for (let p of pwdListRawCopy) {
        if (p.domain == newPassword.domain && p.username == newPassword.username && p.password == newPassword.password) {
          this.resetFields();
          return "";
        }
      }
      
      if (this.state.updateStatus) {
        let index = this.state.focusPwdIndex;
        pwdListRawCopy[index] = newPassword;
      }else{
        pwdListRawCopy.push(newPassword);
      }
      
      this.setState({pwdListRaw: pwdListRawCopy});
      this.resetFields();
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
     <h2>Password List</h2>
      {/* <h3>{this.getOwner()}</h3> */}

    <PWList
      pwdListRaw = {this.state.pwdListRaw}
      updatePassword = {this.updatePassword}
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

/* Password List Class */
class PWList extends React.Component {

  render(){
    const numberOfPasswords = this.props.pwdListRaw.length;
    const pwdListRaw = this.props.pwdListRaw;
    let index = 0;
      for (let p of pwdListRaw) {
        p.index = index;
        index++;
      }
     
    const passwords = pwdListRaw.map((pwd) =>
          < DisplayPW
          key = {pwd.index}
          pwd = {pwd}
               updatePassword = {this.props.updatePassword}
     deletePassword = {this.props.deletePassword}
          />
          ) 
        return(
          <>
          <h3>{numberOfPasswords > 0 ? "No of passwords: " + numberOfPasswords : "No saved passwords."} </h3>
     
          {numberOfPasswords > 0 && passwords}
          </>
            
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
    this.props.updatePassword(this.props.pwd.index);
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
          
          <input type="submit" value="Update" />
          <button onClick={this.handleDelete}>
          Delete
          </button>
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

          <form onSubmit={this.handleSave}>
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

      <input type="submit" value="Save" />
                <button onClick={this.handleCancel}>
          Cancel
          </button>
      </form>
        )
  }
}

export default App;
