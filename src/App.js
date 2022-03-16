import React, { useEffect } from 'react'
import { ethers } from 'ethers'
import { atom, useRecoilState } from 'recoil'

import './App.css'
import contractAbi from './contract/SimpleStorage.json'

const CONTRACT_ADDRESS = '0xB2Fc9da6aC31CdEEf18CDff1da7e47d4520A3793'

function App () {
  const inputState = atom({
    key: 'inputState',
    default: 0
  })

  const [inputValue, setInputValue] = useRecoilState(inputState)

  const handleChange = e => {
    setInputValue(e.target.value)
  }

  const checkIfWalletConnected = () => {
    if (window.ethereum) {
      console.log('Metamask is installed')
      return
    } else {
      console.log('Metamask is not installed')
    }
  }

  const setNumber = async () => {
    try {
      const { ethereum } = window
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractAbi.abi,
        signer
      )

      let tx = await contract.store(inputValue)
      await tx.wait()

      const number = await contract.retrieve()
      console.log(number)
    } catch (error) {
      console.log(error)
    }
  }

  const getNumber = async () => {
    try {
      const { ethereum } = window
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractAbi.abi,
        signer
      )
      const number = await contract.retrieve()
      console.log(number.toNumber())
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletConnected()
  }, [])

  return (
    <div className='flex h-screen items-center justify-center'>
      <input
        className='focus:shadow-outline w-1/5 appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none'
        type='number'
        value={inputValue}
        onChange={handleChange}
      />
      <button
        className='ml-4 flex h-10 items-center rounded-lg bg-blue-500 p-2 text-center text-white'
        onClick={setNumber}
      >
        Set Number
      </button>
      <button
        className='ml-4 flex h-10 items-center rounded-lg bg-blue-500 p-2 text-center text-white'
        onClick={getNumber}
      >
        Get Number
      </button>
    </div>
  )
}

export default App
