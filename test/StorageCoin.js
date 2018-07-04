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
      stc = await StorageCoin.new(name, symbol, totalSupply)
      simpleStorage = await getAllSimpleStorage(stc.address)
    })

    it('should have totalSupply in slot 1', async () => {

    })

    it('should have paused in slot 3', async () => {

    })

    it('should have owner in slot 3 as well', async () => {

    })

    it('should have name in slot 4', async () => {

    })

    it('should have symbol in slot 5', async () => {
      
    })
  })
})