var username, password, loginButton;
var profileLogoutButton, tabProfileIcon;

describe('Clicking on the login button ', function(){

    beforeEach(function() {
      browser.get('/');
    });

    // Login
    it('should validate the credentials for a successful login and display the Home view', function() {

      username = element(by.id('loginItem'));
      password = element(by.id('passwordItem'));
      loginButton = element(by.id('loginButton'));

      var input = username.element(by.css('input'));
      browser.actions().mouseMove(input).click();
      input.sendKeys('admin');

      var input2 = password.element(by.css('input'));
      browser.actions().mouseMove(input2).click();
      input2.sendKeys('adminadmin');

      loginButton.click().then(function() {
        browser.sleep(500);
        floatingButton = element(by.id('androidFab'));
        expect(floatingButton.isDisplayed()).toBeTruthy();
      });
    });
});

describe('Clicking on the profile icon ', function(){

  // deleting jwt token
  afterAll(function() {
    browser.executeScript('window.sessionStorage.clear();');
    browser.executeScript('window.localStorage.clear();');
  });

  beforeEach(function() {
    browser.get('/');
  });

  // clicking on the profile tab
  it('should display the profile view', function() {
    tabProfileIcon = element(by.id('tab-t0-1'));
    tabProfileIcon.click().then(function(){
      browser.sleep(500);
      profileLogoutButton = element(by.id('profileLogoutButton'));
      expect(profileLogoutButton.isDisplayed()).toBeTruthy();
    });
  });

  // clicking logout button in the profile tab
  it('should display the login view', function() {
    tabProfileIcon = element(by.id('tab-t0-1'));
    tabProfileIcon.click().then(function(){
      browser.sleep(500);
      profileLogoutButton.click().then(function(){
        browser.sleep(500);
        expect(loginButton.isDisplayed()).toBeTruthy();
      });
    });
  });

});
