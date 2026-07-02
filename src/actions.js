module.exports = {
	initActions: function () {
		let self = this
		let actions = {}

		actions.reboot = {
			name: 'Reboot Device',
			options: [],
			callback: async function () {
				await self.DEVICE.reboot()
			},
		}

		actions.startPlay = {
			name: 'Start Stream Playback',
			options: [
				{
					type: 'dropdown',
					label: 'Output',
					id: 'output_id',
					default: self.CHOICES_OUTPUTS[0]?.id || 'null',
					choices: self.CHOICES_OUTPUTS,
				},
				{
					type: 'dropdown',
					label: 'Layout',
					id: 'layout_id',
					default: self.CHOICES_LAYOUTS[0]?.id || 'null',
					choices: self.CHOICES_LAYOUTS,
				},
				{
					type: 'dropdown',
					label: 'Position',
					id: 'pos_id',
					default: self.CHOICES_POSITIONS[0]?.id || 1,
					choices: self.CHOICES_POSITIONS,
				},
				{
					type: 'dropdown',
					label: 'Stream',
					id: 'stream_id',
					default: self.CHOICES_STREAMS[0]?.id || 'null',
					choices: self.CHOICES_STREAMS,
				},
			],
			callback: async function (action) {
				let { output_id, layout_id, pos_id, stream_id } = action.options
				if (!stream_id || stream_id === 'null') {
					self.log('warn', 'No stream selected')
					return
				}

				let stream = self.CHOICES_STREAMS.find((s) => s.id === stream_id)
				let params = self.DEVICE.buildAssignSourceParams(
					output_id,
					pos_id,
					{
						id: stream_id,
						name: stream?.name || '',
						url: stream?.url || '',
					},
					layout_id
				)
				await self.DEVICE.setSource(params)
				await self.DEVICE.startPlay({ stream_id })
			},
		}

		actions.stopPlay = {
			name: 'Stop Stream Playback',
			options: [
				{
					type: 'dropdown',
					label: 'Output',
					id: 'output_id',
					default: self.CHOICES_OUTPUTS[0]?.id || 'null',
					choices: self.CHOICES_OUTPUTS,
				},
				{
					type: 'dropdown',
					label: 'Layout',
					id: 'layout_id',
					default: self.CHOICES_LAYOUTS[0]?.id || 'null',
					choices: self.CHOICES_LAYOUTS,
				},
				{
					type: 'dropdown',
					label: 'Position',
					id: 'pos_id',
					default: self.CHOICES_POSITIONS[0]?.id || 1,
					choices: self.CHOICES_POSITIONS,
				},
			],
			callback: async function (action) {
				let { output_id, layout_id, pos_id } = action.options

				// Find stream_id at this layout/position
				let streamId = ''
				let layout = (self.STATE.layouts || []).find((l) => String(l.layout_id || l.id) === String(layout_id))
				if (layout && Array.isArray(layout.position)) {
					let pos = layout.position.find((p) => p.id === pos_id || p.number === pos_id)
					if (pos) {
						streamId = pos.stream_id || ''
					}
				}

				if (streamId) {
					await self.DEVICE.stopPlay({ stream_id: streamId })
				}
				await self.DEVICE.removeSource({
					output_id: String(output_id),
					pos_id: parseInt(pos_id),
				})
			},
		}

		actions.selectLayout = {
			name: 'Select Layout for Output',
			options: [
				{
					type: 'dropdown',
					label: 'Output',
					id: 'output_id',
					default: self.CHOICES_OUTPUTS[0]?.id || '1',
					choices: self.CHOICES_OUTPUTS,
				},
				{
					type: 'dropdown',
					label: 'Layout',
					id: 'layout_id',
					default: self.CHOICES_LAYOUTS[0]?.id || 'null',
					choices: self.CHOICES_LAYOUTS,
				},
			],
			callback: async function (action) {
				let outputId = action.options.output_id
				let layoutId = action.options.layout_id
				if (!outputId || outputId === 'null') {
					self.log('warn', 'Select Layout: missing output')
					return
				}
				if (!layoutId || layoutId === 'null') {
					self.log('warn', 'Select Layout: missing layout')
					return
				}
				self.log('info', 'Select Layout: output_id=' + outputId + ' layout_id=' + layoutId)
				try {
					let result = await self.DEVICE.selectLayout({ output_id: outputId, layout_id: parseInt(layoutId) })
					self.log('info', 'Select Layout result: ' + JSON.stringify(result))
				} catch (e) {
					self.log('error', 'Select Layout API error: ' + e.message)
				}
			},
		}

		actions.startPush = {
			name: 'Start Gateway Push',
			options: [
				{
					type: 'dropdown',
					label: 'Gateway Stream',
					id: 'gateway_id',
					default: self.CHOICES_GATEWAY_STREAMS[0]?.id || 'null',
					choices: self.CHOICES_GATEWAY_STREAMS,
				},
				{
					type: 'dropdown',
					label: 'Source',
					id: 'stream_id',
					default: self.CHOICES_STREAMS[0]?.id || 'null',
					choices: self.CHOICES_STREAMS,
				},
			],
			callback: async function (action) {
				let { gateway_id, stream_id } = action.options
				if (!stream_id || stream_id === 'null') {
					self.log('warn', 'No source stream selected')
					return
				}
				if (!gateway_id || gateway_id === 'null') {
					self.log('warn', 'No gateway stream selected')
					return
				}

				await self.DEVICE.bindSrcGateway({ id: gateway_id, stream_id: stream_id })
				await self.DEVICE.batchEnableGatewayStream({
					enable: true,
					ids: [{ id: gateway_id }],
				})
			},
		}

		actions.stopPush = {
			name: 'Stop Gateway Push',
			options: [
				{
					type: 'dropdown',
					label: 'Gateway Stream',
					id: 'gateway_id',
					default: self.CHOICES_GATEWAY_STREAMINGS[0]?.id || 'null',
					choices: self.CHOICES_GATEWAY_STREAMINGS,
				},
			],
			callback: async function (action) {
				let { gateway_id } = action.options
				if (!gateway_id || gateway_id === 'null') {
					self.log('warn', 'No gateway stream selected')
					return
				}

				await self.DEVICE.batchEnableGatewayStream({
					enable: false,
					ids: [{ id: gateway_id }],
				})

				await self.checkSources()
			},
		}

		actions.multiOutSwitch = {
			name: 'Multi Out Switch',
			options: [
				{
					type: 'dropdown',
					label: 'Output',
					id: 'enable',
					default: self.CHOICES_MULTI_OUT.find((c) => c.enable)?.id || 1,
					choices: self.CHOICES_MULTI_OUT,
				},
			],
			callback: async function (action) {
				let enable = parseInt(action.options.enable)
				await self.DEVICE.multiOutSwitch({
					enable: enable,
					skip_switch_confirm: true,
				})
				await self.checkSources()
			},
		}

		function buildHdmiAction(outputId) {
			let suffix = outputId === 1 ? '1' : '2'
			let videoChoices = outputId === 1 ? 'CHOICES_HDMI_VIDEO1' : 'CHOICES_HDMI_VIDEO2'
			let audioChoices = outputId === 1 ? 'CHOICES_HDMI_AUDIO1' : 'CHOICES_HDMI_AUDIO2'
			return {
				name: `Enable Output${suffix} HDMI`,
				options: [
					{
						type: 'dropdown',
						label: 'Video HDMI Device',
						id: 'video_id',
						default: self[videoChoices][0]?.id || 'null',
						choices: self[videoChoices],
					},
					{
						type: 'dropdown',
						label: 'Video Enable',
						id: 'video_enable',
						default: 'true',
						choices: [
							{ id: 'true', label: 'On' },
							{ id: 'false', label: 'Off' },
						],
					},
					{
						type: 'dropdown',
						label: 'Audio HDMI Device',
						id: 'audio_id',
						default: self[audioChoices][0]?.id || 'null',
						choices: self[audioChoices],
					},
					{
						type: 'dropdown',
						label: 'Audio Enable',
						id: 'audio_enable',
						default: 'true',
						choices: [
							{ id: 'true', label: 'On' },
							{ id: 'false', label: 'Off' },
						],
					},
					{
						type: 'number',
						label: 'Volume (dB, -51 to 20)',
						id: 'volume',
						default: -5,
						min: -51,
						max: 20,
					},
				],
				callback: async function (action) {
					let { video_id, video_enable, audio_id, audio_enable, volume } = action.options
					let output_id = String(outputId)

					if (video_id && video_id !== 'null') {
						let vIface = self[videoChoices].find((v) => v.id === video_id)
						let params = Object.assign(
							{ type: 'video', intf_id: parseInt(video_id) },
							(vIface && vIface._iface) || {},
							{
								output_id: output_id,
								id: parseInt(video_id),
								intf_id: parseInt(video_id),
								enable: video_enable === 'true',
							}
						)
						self.log('debug', 'enableOutputHdmi' + suffix + ' video params: ' + JSON.stringify(params))
						await self.DEVICE.setOutputInterface(params)
					}

					if (audio_id && audio_id !== 'null') {
						let aIface = self[audioChoices].find((a) => a.id === audio_id)
						let params = Object.assign(
							{ type: 'audio', intf_id: parseInt(audio_id) },
							(aIface && aIface._iface) || {},
							{
								output_id: output_id,
								id: parseInt(audio_id),
								intf_id: parseInt(audio_id),
								enable: audio_enable === 'true',
								volume: parseInt(volume),
							}
						)
						self.log('debug', 'enableOutputHdmi' + suffix + ' audio params: ' + JSON.stringify(params))
						await self.DEVICE.setOutputInterface(params)
					}
				},
			}
		}

		actions.enableOutputHdmi1 = buildHdmiAction(1)
		actions.enableOutputHdmi2 = buildHdmiAction(2)

		actions.addPreviewSource = {
			name: 'Add Preview Source',
			options: [
				{
					type: 'dropdown',
					label: 'Preview Position',
					id: 'pos_id',
					default: self.CHOICES_PREVIEW_SOURCES[0]?.id || 'null',
					choices: self.CHOICES_PREVIEW_SOURCES,
				},
				{
					type: 'dropdown',
					label: 'Stream',
					id: 'stream_id',
					default: self.CHOICES_STREAMS[0]?.id || 'null',
					choices: self.CHOICES_STREAMS,
				},
			],
			callback: async function (action) {
				let posId = action.options.pos_id
				let streamId = action.options.stream_id
				if (posId === undefined || posId === null || posId === 'null' || !streamId || streamId === 'null') {
					self.log('warn', 'Add Preview Source: missing preview position or stream')
					return
				}
				let stream = self.CHOICES_STREAMS.find((s) => s.id === streamId)
				if (!stream) {
					self.log('warn', 'Add Preview Source: stream not found')
					return
				}
				let params = self.DEVICE.buildPreviewAssignParams(stream, posId)
				await self.DEVICE.modifyPreviewSource(params)
				await self.checkSources()
			},
		}

		actions.removePreviewSource = {
			name: 'Remove Preview Source',
			options: [
				{
					type: 'dropdown',
					label: 'Preview Position',
					id: 'pos_id',
					default: self.CHOICES_PREVIEW_SOURCES[0]?.id || 'null',
					choices: self.CHOICES_PREVIEW_SOURCES,
				},
			],
			callback: async function (action) {
				let posId = action.options.pos_id
				if (posId === undefined || posId === null || posId === 'null' || posId === '') {
					self.log('warn', 'Remove Preview Source: no position selected')
					return
				}
				await self.DEVICE.removePreviewSource({ pos_id: parseInt(posId) })
				await self.checkSources()
			},
		}

		actions.addStreamService = {
			name: 'Add Gateway Stream Service',
			options: [
				{
					type: 'textinput',
					label: 'JSON Body',
					id: 'body',
					default: '{\n  "protocol": "",\n  "name": "",\n  "dest_url": ""\n}',
					useVariables: true,
				},
			],
			callback: async function (action) {
				let body = action.options.body
				if (!body) {
					self.log('warn', 'Add Gateway Stream Service: body is empty')
					return
				}
				try {
					let params = JSON.parse(body)
					await self.DEVICE.addGatewayStream(params)
					await self.checkSources()
				} catch (e) {
					self.log('error', 'Add Gateway Stream Service: ' + e.message)
				}
			},
		}

		actions.removeStreamService = {
			name: 'Remove Gateway Stream Service',
			options: [
				{
					type: 'dropdown',
					label: 'Gateway Stream',
					id: 'gateway_id',
					default: self.CHOICES_GATEWAY_STREAMS[0]?.id || 'null',
					choices: self.CHOICES_GATEWAY_STREAMS,
				},
			],
			callback: async function (action) {
				let gatewayId = action.options.gateway_id
				if (!gatewayId || gatewayId === 'null') {
					self.log('warn', 'Remove Gateway Stream Service: no stream selected')
					return
				}
				await self.DEVICE.deleteGatewayStream({ ids: [{ id: gatewayId }] })
				await self.checkSources()
			},
		}

		actions.addDecodeSource = {
			name: 'Add Decode Source',
			options: [
				{
					type: 'textinput',
					label: 'JSON Body',
					id: 'body',
					default: '{\n  "type": "",\n  "url": "",\n  "name": "",\n  "group_id": ""\n}',
					useVariables: true,
				},
			],
			callback: async function (action) {
				let body = action.options.body
				if (!body) {
					self.log('warn', 'Add Decode Source: body is empty')
					return
				}
				try {
					let params = JSON.parse(body)
					await self.DEVICE.addStream(params)
					await self.checkSources()
				} catch (e) {
					self.log('error', 'Add Decode Source: ' + e.message)
				}
			},
		}

		actions.removeDecodeSource = {
			name: 'Remove Decode Source',
			options: [
				{
					type: 'dropdown',
					label: 'Source',
					id: 'stream_id',
					default: self.CHOICES_STREAMS[0]?.id || 'null',
					choices: self.CHOICES_STREAMS,
				},
			],
			callback: async function (action) {
				let streamId = action.options.stream_id
				if (!streamId || streamId === 'null') {
					self.log('warn', 'Remove Decode Source: no source selected')
					return
				}
				let stream = self.CHOICES_STREAMS.find((s) => s.id === streamId)
				if (!stream) {
					self.log('warn', 'Remove Decode Source: source not found')
					return
				}
				await self.DEVICE.removeStream({ group_id: stream.group_id, stream_id: streamId })
				await self.checkSources()
			},
		}

		actions.previewSources = {
			name: 'Preview Sources',
			options: [
				{
					type: 'dropdown',
					label: 'Preview Source',
					id: 'preview_id',
					default: self.CHOICES_PREVIEW_SOURCES[0]?.id || 'null',
					choices: self.CHOICES_PREVIEW_SOURCES,
				},
			],
			callback: async function (action) {
				self.log('info', 'Preview source selected: ' + action.options.preview_id)
			},
		}

		actions.addSourceGroup = {
			name: 'Add Source Group',
			options: [
				{
					type: 'textinput',
					label: 'Group Name',
					id: 'name',
					default: '',
				},
			],
			callback: async function (action) {
				let name = action.options.name
				if (!name) {
					self.log('warn', 'Add Source Group: name is empty')
					return
				}
				await self.DEVICE.addGroup({ name: name })
				await self.checkSources()
			},
		}

		actions.removeSourceGroup = {
			name: 'Remove Source Group',
			options: [
				{
					type: 'dropdown',
					label: 'Group',
					id: 'group_id',
					default: self.CHOICES_GROUPS[0]?.id || 'null',
					choices: self.CHOICES_GROUPS,
				},
			],
			callback: async function (action) {
				let groupId = action.options.group_id
				if (!groupId || groupId === 'null') {
					self.log('warn', 'Remove Source Group: no group selected')
					return
				}
				await self.DEVICE.removeGroup({ group_id: groupId })
				await self.checkSources()
			},
		}

		self.setActionDefinitions(actions)
	},
}
