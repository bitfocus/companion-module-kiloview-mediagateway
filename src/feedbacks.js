const { combineRgb } = require('@companion-module/base')

module.exports = {
	initFeedbacks: function () {
		let self = this
		let feedbacks = {}

		const colorWhite = combineRgb(255, 255, 255)
		const colorRed = combineRgb(255, 0, 0)
		const colorGreen = combineRgb(0, 255, 0)
		const colorYellow = combineRgb(255, 255, 0)

		// Mute Status Feedback
		feedbacks.muteStatus = {
			type: 'boolean',
			name: 'Audio Mute Status',
			description: 'Change button color based on audio mute status',
			defaultStyle: {
				color: colorWhite,
				bgcolor: colorRed,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Mute Status',
					id: 'mute',
					default: '1',
					choices: self.CHOICES_MUTE,
				},
			],
			callback: function (feedback) {
				let options = feedback.options
				if (String(self.STATE.mute_status) === options.mute) {
					return true
				}
				return false
			},
		}

		// Resolution Feedback
		feedbacks.outputResolution = {
			type: 'boolean',
			name: 'Output Resolution',
			description: 'Change button color when output resolution matches',
			defaultStyle: {
				color: colorWhite,
				bgcolor: colorGreen,
			},
			options: [
				{
					type: 'textinput',
					label: 'Resolution',
					id: 'resolution',
					default: '',
				},
			],
			callback: function (feedback) {
				let options = feedback.options
				if (self.STATE.output_resolution === options.resolution) {
					return true
				}
				return false
			},
		}

		// Background Type Feedback
		feedbacks.backgroundType = {
			type: 'boolean',
			name: 'Background Type',
			description: 'Change button color when background type matches',
			defaultStyle: {
				color: colorWhite,
				bgcolor: colorGreen,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Background Type',
					id: 'type',
					default: 'black',
					choices: self.CHOICES_BACKGROUND_TYPE,
				},
			],
			callback: function (feedback) {
				let options = feedback.options
				if (self.STATE.background_type === options.type) {
					return true
				}
				return false
			},
		}

		// Guide Status Feedback
		feedbacks.guideStatus = {
			type: 'boolean',
			name: 'Guide Status',
			description: 'Change button color when guide status matches',
			defaultStyle: {
				color: colorWhite,
				bgcolor: colorGreen,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Guide Status',
					id: 'status',
					default: 'on',
					choices: self.CHOICES_GUIDE_STATUS,
				},
			],
			callback: function (feedback) {
				let options = feedback.options
				if (self.STATE.guide_status === options.status) {
					return true
				}
				return false
			},
		}

		self.setFeedbackDefinitions(feedbacks)
	},
}
