const StorageCoin = artifacts.require('StorageCoin')
const BigNumber = require('bignumber.js')

const {
  getAllSimpleStorage,
  getTrimmedStringFromStorage,
  getMappingStorage,
  getNestedMappingStorage,
  findMappingStorage,
  findNestedMappingStorage
} = require('./helpers')

describe('when accessing StorageCoin storage', () => {
  contract('StorageCoin', accounts => {
    let stc
    let simpleStorage
    const totalSupply = new BigNumber('100e18')
    const name = 'StorageCoin'
    const symbol = 'STC'
    const owner = accounts[0]
    const spender = accounts[1]

    before('setup contract', async () => {
      stc = await StorageCoin.new(name, symbol, totalSupply, { from: owner })
      simpleStorage = await getAllSimpleStorage(stc.address)
    })

    it('should have owner balance in slot 0 mapping', async () => {
      const ownerBalanceStorage = await getMappingStorage(stc.address, 0, owner)
      assert.equal(
        new BigNumber(ownerBalanceStorage).toString(),
        totalSupply.toString(),
        'initial owner balance storage should match totalSupply'
      )
    })

    it('should have totalSupply in slot 1', async () => {
      assert.equal(
        new BigNumber(simpleStorage[1].data).toString(),
        totalSupply.toString(),
        'storage slot 1 should match totalSupply'
      )
    })

    it('should have paused in slot 3', async () => {
      assert(
        new BigNumber(simpleStorage[3].data.slice(0, 4)).toNumber(),
        'paused should be true and in first part of slot 3'
      )
    })

    it('should have owner in slot 3 as well', async () => {
      assert.equal(
        '0x' + simpleStorage[3].data.slice(4),
        owner,
        'owner should be in second part of slot 3'
      )
    })

    it('should have name in slot 4', async () => {
      assert.equal(
        getTrimmedStringFromStorage(simpleStorage[4].data),
        name,
        'name should be in slot 4'
      )
    })

    it('should have symbol in slot 5', async () => {
      assert.equal(
        getTrimmedStringFromStorage(simpleStorage[5].data),
        symbol,
        'symbol should be in slot 5'
      )
    })

    it('should unpause the token as owner', async () => {
      await stc.unpause({ from: owner })

      const paused = await stc.paused()

      assert(!paused, 'paused should be false')
    })

    it('should set allowance for spender as owner', async () => {
      const preAllowance = await stc.allowance(owner, spender)
      const allowanceAmount = totalSupply.div(4)

      await stc.approve(spender, allowanceAmount, { from: owner })

      const postAllowance = await stc.allowance(owner, spender)
      assert.equal(
        postAllowance.sub(preAllowance).toString(),
        allowanceAmount.toString(),
        'owner allowance for spender should equal allowanceAmount'
      )
    })

    it('should have owner allowance for spender at correct storage slot', async () => {
      const allowance = await stc.allowance(owner, spender)
      const { nestedMappingValueStorage } = await getNestedMappingStorage(
        stc.address,
        2,
        owner,
        spender
      )
      const allowanceStorage = new BigNumber(nestedMappingValueStorage)

      assert.equal(
        allowanceStorage.toString(),
        allowance.toString(),
        'allowance found in storage should match allowance retrieved normally'
      )
    })

    it('should find a balance mapping value for owner', async () => {
      const balance = await stc.balanceOf(owner)

      const { mappingValueStorage } = await findMappingStorage(
        stc.address,
        owner,
        0,
        20
      )
      const balanceStorage = new BigNumber(mappingValueStorage)

      assert.equal(
        balanceStorage.toString(),
        balance.toString(),
        'balance found in storage for owner should match balance retrieved normally'
      )
    })

    it('should find a nested mapping value for allownace of owner for spender', async () => {
      const allowance = await stc.allowance(owner, spender)

      const { nestedMappingValueStorage } = await findNestedMappingStorage(
        stc.address,
        owner,
        spender,
        0,
        20
      )
      const allowanceStorage = new BigNumber(nestedMappingValueStorage)

      assert.equal(
        allowanceStorage.toString(),
        allowance.toString(),
        'allownace found in storage for owner => spender should match allowance retrieved normally'
      )
    })
  })
})
