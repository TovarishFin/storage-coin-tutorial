const BigNumber = require('bignumber.js')
const leftPad = require('left-pad')

const getTrimmedStringFromStorage = hex =>
  web3.toAscii(
    hex.slice(0, new BigNumber('0x' + hex.slice(-2)).add(2).toNumber())
  )

const getAllSimpleStorage = async addr => {
  let slot = 0
  let zeroCounter = 0
  const simpleStorage = []
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const data = await web3.eth.getStorageAt(addr, slot)
    if (new BigNumber(data).equals(0)) {
      zeroCounter++
    }

    simpleStorage.push({ slot, data })
    slot++

    if (zeroCounter > 10) {
      break
    }
  }

  return simpleStorage
}

const standardizeInput = input =>
  leftPad(web3.toHex(input).replace('0x', ''), 64, '0')

const getMappingSlot = (mappingSlot, key) => {
  const mappingSlotPadded = standardizeInput(mappingSlot)
  const keyPadded = standardizeInput(key)
  const slot = web3.sha3(keyPadded.concat(mappingSlotPadded), {
    encoding: 'hex'
  })

  return slot
}

const getMappingStorage = async (address, mappingSlot, key) => {
  const mappingKeySlot = getMappingSlot(mappingSlot.toString(), key)
  const complexStorage = await web3.eth.getStorageAt(address, mappingKeySlot)
  return complexStorage
}

const getNestedMappingStorage = async (address, mappingSlot, key, key2) => {
  const nestedMappingSlot = getMappingSlot(mappingSlot.toString(), key)

  const nestedMappingValueSlot = getMappingSlot(nestedMappingSlot, key2)

  const nestedMappingValueStorage = await web3.eth.getStorageAt(
    address,
    nestedMappingValueSlot
  )

  return {
    nestedMappingSlot,
    nestedMappingValueSlot,
    nestedMappingValueStorage
  }
}

const findMappingStorage = async (address, key, startSlot, endSlot) => {
  const bigStart = startSlot.add ? startSlot : new BigNumber(startSlot)
  const bigEnd = endSlot.add ? endSlot : new BigNumber(endSlot)

  for (
    let mappingSlot = bigStart;
    mappingSlot.lt(bigEnd);
    mappingSlot = mappingSlot.add(1)
  ) {
    const mappingValueSlot = getMappingSlot(mappingSlot.toString(), key)
    const mappingValueStorage = await web3.eth.getStorageAt(
      address,
      mappingValueSlot
    )
    if (mappingValueStorage != '0x00') {
      return {
        mappingValueStorage,
        mappingValueSlot,
        mappingSlot
      }
    }
  }

  return null
}

const findNestedMappingStorage = async (
  address,
  key,
  key2,
  slotStart,
  slotEnd
) => {
  const bigStart = new BigNumber(slotStart)
  const bigEnd = new BigNumber(slotEnd)

  for (
    let mappingSlot = bigStart;
    mappingSlot.lt(bigEnd);
    mappingSlot = mappingSlot.add(1)
  ) {
    const nestedMappingSlot = getMappingSlot(mappingSlot.toString(), key)
    const nestedMappingValueSlot = getMappingSlot(nestedMappingSlot, key2)

    const nestedMappingValueStorage = await web3.eth.getStorageAt(
      address,
      nestedMappingValueSlot
    )

    if (nestedMappingValueStorage != '0x00') {
      return {
        nestedMappingValueStorage,
        mappingSlot,
        nestedMappingSlot,
        nestedMappingValueSlot
      }
    }
  }

  return null
}

module.exports = {
  getTrimmedStringFromStorage,
  getAllSimpleStorage,
  findMappingStorage,
  getMappingSlot,
  getMappingStorage,
  getNestedMappingStorage,
  findNestedMappingStorage
}
