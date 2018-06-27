var username, password, loginButton;
var postTitle, commentWrapper;

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

describe('Clicking on a comment icon ', function(){

  // deleting jwt token
  afterAll(function() {
    browser.executeScript('window.sessionStorage.clear();');
    browser.executeScript('window.localStorage.clear();');
  });

  beforeEach(function() {
    browser.get('/');
  });

  // clicking on a comment
  it('should display the post view', function() {
    commentWrapper = element.all((by.css('ion-item-sliding'))).first();
    //browser.sleep(50000);
    //expect(commentWrapper.isDisplayed()).toBeTruthy();
    commentWrapper.click().then(function(){
      browser.sleep(500);
        postTitle = element(by.id('postTitle'));
        expect(postTitle.getText()).toEqual("Comments");
    });
  });
});
