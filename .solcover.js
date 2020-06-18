const shell = require('shelljs');

module.exports = {
  // onCompileComplete: async function(config){
  //   await run('typechain');
  // },
  // onIstanbulComplete: async function(config){
  //   shell.rm('-rf', './typechain'); // Clean up at the end
  // }
  providerOptions: {
    // gasLimit: 0xfffffffffff,
    // testrpcOptions: '-p 8555 -l 0xfffffffffff'
  }
}