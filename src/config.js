const { Regex } = require('@companion-module/base')

module.exports = {
	getConfigFields() {
		let self = this

		return [
			{
				type: 'static-text',
				id: 'info',
				width: 12,
				label: 'Information',
				value: 'This module controls Kiloview Media Gateway devices(MG300V2/RMG300V2) with full API integration.',
			},
			{
				type: 'static-text',
				id: 'hr1',
				width: 12,
				label: ' ',
				value: '<hr />',
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'Device IP / Host',
				width: 6,
				default: '',
				regex: Regex.HOSTNAME,
			},
			{
				type: 'dropdown',
				id: 'protocol',
				label: 'Protocol',
				width: 3,
				default: 'http',
				choices: [
					{ id: 'http', label: 'HTTP (port: 99)' },
					{ id: 'https', label: 'HTTPS (port: 443)' },
				],
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Port',
				width: 3,
				default: '99',
				regex: Regex.PORT,
			},
			{
				type: 'static-text',
				id: 'hr2',
				width: 12,
				label: ' ',
				value: '<hr />',
			},
			{
				type: 'checkbox',
				id: 'useAuth',
				label: 'Use Authentication',
				width: 6,
				default: true,
			},
			{
				type: 'textinput',
				label: 'Username',
				id: 'username',
				width: 3,
				default: 'admin',
				isVisible: (configValues) => configValues.useAuth === true,
			},
			{
				type: 'textinput',
				label: 'Password',
				id: 'password',
				width: 3,
				default: 'admin',
				isVisible: (configValues) => configValues.useAuth === true,
			},
			{
				type: 'static-text',
				id: 'hr3',
				width: 12,
				label: ' ',
				value: '<hr />',
			},
			{
				type: 'checkbox',
				id: 'polling',
				label: 'Enable Polling (necessary for feedbacks and variables)',
				default: true,
				width: 3,
			},
			{
				type: 'textinput',
				id: 'pollingrate',
				label: 'Polling Rate for Current State (in ms)',
				default: self.POLLINGRATE,
				width: 3,
				isVisible: (configValues) => configValues.polling === true,
			},
			{
				type: 'textinput',
				id: 'pollingrate_sources',
				label: 'Polling Rate for Sources (in ms)',
				default: self.POLLINGRATE_SOURCES,
				width: 3,
				isVisible: (configValues) => configValues.polling === true,
			},
			{
				type: 'static-text',
				id: 'hr4',
				width: 12,
				label: ' ',
				value: '<hr />',
			},
			{
				type: 'checkbox',
				id: 'verbose',
				label: 'Enable Verbose Logging',
				default: false,
				width: 3,
			},
			{
				type: 'static-text',
				id: 'verboseInfo',
				width: 9,
				label: ' ',
				value: 'Enabling Verbose Logging will push all incoming and outgoing data to the log, which is helpful for debugging.',
			},
		]
	},
}
