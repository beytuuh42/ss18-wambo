var username, password, loginButton;
var floatingButton;
var addPostSendButton, addPostMessage, createCommentLabel;

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


describe('Clicking on the "+" button ', function(){

  // deleting jwt token
  afterAll(function() {
    browser.executeScript('window.sessionStorage.clear();');
    browser.executeScript('window.localStorage.clear();');
  });

  beforeEach(function() {
    browser.get('/');
  });

  // Click on the + button
  it('should display add-post view', function() {
    //browser.sleep(5000);
    floatingButton.click().then(function(){
      browser.sleep(500);
      createCommentLabel = element(by.id('addPostTitle'));
      //console.log(createCommentLabel);
      expect(createCommentLabel.getText()).toEqual("Creating new Comment");
    });
  });

  // Create a new comment
  it('should display add-post view and display to home view after creating the message', function() {
    floatingButton.click().then(function(){
      browser.sleep(500);

      addPostMessage = element(by.id('addPostMessage'));
      addPostSendButton = element(by.id('addPostSendButton'));

      var input = addPostMessage.element(by.css('input'));
      browser.actions().mouseMove(input).click();
      input.sendKeys('Test Message');

      addPostSendButton.click().then(function(){
        browser.sleep(500);
        expect(floatingButton.isDisplayed()).toBeTruthy();
      });
    });
  });
});
