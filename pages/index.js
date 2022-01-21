import Head from 'next/head'
import Image from 'next/image'

import { useState, useEffect } from 'react'
import { web3, contract, sharedMessage } from '../lib/web3'

import Box from '../components/Box'
import BuyButton from '../components/BuyButton'

import Logo from '../public/logo.svg'


export default function Home() {
  const [accounts, setAccounts] = useState([])
  const [canBuy, setCanBuy] = useState(false)
  const [totalSales, setTotalSales] = useState(0)
  const [hasAccess, setHasAccess] = useState(false)

  const connect = function () {
    window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(setAccounts)
  }

  const checkAccess = function () {
    if (accounts.length > 0) {
      contract.methods.hasAccess()
          .call({ from: accounts[0] })
          .then(setHasAccess)
    } else {
      setHasAccess(false)
    }
  }

  const fetchCanBuy = async function () {
    contract.methods.canBuy().call()
        .then(setCanBuy)

    contract.methods.totalSales().call()
        .then(setTotalSales)
  }

  const buy = async function () {
    if (accounts.length > 0) {
      try {
        const transaction = await contract.methods.buy().send({
          from: accounts[0],
          value: web3.utils.toWei("0.01", "ether")
        })

        checkAccess()
        fetchCanBuy()

      } catch (e) {
        alert(e)
      }

    } else {
      alert("you need to login")
    }
  }

  const download = async function () {
    if (accounts.length > 0) {

      const t = await web3.eth.personal.sign(sharedMessage, accounts[0])

      try {
        const r = await fetch("/api/download", {
          method: "POST",
          body: JSON.stringify({ "signature": t })
        })

        const json = await r.json()

        window.location.href = json.url
      } catch (e) {
        alert("incorrect download url")
      }
    } else {
      alert("must be logged in")
    }
  }

  useEffect(() => {
    window.ethereum
        .request({ method: "eth_accounts" })
        .then(setAccounts)

    window.ethereum
        .on("accountsChanged", setAccounts)

  }, [])

  useEffect(() => {
    checkAccess()
    fetchCanBuy()
  }, [accounts])

  return (
    <main>
      <div className="label">OA Records</div>
      <Box />
      <header className="App-header">
        <Image src={Logo} className="logo" />

        <h1>The debut album from Prism</h1>
        <h2>{totalSales} / 100 sold</h2>

        <p>Available in a limited edition, holographic digital format through OA Records.</p>
        <p>20% of all revenue will go directly to the Electronic Frontier Foundation.</p>
      </header>

      <BuyButton accounts={accounts} connect={connect} buy={buy} canBuy={canBuy} hasAccess={hasAccess} download={download} />

      <Head>
        <title>Prism – the debut album, available in a limited edition</title>
        <meta property="og:title" content="Prism – the debut album, available in a limited edition" />
        <meta property="og:description" content="This is a project on the SuperHi Crypto + Web3 course" />
        <meta property="og:url" content="https://www.prism-band.com" />
        <meta property="og:image" content="https://gateway.ipfs.io/ipfs/QmR2sjejZckToA3ic8K8FypPQ9yPsdFo7K8TgDWzQKLLfU" />
      </Head>
    </main>
  )
}
