const StorageCoin = artifacts.require('StorageCoin')
const BigNumber = require('bignumber.js')
const chalk = require('chalk')
const util = require('util')

const {
  getAllSimpleStorage,
} = require('./helpers')

describe('when accessing StorageCoin storage', () => {
  contract('StorageCoin', accounts => {
    let stc
    let storage
    const totalSupply = new BigNumber('100e18')
    const name = 'StorageCoin'
    const symbol = 'STC'

    before('setup contract', async () => {
      stc = await StorageCoin.new(name, symbol, totalSupply, { from: owner })
      simpleStorage = await getAllSimpleStorage(stc.address)
      console.log(simpleStorage)
    })

    it('should have totalSupply in slot 1', async () => {
      assert.equal(
        new BigNumber(simpleStorage[1].data).toString(),
        totalSupply.toString(),
        'storage slot 1 should match totalSupply'
      )
    })

    it('should have paused in slot 3', async () => {
      assert.equal(
        '0x' + simpleStorage[3].slice(5),
        owner
      )
    })

    it('should have owner in slot 3 as well', async () => {

    })

    it('should have name in slot 4', async () => {

    })

    it('should have symbol in slot 5', async () => {
      
    })
  })
})