// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  '能够正常打开登录页面（/Login）': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer)
      .waitForElementVisible('#app', 3000)
      .assert.elementPresent('.login')
      .assert.elementPresent('.mask')
      .assert.containsText('button', '提交')
      .assert.elementCount('input', 2)
      .end()
  },
  '能够正常打开登录页面（/Login）': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer)
      .waitForElementVisible('#app', 3000)
      .assert.elementPresent('.login')
      .assert.elementPresent('.mask')
      .assert.containsText('button', '提交')
      .assert.elementCount('input', 2)
      .end()
  }
}
