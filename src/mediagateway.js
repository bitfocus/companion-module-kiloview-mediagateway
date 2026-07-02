const http = require('http')
const https = require('https')

class MediaGateway {
	connection_info = {
		ip: '',
		username: '',
		password: '',
		protocol: 'http',
		port: 99,
	}

	session = {
		token: '',
	}

	owner = null

	log(level, message) {
		this.owner.log(level, message)
	}

	constructor(owner, ip, username, password, protocol = 'http', port = 99, timeout = 2000) {
		this.owner = owner
		this.connection_info = {
			ip,
			username,
			password,
			protocol,
			port,
		}

		this.baseURL = `${protocol}://${ip}:${port}/api`

		const agentOpts = {
			keepAlive: true,
			keepAliveMsecs: 30000,
			maxSockets: 5,
		}

		this.httpAgent = new http.Agent(agentOpts)
		this.httpsAgent = new https.Agent({
			...agentOpts,
			rejectUnauthorized: false,
		})

		this.authorized = false
	}

	_request(method, path, data, useAuth = true) {
		return new Promise((resolve, reject) => {
			const isHttps = this.connection_info.protocol === 'https'
			const urlObj = new URL(`${this.baseURL}${path}`)
			const headers = {
				'Content-Type': 'application/json',
				'Connection': 'keep-alive',
			}

			if (useAuth && this.session.token) {
				headers['app'] = this.session.token
			}

			const options = {
				hostname: urlObj.hostname,
				port: urlObj.port || (isHttps ? 443 : 80),
				path: urlObj.pathname + urlObj.search,
				method: method,
				rejectUnauthorized: false,
				agent: isHttps ? this.httpsAgent : this.httpAgent,
				headers,
			}

			const req = (isHttps ? https : http).request(options, (res) => {
				let body = ''
				res.on('data', (chunk) => { body += chunk })
				res.on('end', () => {
					try {
						resolve(JSON.parse(body))
					} catch (e) {
						resolve(body)
					}
				})
			})

			req.on('error', (err) => {
				let error = new Error(err.message)
				error.name = 'MediaGatewayError'
				reject(error)
			})

			if (data && (method === 'POST')) {
				req.write(JSON.stringify(data))
			}

			req.end()
		})
	}

	setAuthorized(auth) {
		this.authorized = auth
	}

	async authorize() {
		try {
			const { username, password } = this.connection_info

			const params = {
				username: username,
				password: password,
			}

			let result = await this._request('POST', '/users/login', params, false)

			if (result && result.result !== 'ok') {
				let error = new Error(result.msg || 'Authorization failed')
				error.name = 'MediaGatewayError'
				throw error
			}

			if (result.data && result.data.token) {
				this.session = {
					token: result.data.token,
				}
				this.alias = result.data.alias || username
				this.authorized = true
				return true
			} else {
				let error = new Error('No token in login response')
				error.name = 'MediaGatewayError'
				throw error
			}
		} catch (error) {
			if (error.name !== 'MediaGatewayError') {
				let newError = new Error('Could not reach device')
				newError.name = 'MediaGatewayError'
				throw newError
			}
			throw error
		}
	}

	async authGet(url, params = {}) {
		if (!this.authorized) {
			await this.authorize()
		}

		const queryString = new URLSearchParams(params).toString()
		const fullPath = url + (queryString ? '?' + queryString : '')

		let result = await this._request('GET', fullPath)

		if (result && result.msg === '301') {
			await this.authorize()
			return this.authGet(url, params)
		}

		if (result && result.result && result.result !== 'ok') {
			let error = new Error(result.msg || 'API Error')
			error.name = 'MediaGatewayError'
			throw error
		}

		return result
	}

	async authPost(url, data = {}) {
		if (!this.authorized) {
			await this.authorize()
		}

		let result = await this._request('POST', url, data)

		if (result && result.msg === '301') {
			await this.authorize()
			return this.authPost(url, data)
		}

		if (result && result.result && result.result !== 'ok') {
			let error = new Error(result.msg || 'API Error')
			error.name = 'MediaGatewayError'
			throw error
		}

		return result
	}

	// === Output APIs ===

	async getOutput() {
		return await this.authPost('/output/get')
	}

	async getOutputList() {
		return await this.authGet('/output/list')
	}

	async setOutputResolution(resolution) {
		return await this.authPost('/output/resolution/set', resolution)
	}

