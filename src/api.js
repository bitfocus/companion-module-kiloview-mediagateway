const { InstanceStatus } = require('@companion-module/base')
const MediaGateway = require('./mediagateway')

module.exports = {
	async initConnection() {
		let self = this

		clearInterval(self.INTERVAL)
		clearInterval(self.INTERVAL_SOURCES)
		clearTimeout(self.RECONNECT_INTERVAL)

		if (self.config.host && self.config.host !== '') {
			self.updateStatus(InstanceStatus.Connecting)
			self.log('info', `Opening connection to ${self.config.host}`)

			self.DEVICE = new MediaGateway(
				this,
				self.config.host,
				self.config.username,
				self.config.password,
				self.config.protocol,
				self.config.port
			)

			let authorized = false

			if (self.config.useAuth === false) {
				self.log('info', 'No authentication required. Connecting to device...')
				authorized = true
			} else {
				try {
					self.log('info', 'Attempting to authorize...')
					authorized = await self.DEVICE.authorize()
				} catch (error) {
					if (error.name === 'MediaGatewayError') {
						self.log('error', 'Authorization failed. Check your username and password and try again.')
						self.updateStatus(InstanceStatus.ConnectionFailure, 'Authorization Failed. See log.')
					} else {
						self.log('error', 'Could not reach device. Retrying in 30 seconds.')
						self.updateStatus(InstanceStatus.ConnectionFailure)
						self.startReconnectInterval()
					}
					return
				}
			}

			if (authorized === true) {
				self.updateStatus(InstanceStatus.Ok)
				self.log('info', 'Connection established successfully')

				await self.checkState()
				await self.checkSources()

				if (self.config.polling === true) {
					const pollRate = self.config.pollingrate || self.POLLINGRATE
					const pollRateSources = self.config.pollingrate_sources || self.POLLINGRATE_SOURCES

					self.log('info', `Starting polling at ${pollRate}ms interval`)
					self.INTERVAL = setInterval(() => {
						self.checkState()
					}, pollRate)

					self.INTERVAL_SOURCES = setInterval(() => {
						self.checkSources()
					}, pollRateSources)
				}
			}
		} else {
			self.updateStatus(InstanceStatus.BadConfig)
		}
	},

	startReconnectInterval() {
		let self = this
		self.RECONNECT_INTERVAL = setInterval(() => {
			self.initConnection()
		}, self.RECONNECT_TIME)
	},

	async checkState() {
		let self = this

		let hasError = false

		try {
			let outputResult = await self.DEVICE.getOutput()
			if (outputResult && outputResult.data) {
				self.STATE.output_name = outputResult.data.output_name || ''
				self.STATE.output_resolution = outputResult.data.resolution || ''
				self.STATE.mute_status = outputResult.data.mute ? '1' : '0'
				self.STATE.background_type = outputResult.data.background_type || ''

				if (outputResult.data.layout) {
					self.STATE.layout_name = outputResult.data.layout.name || ''
				}
			}
		} catch (e) {
			self.log('debug', 'getOutput failed: ' + e.message)
			hasError = true
		}

		try {
			let infoResult = await self.DEVICE.getDeviceInfo()
			if (infoResult && infoResult.data) {
				self.STATE.device_name = infoResult.data.device_name || self.STATE.device_name || ''
				self.STATE.serial_number = infoResult.data.serial_number || ''
				self.STATE.hardware_version = infoResult.data.hardware_version || ''
				self.STATE.firmware_version = infoResult.data.firmware_version || ''
				self.STATE.software_version = infoResult.data.software_version || ''
			}
		} catch (e) {
			self.log('debug', 'getDeviceInfo failed: ' + e.message)
			hasError = true
		}

		try {
			let deviceResult = await self.DEVICE.getDeviceName()
			if (deviceResult && deviceResult.data) {
				self.STATE.device_name = deviceResult.data.name || ''
			}
		} catch (e) {
			self.log('debug', 'getDeviceName failed: ' + e.message)
			hasError = true
		}

		try {
			let ipResult = await self.DEVICE.getIP()
			if (ipResult && ipResult.data) {
				self.STATE.ip = ipResult.data.ip || self.config.host
			}
		} catch (e) {
			self.STATE.ip = self.config.host
		}

		try {
			let usageResult = await self.DEVICE.getUsage()
			if (usageResult && usageResult.data) {
				if (usageResult.data.cpu !== undefined) {
					self.STATE.cpu_usage = usageResult.data.cpu
				}
				if (usageResult.data.mem !== undefined) {
					self.STATE.mem_used = usageResult.data.mem.used || usageResult.data.memory_used
					self.STATE.mem_total = usageResult.data.mem.total || usageResult.data.memory_total
				}
				if (usageResult.data.uptime !== undefined) {
					self.STATE.uptime = usageResult.data.uptime
				}
			}
		} catch (e) {
			self.log('debug', 'getUsage failed: ' + e.message)
			hasError = true
		}

		try {
			let guideResult = await self.DEVICE.getGuideStatus()
			if (guideResult && guideResult.data) {
				self.STATE.guide_status = guideResult.data.status || guideResult.data.enabled ? 'on' : 'off'
			}
		} catch (e) {
			self.log('debug', 'getGuideStatus failed: ' + e.message)
			hasError = true
		}

		try {
			let multiOutResult = await self.DEVICE.getMultiOutState()
			if (multiOutResult && multiOutResult.data && multiOutResult.data.enable !== undefined) {
				let newEnable = multiOutResult.data.enable
				let currentEnable = self.CHOICES_MULTI_OUT.find((c) => c.enable)?.id
				if (currentEnable !== newEnable) {
					self.CHOICES_MULTI_OUT = [
						{ id: 1, label: 'Output 1' + (newEnable === 1 ? ' (Active)' : ''), enable: newEnable === 1 },
						{ id: 2, label: 'Output 2' + (newEnable === 2 ? ' (Active)' : ''), enable: newEnable === 2 },
					]
					self.initActions()
				}
			}
		} catch (e) {
			self.log('debug', 'getMultiOutState failed: ' + e.message)
		}

		self.checkFeedbacks()
		self.checkVariables()

		if (hasError && !self._endpointWarned) {
			self._endpointWarned = true
			self.log('warn', 'Some status endpoints returned errors - connection is OK but data may be incomplete')
		}
	},

	async checkSources() {
		let self = this

		let streamsArray = [{ id: 'null', label: '- No streams available -' }]
		let layoutsArray = [{ id: 'null', label: '- No layouts available -' }]
		let positionsArray = [{ id: 1, label: 'Position 1' }]
		let outputsArray = [{ id: 'null', label: '- No outputs available -' }]
		let gatewayStreamsArray = [{ id: 'null', label: '- No gateway streams available -' }]
		let gatewayStreamingsArray = [{ id: 'null', label: '- No active push streams -' }]
		let previewSourcesArray = [{ id: 'null', label: '- No active previews -' }]

		try {
			let groupResult = await self.DEVICE.getGroupList()
			if (groupResult && groupResult.data) {
				let count = 0
				let groupLines = []
				let streams = []
				if (Array.isArray(groupResult.data)) {
					self.STATE.groups = groupResult.data
					groupResult.data.forEach((group) => {
						let name = group.name || group.group_name || group.id || 'Unknown'
						let streamCount = group.streams ? group.streams.length : 0
						count += streamCount
						groupLines.push(`- ${name}(${streamCount})`)
						if (group.streams && Array.isArray(group.streams)) {
							group.streams.forEach((stream) => {
								let sName = stream.name || stream.stream_name || stream.ndi_name || 'Unknown'
								let sType = stream.type || ''
								let sId = stream.id || ''
								let sUrl = stream.url || ''
								groupLines.push(`  ${sName}  ${sType}  ${sId}  ${sUrl}`)
								streams.push({
									id: sId,
									label: `${name}: ${sName}`,
									name: sName,
									url: sUrl,
									type: sType,
									group: name,
									group_id: group.id || '',
								})
							})
						}
					})
				}
				self.STATE.sources_count = count
				self.STATE.group_list = groupLines.join('\n')

				if (streams.length > 0) {
					streamsArray = streams
				}
			}

			// Get layout list
			try {
				let layoutResult = await self.DEVICE.getLayoutList()
				if (layoutResult && layoutResult.data && Array.isArray(layoutResult.data)) {
					self.STATE.layouts_count = layoutResult.data.length
					self.STATE.layouts = layoutResult.data
					let layoutLines = layoutResult.data.map((l) => {
						let name = l.name || 'Unknown'
						let count = l.layout_count || '?'
						return `- ${name}(${count})`
					})
					self.STATE.layout_list = layoutLines.join('\n')

					layoutsArray = layoutResult.data.map((l) => ({
						id: String(l.layout_id || l.id || ''),
						label: l.name || 'Unknown',
					}))

					// Compute positions from position arrays in all layouts
					let posMap = new Map()
					layoutResult.data.forEach((l) => {
						if (Array.isArray(l.position)) {
							l.position.forEach((p) => {
								let id = p.id !== undefined ? p.id : p.number
								if (id !== undefined && !posMap.has(id)) {
									posMap.set(id, { id: id, label: `Position ${p.number || id}` })
								}
							})
						}
					})
					if (posMap.size > 0) {
						positionsArray = Array.from(posMap.values()).sort((a, b) => a.id - b.id)
					}
				}
			} catch (e) {
				self.log('debug', 'Layout list fetch failed: ' + e.message)
			}

			// Get gateway stream count
			try {
				let gatewayResult = await self.DEVICE.getGatewayStreamList()
				if (gatewayResult && gatewayResult.data && Array.isArray(gatewayResult.data)) {
					self.STATE.gateway_streams_count = gatewayResult.data.length
					self.STATE.gateway_streams = gatewayResult.data
					let gwLines = gatewayResult.data.map((s) => {
						let name = s.name || s.stream_name || s.id || 'Unknown'
						let url = s.url || ''
						return `- ${name}( ${url})`
					})
					self.STATE.gateway_stream_list = gwLines.join('\n')

					gatewayStreamsArray = gatewayResult.data.map((s) => {
						let gwName = s.name || s.stream_name || s.id || 'Unknown'
						let gwProto = s.protocol || ''
						let gwUrl = s.dest_url || s.src_url || ''
						return {
							id: String(s.id || ''),
							label: gwName + ' — ' + gwProto + ' | ' + gwUrl,
							protocol: gwProto,
							dest_url: gwUrl,
							stream_id: s.stream_id || '',
						}
					})

					gatewayStreamingsArray = gatewayResult.data
						.filter((s) => s.is_enable)
						.map((s) => {
							let gwName = s.name || s.stream_name || s.id || 'Unknown'
							let gwProto = s.protocol || ''
							let gwUrl = s.dest_url || s.src_url || ''
							return {
								id: String(s.id || ''),
								label: gwName + ' — ' + gwProto + ' | ' + gwUrl,
							}
						})
					if (gatewayStreamingsArray.length === 0) {
						gatewayStreamingsArray = [{ id: 'null', label: '- No active push streams -' }]
					}
				}
			} catch (e) {
				self.log('debug', 'Gateway stream list fetch failed: ' + e.message)
			}

			// Get preview list
			try {
				let previewResult = await self.DEVICE.getPreviewList()
				if (previewResult && previewResult.data && previewResult.data.position && Array.isArray(previewResult.data.position)) {
					self.STATE.preview_sources = previewResult.data.position
					let previewList = previewResult.data.position.map((p) => {
							let sId = p.stream_id || ''
							let pId = p.id || ''
							let stream = streamsArray.find((s) => s.id === sId)
							let sName = stream ? stream.name : ''
							let sType = stream ? stream.type : ''
							let label = sName || sType ? `${sName}  ${sType}` : (p.id ? `Preview ${p.id}` : '(Empty)')
							return {
								id: String(pId),
								label: label,
								pos_id: pId,
								stream_id: sId,
								stream_name: sName,
								stream_type: sType,
							}
						})
						if (!previewList.some((p) => p.id === '')) {
							previewList.push({ id: '', label: '(Empty)', pos_id: '', stream_id: '', stream_name: '', stream_type: '' })
						}
						// First position is the IP Stream Output
						if (previewList.length > 0 && previewList[0].label !== '(Empty)') {
							previewList[0].label = `IP Stream Output  ${previewList[0].stream_type || ''}`
						}
					if (previewList.length > 0) {
						previewSourcesArray = previewList
					}
				}
			} catch (e) {
				self.log('debug', 'Preview list fetch failed: ' + e.message)
			}

			// Get output list
			try {
				let outputResult = await self.DEVICE.getOutputList()
				if (outputResult && outputResult.data && Array.isArray(outputResult.data)) {
					self.STATE.outputs = outputResult.data
					outputsArray = outputResult.data.map((o) => ({
						id: String(o.id || ''),
						label: o.name || `Output ${o.id}`,
					}))
				}
			} catch (e) {
				self.log('debug', 'Output list fetch failed: ' + e.message)
			}

			self.checkVariables()

			if (JSON.stringify(self.CHOICES_STREAMS) !== JSON.stringify(streamsArray)) {
				self.log('info', 'Source list changed. Updating choices.')
				self.CHOICES_STREAMS = streamsArray
				self.CHOICES_SOURCES = streamsArray.map((s) => ({ id: s.id, url: s.url || '', label: s.label }))
				self.initActions()
			}

			if (JSON.stringify(self.CHOICES_LAYOUTS) !== JSON.stringify(layoutsArray)) {
				self.CHOICES_LAYOUTS = layoutsArray
				self.initActions()
			}

			if (JSON.stringify(self.CHOICES_POSITIONS) !== JSON.stringify(positionsArray)) {
				self.CHOICES_POSITIONS = positionsArray
				self.initActions()
			}

			if (JSON.stringify(self.CHOICES_OUTPUTS) !== JSON.stringify(outputsArray)) {
				self.CHOICES_OUTPUTS = outputsArray
				self.initActions()
			}

			if (JSON.stringify(self.CHOICES_GATEWAY_STREAMS) !== JSON.stringify(gatewayStreamsArray)) {
				self.CHOICES_GATEWAY_STREAMS = gatewayStreamsArray
				self.initActions()
			}

			if (JSON.stringify(self.CHOICES_GATEWAY_STREAMINGS) !== JSON.stringify(gatewayStreamingsArray)) {
				self.CHOICES_GATEWAY_STREAMINGS = gatewayStreamingsArray
				self.initActions()
			}

			if (JSON.stringify(self.CHOICES_PREVIEW_SOURCES) !== JSON.stringify(previewSourcesArray)) {
				self.CHOICES_PREVIEW_SOURCES = previewSourcesArray
				self.initActions()
			}
		} catch (error) {
			self.log('debug', 'Error in checkSources: ' + String(error))
		}
	},
}
