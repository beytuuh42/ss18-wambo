describe('Clicking on the create account button ', function(){
    var username, password, loginButton, registerButton, createAccountButton;

    beforeEach(function() {
      browser.get('/');
      username = element(by.id('loginItem'));
      password = element(by.id('passwordItem'));
      loginButton = element(by.id('loginButton'));
      createAccountButton = element(by.id('createAccountButton'));
    });

    afterEach(function() {
      browser.executeScript('window.sessionStorage.clear();');
      browser.executeScript('window.localStorage.clear();');
    });

    it('should successfully sign up and show a pop up saying "Account created"', function() {
      createAccountButton.click();
      browser.sleep(500);

      username = element(by.id('loginItemR'));
      password = element(by.id('passwordItemR'));

      var input = username.element(by.css('input'));
      input.click();
      input.sendKeys(Math.random().toString(36).substr(2, 5));

      var input2 = password.element(by.css('input'));
      input2.click();
      input2.sendKeys(Math.random().toString(36).substr(2, 8));

      registerButton = element(by.id('registerButton'));

      registerButton.click().then(function() {
        browser.sleep(500);
        var popup = element(by.css('.alert-sub-title'));
        expect(popup.getText()).toEqual("Account created.");
      });
    })
});