	async getResolutionList() {
		return await this.authGet('/output/resolution/list')
	}

	async setOutputInterface(params) {
		return await this.authPost('/output/interfaces/set', params)
	}

	async getOutputInterfaces(params) {
		return await this.authGet('/output/interfaces/get', params)
	}

	async setSource(params) {
		return await this.authPost('/output/source/set', params)
	}

	buildAssignSourceParams(outputId, posId, stream, layoutId) {
		return {
			from: {
				type: 'source',
				output_id: String(outputId),
			},
			to: {
				type: 'output',
				output_id: String(outputId),
				pos_id: parseInt(posId),
				stream_id: stream.id,
				stream_name: stream.name || '',
				stream_url: stream.url || '',
				layout_id: layoutId,
			},
		}
	}

	async removeSource(params) {
		return await this.authPost('/output/source/remove', params)
	}

	async setMute(params) {
		return await this.authPost('/output/mute/set', params)
	}

	async getAudioMix(params) {
		return await this.authPost('/output/audiomix/get', params)
	}

	async setAudioParam(params) {
		return await this.authPost('/output/audiomix/set', params)
	}

	async addAudio(params) {
		return await this.authPost('/output/audiomix/add', params)
	}

	async removeAudio(params) {
		return await this.authPost('/output/audiomix/remove', params)
	}

	async getAudioSound(params) {
		return await this.authPost('/output/audio/sound', params)
	}

	async setVumeter(params) {
		return await this.authPost('/output/vumeter/set', params)
	}

	async getTsProgram(params) {
		return await this.authPost('/output/ts/program/get', params)
	}

	async setTsProgram(params) {
		return await this.authPost('/output/ts/program/set', params)
	}

	async setBorder(params) {
		return await this.authPost('/output/border/set', params)
	}

	async getBorder(params) {
		return await this.authPost('/output/border/get', params)
	}

	async setBackground(params) {
		return await this.authPost('/output/background/set', params)
	}

	async getBackground(params) {
		return await this.authPost('/output/background/get', params)
	}

	async getEncodeParam(params) {
		return await this.authPost('/output/encode/get', params)
	}

	async setEncodeParam(params) {
		return await this.authPost('/output/encode/set', params)
	}

	// === Source APIs ===

	async getGroupList() {
		return await this.authPost('/source/groups/list', { is_need_stream: true, preview: false })
	}

	async addGroup(params) {
		return await this.authPost('/source/groups/add', params)
	}

	async renameGroup(params) {
		return await this.authPost('/source/groups/rename', params)
	}

	async removeGroup(params) {
		return await this.authPost('/source/groups/remove', params)
	}

	async addStream(params) {
		return await this.authPost('/source/groups/streams/add', params)
	}

	async removeStream(params) {
		return await this.authPost('/source/groups/streams/remove', params)
	}

	async modifyStream(params) {
		return await this.authPost('/source/groups/streams/modify', params)
	}

	async copyStream(params) {
		return await this.authPost('/source/groups/streams/copy', params)
	}

	async moveStream(params) {
		return await this.authPost('/source/groups/streams/move', params)
	}

	async startPlay(params) {
		return await this.authPost('/source/streams/startPlay', params)
	}

	async stopPlay(params) {
		return await this.authPost('/source/streams/stopPlay', params)
	}

	async refreshSources() {
		return await this.authGet('/source/refresh')
	}

	// === Layout APIs ===

	async getLayoutList() {
		return await this.authGet('/layout/list')
	}

	async selectLayout(params) {
		return await this.authPost('/layout/select', params)
	}

	async addLayout(params) {
		return await this.authPost('/layout/add', params)
	}

	async removeLayout(params) {
		return await this.authPost('/layout/remove', params)
	}

	async renameLayout(params) {
		return await this.authPost('/layout/rename', params)
	}

	async getTemplateList() {
		return await this.authGet('/layout/template/list')
	}

	// === NDI Discovery APIs ===

	async getAllDiscoveryWays() {
		return await this.authGet('/ndi/discovery/all')
	}

	async getDiscoverySources(params) {
		return await this.authPost('/ndi/discovery/sources', params)
	}

	async addManualTarget(params) {
		return await this.authPost('/ndi/discovery/manual/add', params)
	}

