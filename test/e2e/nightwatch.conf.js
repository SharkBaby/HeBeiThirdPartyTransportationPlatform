require('babel-register')
var config = require('../../config')

// http://nightwatchjs.org/gettingstarted#settings-file
module.exports = {
  src_folders: ['test/e2e/specs'],
  output_folder: 'test/e2e/reports',
  custom_assertions_path: ['test/e2e/custom-assertions'],
  // 以下是向浩通过官方文档添加的默认配置
  custom_commands_path: "",
  page_objects_path: "",
  globals_path: "",
  
  selenium: {
    start_process: true,
    server_path: require('selenium-server').path,
    // 以下是向浩通过官方文档添加的默认配置
    log_path: "",
    // End
    host: '127.0.0.1',
    port: 4444,
    cli_args: {
      'webdriver.chrome.driver': require('chromedriver').path,
      // 以下是向浩通过官方文档添加的默认配置
      "webdriver.gecko.driver": "",
      "webdriver.edge.driver": "",
      // End
    }
  },

  test_settings: {
    default: {
      selenium_port: 4444,
      selenium_host: 'localhost',
      silent: true,
      globals: {
        devServerURL: 'http://localhost:' + (process.env.PORT || config.dev.port)
      }
    },

    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true
      }
    },

    firefox: {
      desiredCapabilities: {
        browserName: 'firefox',
        javascriptEnabled: true,
        acceptSslCerts: true
      }
    },
    edge: {
      desiredCapabilities: {
        browserName: "MicrosoftEdge"
      }
    }
  }
}
