const { combineRgb } = require('@companion-module/base')

module.exports = {
	initPresets: function () {
		let self = this
		let presets = []

		// Presets will be populated dynamically based on available data
		// Basic info display presets

		presets = [
			// === General ===
			{
				category: 'General',
				type: 'button',
				name: 'Reboot Device',
				style: {
					text: 'Reboot',
					size: '14',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(255, 0, 0),
				},
				steps: [
					{
						down: [{ actionId: 'reboot' }],
						up: [],
					},
				],
			},
			// === Info ===
			{
				category: 'Info',
				type: 'button',
				name: 'Display Device Info',
				style: {
					text: 'Name:$(kiloview-mediagateway:device_name)\nFW:$(kiloview-mediagateway:firmware_version)\nSW:$(kiloview-mediagateway:software_version)\nSN:$(kiloview-mediagateway:serial_number)\nHW:$(kiloview-mediagateway:hardware_version)',
					size: 'auto',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [],
				feedbacks: [],
			},
			{
				category: 'Info',
				type: 'button',
				name: 'Display IP Address',
				style: {
					text: 'IP:\n$(kiloview-mediagateway:ip)',
					size: 'auto',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [],
				feedbacks: [],
			},
		]

		// === Gateway Stream Service ===
		presets.push(
			{
				category: 'Gateway Stream',
				type: 'button',
				name: 'Add RTMP Push',
				style: {
					text: 'Add\\nRTMP\\nPush',
					size: '14',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 128, 0),
				},
				steps: [
					{
						down: [{ actionId: 'addStreamService', options: { body: '{\n  "address": "rtmp://*.*.*.*/live/syncx_300_3",\n  "conn_intv": 3,\n  "conn_timeout": 15,\n  "is_enable": true,\n  "name": "rtmp1",\n  "old_rtmp": false,\n  "password": "",\n  "protocol": "rtmp",\n  "stream_id": "976ea1a4a8d58e7879c3667139fb91c5",\n  "user": ""\n}' } }],
						up: [],
					},
				],
			},
			{
				category: 'Gateway Stream',
				type: 'button',
				name: 'Add SRT Push',
				style: {
					text: 'Add\\nSRT\\nPush',
					size: '14',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 128, 0),
				},
				steps: [
					{
						down: [{ actionId: 'addStreamService', options: { body: '{\n  "address": "",\n  "advanced": "0",\n  "bandwidth": 25,\n  "connection_mode": "Listener",\n  "encryption": "0",\n  "is_enable": true,\n  "latency": 125,\n  "listener_port": 1027,\n  "name": "12323",\n  "passphrase": "",\n  "payload_size": 1316,\n  "protocol": "srt",\n  "srt_stream_id": "",\n  "stream_id": "976ea1a4a8d58e7879c3667139fb91c5",\n  "ts_null_multiple": 0,\n  "ts_pcr_period": 20,\n  "ts_pmt_start_pid": 480,\n  "ts_pts_pcr_delay": 200,\n  "ts_service_name": "Encoder",\n  "ts_service_provider": "Encoder device",\n  "ts_start_pid": 481,\n  "ts_tables_version": 6,\n  "ts_transport_stream_id": 101\n}' } }],
						up: [],
					},
				],
			},
			{
				category: 'Gateway Stream',
				type: 'button',
				name: 'Add RTSP Push',
				style: {
					text: 'Add\\nRTSP\\nPush',
					size: '14',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 128, 0),
				},
				steps: [
					{
						down: [{ actionId: 'addStreamService', options: { body: '{\n  "auth": false,\n  "http_tunnel_port": 8554,\n  "is_enable": true,\n  "multicast_addr": "224.0.1.0",\n  "multicast_enable": false,\n  "multicast_port_max": 31004,\n  "multicast_port_min": 31000,\n  "multicast_ttl": 127,\n  "name": "rtsp1",\n  "port": 554,\n  "protocol": "rtsp",\n  "pwd": "",\n  "session": "ch01",\n  "stream_id": "976ea1a4a8d58e7879c3667139fb91c5",\n  "user": ""\n}' } }],
						up: [],
					},
				],
			},
			{
				category: 'Gateway Stream',
				type: 'button',
				name: 'Add HLS Push',
				style: {
					text: 'Add\\nHLS\\nPush',
					size: '14',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 128, 0),
				},
				steps: [
					{
						down: [{ actionId: 'addStreamService', options: { body: '{\n  "is_enable": true,\n  "max_segments": 5,\n  "media_playlist_url": "",\n  "mode": "server",\n  "name": "hls1",\n  "protocol": "hls",\n  "segment_time": 5,\n  "session": "hls1",\n  "stream_id": "976ea1a4a8d58e7879c3667139fb91c5"\n}' } }],
						up: [],
					},
				],
			},
			{
				category: 'Gateway Stream',
				type: 'button',
				name: 'Add TS Push',
				style: {
					text: 'Add\\nTS\\nPush',
					size: '14',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 128, 0),
				},
				steps: [
					{
						down: [{ actionId: 'addStreamService', options: { body: '{\n  "address": "*.*.*.*",\n  "advanced": "0",\n  "bind_port": 0,\n  "is_enable": true,\n  "name": "ts1",\n  "port": 1,\n  "protocol": "ts",\n  "stream_id": "976ea1a4a8d58e7879c3667139fb91c5",\n  "ts_null_multiple": 0,\n  "ts_pcr_period": 20,\n  "ts_pmt_start_pid": 480,\n  "ts_pts_pcr_delay": 200,\n  "ts_service_name": "Encoder",\n  "ts_service_provider": "Encoder device",\n  "ts_start_pid": 481,\n  "ts_tables_version": 6,\n  "ts_transport_stream_id": 101,\n  "ttl": 127\n}' } }],
						up: [],
					},
				],
			},
			{
				category: 'Gateway Stream',
				type: 'button',
				name: 'Add RTP Push',
				style: {
					text: 'Add\\nRTP\\nPush',
					size: '14',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 128, 0),
				},
				steps: [
					{
						down: [{ actionId: 'addStreamService', options: { body: '{\n  "address": "*.*.*.*",\n  "advanced": "0",\n  "is_enable": true,\n  "load_type": "ts",\n  "name": "rtps",\n  "port": 1026,\n  "protocol": "rtp",\n  "stream_id": "976ea1a4a8d58e7879c3667139fb91c5",\n  "ts_null_multiple": 0,\n  "ts_pcr_period": 20,\n  "ts_pmt_start_pid": 480,\n  "ts_pts_pcr_delay": 200,\n  "ts_service_name": "Encoder",\n  "ts_service_provider": "Encoder device",\n  "ts_start_pid": 481,\n  "ts_tables_version": 6,\n  "ts_transport_stream_id": 101,\n  "ttl": 127\n}' } }],
						up: [],
					},
				],
			},
		)

		// === Select Layout ===
		presets.selectLayout = [
			{
				category: 'Select Layout',
				type: 'button',
				name: 'Select Layout for Output',
				style: {
					text: 'Select Layout',
					size: '14',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 128, 0),
				},
				steps: [
					{
						down: [{ actionId: 'selectLayout' }],
						up: [],
					},
				],
			},
		]

		// === Decode Source ===
		presets.decode = [
			{
				category: 'Decode Source',
				type: 'button',
				name: 'Add RTMP Source',
				style: {
					text: 'Add\\nRTMP\\nSource',
					size: '14',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 255),
				},
				steps: [
					{
						down: [{ actionId: 'addDecodeSource', options: { body: '{\n  "audio_sync_compst": 0,\n  "buffer": "live:200:200:500:0:0",\n  "connect_speed": 5000,\n  "group_id": "4e7a1b1fd874b2cb1256bcd6ae320676",\n  "name": "df",\n  "password": "",\n  "stream_id": "",\n  "type": "rtmp",\n  "url": "rtmp://*.*.*.*/live/69669",\n  "user": ""\n}' } }],
						up: [],
					},
				],
			},
			{
				category: 'Decode Source',
				type: 'button',
				name: 'Add RTSP Source',
				style: {
					text: 'Add\\nRTSP\\nSource',
					size: '14',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(138, 43, 226),
				},
				steps: [
					{
						down: [{ actionId: 'addDecodeSource', options: { body: '{\n  "audio_sync_compst": 0,\n  "buffer": "live:200:200:500:0:0",\n  "connect_speed": 5000,\n  "group_id": "4e7a1b1fd874b2cb1256bcd6ae320676",\n  "name": "dfdf",\n  "password": "",\n  "stream_id": "",\n  "trans_mode": "tcp",\n  "type": "rtsp",\n  "url": "rtsp://*.*.*.*/live/h265test",\n  "user": ""\n}' } }],
						up: [],
					},
				],
			},
			{
				category: 'Decode Source',
				type: 'button',
				name: 'Add UDP Source',
				style: {
					text: 'Add\\nUDP\\nSource',
					size: '14',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 200),
				},
				steps: [
					{
						down: [{ actionId: 'addDecodeSource', options: { body: '{\n  "audio_sync_compst": 0,\n  "buffer": "live:200:200:500:0:0",\n  "connect_speed": 15000,\n  "group_id": "4e7a1b1fd874b2cb1256bcd6ae320676",\n  "name": "ddd",\n  "stream_id": "",\n  "type": "udp",\n  "url": "udp://*.*.*.*:6555"\n}' } }],
						up: [],
					},
				],
			},
			{
				category: 'Decode Source',
				type: 'button',
				name: 'Add SRT Source',
				style: {
					text: 'Add\\nSRT\\nSource',
					size: '14',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(139, 69, 19),
				},
				steps: [
					{
						down: [{ actionId: 'addDecodeSource', options: { body: '{\n  "address": "",\n  "audio_sync_compst": 0,\n  "bandwidth": 25,\n  "buffer": "live:200:200:500:0:0",\n  "connect_speed": 15000,\n  "connection_mode": "Listener",\n  "encryption": "none",\n  "group_id": "4e7a1b1fd874b2cb1256bcd6ae320676",\n  "latency": 125,\n  "listener_port": 1025,\n  "name": "dfdf",\n  "newUrl": "srt://*.*.*.*:9000",\n  "passphrase": "",\n  "payload_size": 1316,\n  "show_advanced": "0",\n  "srt_id": "",\n  "stream_id": "",\n  "type": "srt",\n  "url": "srt://*.*.*.*:9000"\n}' } }],
						up: [],
					},
				],
			},
			{
				category: 'Decode Source',
				type: 'button',
				name: 'Add HLS Source',
				style: {
					text: 'Add\\nHLS\\nSource',
					size: '14',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 128, 128),
				},
				steps: [
					{
						down: [{ actionId: 'addDecodeSource', options: { body: '{\n  "audio_sync_compst": 0,\n  "buffer": "live:200:200:500:0:0",\n  "connect_speed": 5000,\n  "group_id": "4e7a1b1fd874b2cb1256bcd6ae320676",\n  "name": "dfdf",\n  "stream_id": "",\n  "type": "http",\n  "url": "http://*.*.*.*/hls/main/playlist.m3u8"\n}' } }],
						up: [],
					},
				],
			},
			{
				category: 'Decode Source',
				type: 'button',
				name: 'Add Zixi Source',
				style: {
					text: 'Add\\nZixi\\nSource',
					size: '14',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(255, 140, 0),
				},
				steps: [
					{
						down: [{ actionId: 'addDecodeSource', options: { body: '{\n  "audio_sync_compst": 0,\n  "buffer": "live:200:200:500:0:0",\n  "connect_speed": 5000,\n  "encryption": "none",\n  "group_id": "4e7a1b1fd874b2cb1256bcd6ae320676",\n  "name": "sdfsd",\n  "newUrl": "zixi://demo.zixi.com:2077/clocks",\n  "passphrase": "",\n  "password": "",\n  "stream_id": "",\n  "type": "zixi",\n  "url": "zixi://demo.zixi.com:2077/clocks",\n  "user": "",\n  "zixi_back_url": "",\n  "zixi_fec_block_ms": 50,\n  "zixi_fec_overhead": 30,\n  "zixi_max_latency": 500,\n  "zixi_stream_provider_id": "clocks",\n  "zixi_udp_out_port": 2077\n}' } }],
						up: [],
					},
				],
			},
			{
				category: 'Decode Source',
				type: 'button',
				name: 'Add RTP Source',
				style: {
					text: 'Add\\nRTP\\nSource',
					size: '14',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(75, 0, 130),
				},
				steps: [
					{
						down: [{ actionId: 'addDecodeSource', options: { body: '{\n  "audio_sync_compst": 0,\n  "buffer": "live:200:200:500:0:0",\n  "connect_speed": 15000,\n  "group_id": "4e7a1b1fd874b2cb1256bcd6ae320676",\n  "name": "dfd",\n  "sdp_content": "",\n  "stream_id": "",\n  "type": "rtp",\n  "url": "rtp://*.*.*.*:1026"\n}' } }],
						up: [],
					},
				],
			},
		]
		presets.push(...presets.decode)
		presets.push(...presets.selectLayout)

		// === Source Group ===
		presets.sourceGroup = [
			{
				category: 'Source Group',
				type: 'button',
				name: 'Add Source Group',
				style: {
					text: 'Add\\nSource\\nGroup',
					size: '14',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 100, 0),
				},
				steps: [
					{
						down: [{ actionId: 'addSourceGroup', options: { name: '' } }],
						up: [],
					},
				],
			},
			{
				category: 'Source Group',
				type: 'button',
				name: 'Remove Source Group',
				style: {
					text: 'Remove\\nSource\\nGroup',
					size: '14',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(139, 0, 0),
				},
				steps: [
					{
						down: [{ actionId: 'removeSourceGroup' }],
						up: [],
					},
				],
			},
		]
		presets.push(...presets.sourceGroup)

		// === Playback ===
		presets.push({
			category: 'Playback',
			type: 'button',
			name: 'Start Stream Playback',
			style: {
				text: 'Start\\nPlay',
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 128, 0),
			},
			steps: [
				{
					down: [{ actionId: 'startPlay' }],
					up: [],
				},
			],
		})

		presets.push({
			category: 'Playback',
			type: 'button',
			name: 'Stop Stream Playback',
			style: {
				text: 'Stop\\nPlay',
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(255, 0, 0),
			},
			steps: [
				{
					down: [{ actionId: 'stopPlay' }],
					up: [],
				},
			],
		})

		// === Gateway Push ===
		presets.push({
			category: 'Gateway Push',
			type: 'button',
			name: 'Start Gateway Push',
			style: {
				text: 'Start\\nPush',
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 100, 0),
			},
			steps: [
				{
					down: [{ actionId: 'startPush' }],
					up: [],
				},
			],
		})

		presets.push({
			category: 'Gateway Push',
			type: 'button',
			name: 'Stop Gateway Push',
			style: {
				text: 'Stop\\nPush',
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(139, 0, 0),
			},
			steps: [
				{
					down: [{ actionId: 'stopPush' }],
					up: [],
				},
			],
		})

		// === Multi Output ===
		presets.push({
			category: 'Multi Output',
			type: 'button',
			name: 'Multi Out Switch',
			style: {
				text: 'Multi\\nOut\\nSwitch',
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 255),
			},
			steps: [
				{
					down: [{ actionId: 'multiOutSwitch' }],
					up: [],
				},
			],
		})

		// === HDMI Output ===
		presets.push({
			category: 'HDMI Output',
			type: 'button',
			name: 'Enable Output1 HDMI',
			style: {
				text: 'Output1\\nHDMI\\nChoose',
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 255),
			},
			steps: [
				{
					down: [{ actionId: 'enableOutputHdmi1' }],
					up: [],
				},
			],
		})

		presets.push({
			category: 'HDMI Output',
			type: 'button',
			name: 'Enable Output2 HDMI',
			style: {
				text: 'Output2\\nHDMI\\nChoose',
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 255),
			},
			steps: [
				{
					down: [{ actionId: 'enableOutputHdmi2' }],
					up: [],
				},
			],
		})

		self.setPresetDefinitions(presets)
	},
}