	async addAutoTarget(params) {
		return await this.authPost('/ndi/discovery/auto/add', params)
	}

	async addDiscoveryServerTarget(params) {
		return await this.authPost('/ndi/discovery/server/add', params)
	}

	async deleteAutoSource(params) {
		return await this.authPost('/ndi/discovery/auto/del', params)
	}

	async deleteServerSource(params) {
		return await this.authPost('/ndi/discovery/server/del', params)
	}

	// === System APIs ===

	async reboot() {
		return await this.authGet('/sys/reboot')
	}

	async restore() {
		return await this.authGet('/sys/restore')
	}

	async getDeviceName() {
		return await this.authGet('/sys/device/get')
	}

	async setDeviceName(params) {
		return await this.authPost('/sys/device/set', params)
	}

	async getIP() {
		return await this.authPost('/sys/ip/get')
	}

	async setPreset(params) {
		return await this.authPost('/sys/preset/set', params)
	}

	async getPreset() {
		return await this.authGet('/sys/preset/get')
	}

	// === Firmware / Info APIs ===

	async getDeviceInfo() {
		return await this.authGet('/info/get')
	}

	// === Maintenance APIs ===

	async getUsage() {
		return await this.authGet('/maintenance/usage_get')
	}

	async getRebootStatus() {
		return await this.authGet('/maintenance/reboot/get')
	}

	async setReboot(params) {
		return await this.authPost('/maintenance/reboot/set', params)
	}

	async getScreenSettings() {
		return await this.authGet('/maintenance/screen/settings')
	}

	async setScreen(params) {
		return await this.authPost('/maintenance/screen/set', params)
	}

	// === Network APIs ===

	async getNetworkInfo() {
		return await this.authGet('/network/get')
	}

	async getHTTPConfig() {
		return await this.authGet('/network/http/get')
	}

	// === Gateway APIs ===

	async getGatewayStreamList() {
		return await this.authGet('/gate/stream/list')
	}

	async addGatewayStream(params) {
		return await this.authPost('/gate/stream/add', params)
	}

	async deleteGatewayStream(params) {
		return await this.authPost('/gate/stream/delete', params)
	}

	async updateGatewayStream(params) {
		return await this.authPost('/gate/stream/update', params)
	}

	async batchEnableGatewayStream(params) {
		return await this.authPost('/gate/stream/batch_enable', params)
	}

	async bindSrcGateway(params) {
		return await this.authPost('/gate/stream/bind_src', params)
	}

	async queryMultiOutState(params) {
		return await this.authPost('/gate/stream/multi_out_query', params)
	}

	// === Multi Out APIs ===

	async getMultiOutState() {
		return await this.authPost('/gate/stream/multi_out_query', {})
	}

	async multiOutSwitch(params) {
		return await this.authPost('/gate/stream/multi_out_enable', params)
	}

	// === Preview APIs ===

	async getPreviewList() {
		return await this.authGet('/preview/get')
	}

	async modifyPreviewSource(params) {
		return await this.authPost('/preview/source/modify', params)
	}

	async removePreviewSource(params) {
		return await this.authPost('/preview/source/remove', params)
	}

	buildPreviewAssignParams(stream, posId) {
		let posIdNum = parseInt(posId)
		let to = {
			type: 'preview',
			stream_id: stream.id,
			stream_name: stream.name || stream.label || '',
			stream_url: stream.url || '',
			output_id: '1',
			layout_id: '',
		}
		if (posIdNum > 0) {
			to.pos_id = posIdNum
		}
		return {
			from: {
				type: 'source',
				stream_id: stream.id,
				stream_name: stream.name || stream.label || '',
				stream_url: stream.url || '',
				pos_id: '',
				output_id: '1',
				layout_id: '',
			},
			to: to,
		}
	}

	// === Guide APIs ===

	async getGuideStatus() {
		return await this.authGet('/guide/get')
	}

	async setGuideStatus(params) {
		return await this.authPost('/guide/set', params)
	}

	// === User APIs ===

	async getUserList() {
		return await this.authPost('/users/list')
	}

	async getAuthInfo() {
		return await this.authGet('/users/auth_info_get')
	}

	async checkSession() {
		return await this.authGet('/users/session/check')
	}

	// === Report APIs ===

	async getSystemInfoReport() {
		return await this.authGet('/report/system_info')
	}
}

module.exports = MediaGateway
