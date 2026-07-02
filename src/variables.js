module.exports = {
	initVariables() {
		let self = this
		let variables = []

		variables.push({ variableId: 'device_name', name: 'Device Name' })
		variables.push({ variableId: 'output_name', name: 'Current Output Name' })
		variables.push({ variableId: 'ip', name: 'Device IP Address' })
		variables.push({ variableId: 'firmware_version', name: 'Firmware Version' })
		variables.push({ variableId: 'software_version', name: 'Software Version' })
		variables.push({ variableId: 'serial_number', name: 'Serial Number' })
		variables.push({ variableId: 'hardware_version', name: 'Hardware Version' })
		variables.push({ variableId: 'background_type', name: 'Background Type' })
		variables.push({ variableId: 'guide_status', name: 'Guide Status' })

		variables.push({ variableId: 'sources_count', name: 'Number of Sources' })
		variables.push({ variableId: 'layouts_count', name: 'Number of Layouts' })
		variables.push({ variableId: 'gateway_streams_count', name: 'Number of Gateway Streams' })
		variables.push({ variableId: 'group_list', name: 'Source Groups List' })
		variables.push({ variableId: 'layout_list', name: 'Layouts List' })
		variables.push({ variableId: 'gateway_stream_list', name: 'Gateway Streams List' })

		variables.push({ variableId: 'mem_used', name: 'Memory Used' })
		variables.push({ variableId: 'mem_total', name: 'Memory Total' })

		self.setVariableDefinitions(variables)
	},

	checkVariables() {
		let self = this

		try {
			let variableObj = {}

			variableObj.device_name = self.STATE.device_name || ''
			variableObj.output_name = self.STATE.output_name || ''
			variableObj.ip = self.STATE.ip || ''
			variableObj.firmware_version = self.STATE.firmware_version || ''
			variableObj.software_version = self.STATE.software_version || ''
			variableObj.serial_number = self.STATE.serial_number || ''
			variableObj.hardware_version = self.STATE.hardware_version || ''
			variableObj.background_type = self.STATE.background_type || ''
			variableObj.guide_status = self.STATE.guide_status || ''
			variableObj.sources_count = self.STATE.sources_count || 0
		variableObj.layouts_count = self.STATE.layouts_count || 0
		variableObj.gateway_streams_count = self.STATE.gateway_streams_count || 0
		variableObj.group_list = self.STATE.group_list || ''
		variableObj.layout_list = self.STATE.layout_list || ''
		variableObj.gateway_stream_list = self.STATE.gateway_stream_list || ''

			if (self.STATE.mem_used !== undefined) {
				variableObj.mem_used = self.STATE.mem_used + 'KB'
			} else {
				variableObj.mem_used = ''
			}

			if (self.STATE.mem_total !== undefined) {
				variableObj.mem_total = self.STATE.mem_total + 'KB'
			} else {
				variableObj.mem_total = ''
			}

			self.setVariableValues(variableObj)
		} catch (error) {
			self.log('error', 'Error setting Variables: ' + String(error))
		}
	},
}
