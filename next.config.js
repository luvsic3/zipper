/* eslint-disable unicorn/prefer-module */
/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
	dest: 'public',
})

module.exports = withPWA({
	// Config
})
