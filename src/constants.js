module.exports = {
	POLLINGRATE: 1000,
	POLLINGRATE_SOURCES: 10000,
	RECONNECT_TIME: 30000,
	DEVICE: undefined,

	CHOICES_SOURCES: [{ id: 'null', url: '', label: '- No sources available -' }],
	CHOICES_STREAMS: [{ id: 'null', label: '- No streams available -' }],
	CHOICES_LAYOUTS: [{ id: 'null', label: '- No layouts available -' }],
	CHOICES_POSITIONS: [{ id: 1, label: 'Position 1' }],
	CHOICES_OUTPUTS: [{ id: 'null', label: '- No outputs available -' }],
	CHOICES_GATEWAY_STREAMS: [{ id: 'null', label: '- No gateway streams available -' }],
	CHOICES_GATEWAY_STREAMINGS: [{ id: 'null', label: '- No active push streams -' }],
	CHOICES_PREVIEW_SOURCES: [{ id: 'null', label: '- No active previews -' }],

	CHOICES_MULTI_OUT: [
		{ id: 1, label: 'Output 1 (Active)', enable: true },
		{ id: 2, label: 'Output 2', enable: false },
	],

	STATE: {
		output_name: 'N/A',
		device_name: 'N/A',
		ip: 'N/A',
		firmware_version: 'N/A',
		software_version: 'N/A',
		serial_number: 'N/A',
		hardware_version: 'N/A',
		background_type: 'N/A',
		sources_count: 0,
		layouts_count: 0,
		gateway_streams_count: 0,
		group_list: '',
		layout_list: '',
		gateway_stream_list: '',
		groups: [],
		layouts: [],
		gateway_streams: [],
		outputs: [],
		preview_sources: [],
	},

	CHOICES_OUTPUT_INTERFACE: [],

	CHOICES_RESOLUTIONS: [],

	CHOICES_BACKGROUND_TYPE: [
		{ id: 'black', label: 'Black' },
		{ id: 'image', label: 'Image' },
		{ id: 'color', label: 'Color' },
	],

	CHOICES_MUTE: [
		{ id: '0', label: 'Unmute' },
		{ id: '1', label: 'Mute' },
	],

	CHOICES_GUIDE_STATUS: [
		{ id: 'on', label: 'On' },
		{ id: 'off', label: 'Off' },
	],

	INTERVAL: null,
	INTERVAL_SOURCES: null,
	RECONNECT_INTERVAL: null,
}
