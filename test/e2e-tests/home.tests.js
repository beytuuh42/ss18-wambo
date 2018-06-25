describe('Clicking on the login button ', function(){
    var username, password, loginButton;

    beforeEach(function() {
      browser.get('/');
      username = element(by.id('loginItem'));
      password = element(by.id('passwordItem'));
      loginButton = element(by.id('loginButton'));
    });

    afterEach(function() {
      browser.executeScript('window.sessionStorage.clear();');
      browser.executeScript('window.localStorage.clear();');
    });

    it('should validate the credentials for a successful login and display the Home view', function() {
      var input = username.element(by.css('input'));
      input.click();
      input.sendKeys('admin');

      var input2 = password.element(by.css('input'));
      input2.click();
      input2.sendKeys('adminadmin');

      loginButton.click().then(function() {
        browser.sleep(500);
        var tabCtr = element.all((by.css('.tab-button'))).first();
        expect(tabCtr.isDisplayed()).toBeTruthy();
      });
    });
});
