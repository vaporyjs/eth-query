const extend = require('xtend')
const createRandomId = require('json-rpc-random-id')()

module.exports = VapQuery


function VapQuery(provider){
  const self = this
  self.currentProvider = provider
}

//
// base queries
//

// default block
VapQuery.prototype.getBalance =                          generateFnWithDefaultBlockFor(2, 'vap_getBalance')
VapQuery.prototype.getCode =                             generateFnWithDefaultBlockFor(2, 'vap_getCode')
VapQuery.prototype.getTransactionCount =                 generateFnWithDefaultBlockFor(2, 'vap_getTransactionCount')
VapQuery.prototype.getStorageAt =                        generateFnWithDefaultBlockFor(3, 'vap_getStorageAt')
VapQuery.prototype.call =                                generateFnWithDefaultBlockFor(2, 'vap_call')
// standard
VapQuery.prototype.protocolVersion =                     generateFnFor('vap_protocolVersion')
VapQuery.prototype.syncing =                             generateFnFor('vap_syncing')
VapQuery.prototype.coinbase =                            generateFnFor('vap_coinbase')
VapQuery.prototype.mining =                              generateFnFor('vap_mining')
VapQuery.prototype.hashrate =                            generateFnFor('vap_hashrate')
VapQuery.prototype.gasPrice =                            generateFnFor('vap_gasPrice')
VapQuery.prototype.accounts =                            generateFnFor('vap_accounts')
VapQuery.prototype.blockNumber =                         generateFnFor('vap_blockNumber')
VapQuery.prototype.getBlockTransactionCountByHash =      generateFnFor('vap_getBlockTransactionCountByHash')
VapQuery.prototype.getBlockTransactionCountByNumber =    generateFnFor('vap_getBlockTransactionCountByNumber')
VapQuery.prototype.getUncleCountByBlockHash =            generateFnFor('vap_getUncleCountByBlockHash')
VapQuery.prototype.getUncleCountByBlockNumber =          generateFnFor('vap_getUncleCountByBlockNumber')
VapQuery.prototype.sign =                                generateFnFor('vap_sign')
VapQuery.prototype.sendTransaction =                     generateFnFor('vap_sendTransaction')
VapQuery.prototype.sendRawTransaction =                  generateFnFor('vap_sendRawTransaction')
VapQuery.prototype.estimateGas =                         generateFnFor('vap_estimateGas')
VapQuery.prototype.getBlockByHash =                      generateFnFor('vap_getBlockByHash')
VapQuery.prototype.getBlockByNumber =                    generateFnFor('vap_getBlockByNumber')
VapQuery.prototype.getTransactionByHash =                generateFnFor('vap_getTransactionByHash')
VapQuery.prototype.getTransactionByBlockHashAndIndex =   generateFnFor('vap_getTransactionByBlockHashAndIndex')
VapQuery.prototype.getTransactionByBlockNumberAndIndex = generateFnFor('vap_getTransactionByBlockNumberAndIndex')
VapQuery.prototype.getTransactionReceipt =               generateFnFor('vap_getTransactionReceipt')
VapQuery.prototype.getUncleByBlockHashAndIndex =         generateFnFor('vap_getUncleByBlockHashAndIndex')
VapQuery.prototype.getUncleByBlockNumberAndIndex =       generateFnFor('vap_getUncleByBlockNumberAndIndex')
VapQuery.prototype.getCompilers =                        generateFnFor('vap_getCompilers')
VapQuery.prototype.compileLLL =                          generateFnFor('vap_compileLLL')
VapQuery.prototype.compileSolidity =                     generateFnFor('vap_compileSolidity')
VapQuery.prototype.compileSerpent =                      generateFnFor('vap_compileSerpent')
VapQuery.prototype.newFilter =                           generateFnFor('vap_newFilter')
VapQuery.prototype.newBlockFilter =                      generateFnFor('vap_newBlockFilter')
VapQuery.prototype.newPendingTransactionFilter =         generateFnFor('vap_newPendingTransactionFilter')
VapQuery.prototype.uninstallFilter =                     generateFnFor('vap_uninstallFilter')
VapQuery.prototype.getFilterChanges =                    generateFnFor('vap_getFilterChanges')
VapQuery.prototype.getFilterLogs =                       generateFnFor('vap_getFilterLogs')
VapQuery.prototype.getLogs =                             generateFnFor('vap_getLogs')
VapQuery.prototype.getWork =                             generateFnFor('vap_getWork')
VapQuery.prototype.submitWork =                          generateFnFor('vap_submitWork')
VapQuery.prototype.submitHashrate =                      generateFnFor('vap_submitHashrate')

// network level

VapQuery.prototype.sendAsync = function(opts, cb){
  const self = this
  self.currentProvider.sendAsync(createPayload(opts), function(err, response){
    if (!err && response.error) err = new Error('VapQuery - RPC Error - '+response.error.message)
    if (err) return cb(err)
    cb(null, response.result)
  })
}

// util

function generateFnFor(methodName){
  return function(){
    const self = this
    var args = [].slice.call(arguments)
    var cb = args.pop()
    self.sendAsync({
      method: methodName,
      params: args,
    }, cb)
  }
}

function generateFnWithDefaultBlockFor(argCount, methodName){
  return function(){
    const self = this
    var args = [].slice.call(arguments)
    var cb = args.pop()
    // set optional default block param
    if (args.length < argCount) args.push('latest')
    self.sendAsync({
      method: methodName,
      params: args,
    }, cb)
  }
}

function createPayload(data){
  return extend({
    // defaults
    id: createRandomId(),
    jsonrpc: '2.0',
    params: [],
    // user-specified
  }, data)
}
