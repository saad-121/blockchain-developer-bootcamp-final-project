const PasswordManager = artifacts.require("PasswordManager");


contract('PasswordManager', ([ownerAccount, client1, client2]) => {
    let passwordManager;
    const domain1 = "0x646f6d61696e3100000000000000000000000000000000000000000000000000";
    const username1 = "0x757365726e616d65310000000000000000000000000000000000000000000000";
    const password1 = "0x70617373776f7264310000000000000000000000000000000000000000000000";
    const domain2 = "0x646f6d61696e3200000000000000000000000000000000000000000000000000";
    const username2 = "0x757365726e616d65320000000000000000000000000000000000000000000000";
    const password2 = "0x70617373776f7264320000000000000000000000000000000000000000000000";
    

    beforeEach(async () => {
        passwordManager = await PasswordManager.new()
        
    })

    describe('Variables', async () => {
        it("should have an owner", async () => {
            assert.equal(typeof passwordManager.owner, 'function', "the contract has no owner.");
          });
        it('owner is deployer of contract (account[0])', async () => {
            const owner = await passwordManager.owner()
            assert.equal(owner, ownerAccount, 'The deployer is not the owner.')
        } );

        it("should have an balance", async () => {
            assert.equal(typeof passwordManager.balance, 'function', "the contract has no balance.");
          });

    // describe('Password struct', async () => {
    //     let subjectStruct;

    //   before(() => {
    //     subjectStruct = ItemStruct(passwordManager);
    //     assert(
    //       subjectStruct !== null, 
    //       "The contract should define a `Password Struct`"
    //     );
    //   });

    //     it("should have an Password struct", async () => {
    //         assert.equal(typeof passwordManager.Password, 'struct', "the contract has no Password struct.");
    //       });
    // })
        
        
    })

    describe('Passwords mapping', async () => {
        // it('should have a mapping for passwords)', async () => {
        //     const passwords = await passwordManager.passwords[]()
        //     assert(passwords, 'The deployer does not have a mapping for passwords.')
        // } )
    })



    

    describe('saveNewPassword function', async () => {
        // const passwordList =  await passwordManager.getPasswordList({ from: client1 });
        // console.log(passwordList)
        it("should allow users to store new passwords to password list", async () => {
            
            const result = await passwordManager.saveNewPassword(domain1, username1, password1, {from: client1
     });
            const result2 = await passwordManager.saveNewPassword(domain2, username2, password2, {from: client1
     });
            const passwordList =  await passwordManager.getPasswordList({ from: client1
     });
            // const testPAssword = await passwordManager.Password({
            //     domain: domain1,
            //     username: username1,
            //     password: password1
            //   }),
            
            assert(result,
            "Users cannot save passwords.",
            );

            console.log(passwordList)
            console.log(passwordList[0].domain)
        
    //         assert.equal(passwordList[0],
    //             // [{domain1, username1, password1}],
    //             [{domain: '0x646f6d61696e3100000000000000000000000000000000000000000000000000',
    // username: '0x757365726e616d65310000000000000000000000000000000000000000000000',
    // password: '0x70617373776f7264310000000000000000000000000000000000000000000000'}],
    //             "Passwords are not stored in a list",
    //           );
              assert.equal(passwordList[0].domain,
                domain1,
                "Passwords are not stored in a list",
              );
        })
    })

    describe('getPasswordList function', async () => {

        it("Password List length should equal number of passwords saved.", async () => {
            const result = await passwordManager.saveNewPassword(domain1, username1, password1, {from: client1
     });
            const result2 = await passwordManager.saveNewPassword(domain2, username2, password2, {from: client1
     });
            const passwordList = await passwordManager.getPasswordList({ from: client1
     });

        assert.equal(
            passwordList.length,
            // "There are no passwords to retrieve!",
            2,
            "Password List length not the same as number of passwords saved bu user.",
          );
        })

        it("Each user should only have access to their password list.", async () => {
            const result = await passwordManager.saveNewPassword(domain1, username1, password1, {from: client2 });
            // const result2 = await passwordManager.saveNewPassword(domain2, username2, password2, {from: client2 });
            const passwordList = await passwordManager.getPasswordList({ from: client2 });

        assert.equal(
            passwordList.length,
            // "There are no passwords to retrieve!",
            1,
            "Password List length not the same as number of passwords saved bu user.",
          );
        })
    })

    describe('updatePassword function', async () => {

    });

    describe('deletePassword function', async () => {

    });

    describe('updatePassword function', async () => {

    });

    describe('withdraw function', async () => {

    });
})
  