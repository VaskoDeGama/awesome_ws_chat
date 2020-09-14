'use strict'
import { prepareData, uuidv4 } from './utils'

export default class Service{
  /**
   * Constructor
   * @param protocolInstance
   * @param protocolType
   */
  constructor (protocolInstance, protocolType) {
    this.potocol = protocolInstance
    this.type = protocolType
  }

  /**
   * Send data throw protocol
   * @param data
   */
  send(data) {
    switch (this.type) {
      case 'ws': {
        this.potocol.send(prepareData({
          type: 'stream',
          message: data,
        }))
        break
      }
      case 'http' :{
        setImg(data).then(data => null)
        break
      }
    }
  }

  get() {
    switch (this.type) {
      case 'http' : {

        return getImg().then(({status, data}) => {
          if (status && typeof data === 'string') {
            return data
          }
        })

        }
      }
    }
}


const setImg = async (data) => {
  try {
    const response = await fetch('/api', {
      method: 'POST',
      body: prepareData({
        type: 'setImg',
        data: data
      })
    })
    if (response.ok) {
      const json = await response.json()
      return json
    } else {
      return false
    }

  } catch (e) {
    throw new Error(e.message)
  }
}

const getImg = async () => {
  try {
    const response = await fetch('/api', {
      method: 'POST',
      body: prepareData({
        type: 'getImg',
      })
    })
    if (response.ok) {
      const json = await response.json()
      return json
    } else {
      return false
    }

  } catch (e) {
    throw new Error(e.message)
  }
}

