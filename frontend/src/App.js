import React, { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { BsBagCheckFill } from 'react-icons/bs';
import { runFireworks } from './animation';

import dotenv from "dotenv";
dotenv.config();

function loadScript(src) {
	return new Promise((resolve) => {
		const script = document.createElement('script')
		script.src = src
		script.onload = () => {
			resolve(true)
		}
		script.onerror = () => {
			resolve(false)
		}
		document.body.appendChild(script)
	})
}

const __DEV__ = document.domain === 'localhost'

function App() {
	const [name, setName] = useState('Priyam')
	runFireworks();
	
	async function displayRazorpay() {
		const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

		if (!res) {
			alert('Razorpay SDK failed to load. Are you online?')
			return
		}

		const data = await fetch('http://localhost:1337/razorpay', { method: 'POST' }).then((t) =>
			t.json()
		)

		console.log(data)

		const options = {
			key: __DEV__ ? process.env.KEY_ID : 'PRODUCTION_KEY',
			currency: data.currency,
			amount: data.amount.toString(),
			order_id: data.id,
			name: 'Payment',
			description: 'Thank you for the payment. Your details have been noted.',
			image: 'http://localhost:1337/logo.svg',
			handler: function (response) {
				alert(response.razorpay_payment_id)
				alert(response.razorpay_order_id)
				alert(response.razorpay_signature)
			},
			prefill: {
				name
				// email: 'sdfdsjfh2@ndsfdf.com',
				// phone_number: '9899999999'
			}
		}
		const paymentObject = new window.Razorpay(options)
		paymentObject.open()
	}

	return (
		<div className="App">
			<div className='success-wrapper'>
			<div className="success">
				<p className="icon">
					<BsBagCheckFill />
				</p>
				<h2>Thank you for placing your order!</h2>
				<p className="description">
					Complete the payment and close this tab.For support mail us at
					<a className="email" href="info@urbanlyfe.green">
					info@urbanlyfe.green
					</a>
				</p>
				
				
				<button type="button" width="300px" className="btn" target="_blank"
						rel="noopener noreferrer" onClick={displayRazorpay}>
					Make Secure Payment
				</button>
			</div>	
			</div>
		</div>
	)
}

export default App
