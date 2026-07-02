# Kiloview Media Gateway

This module will allow you to control Kiloview Media Gateway devices(MG300V2/RMG300V2). Provides full API integration for managing outputs, sources, layouts, NDI discovery, gateway streams, and system settings.

## Configuration

- **Device IP / Host** — The IP address or hostname of the Media Gateway device
- **Port** — HTTP API port (default: 99)
- **Protocol** — HTTP or HTTPS
- **Username** — API login username
- **Password** — API login password

## Actions

### Playback
- **Start Stream Playback** — Assign a source to a position on an output/layout and start playback. Options: Output, Layout, Position, Stream (dropdowns)
- **Stop Stream Playback** — Stop playback and remove source from a position. Options: Output, Layout, Position (dropdowns)

### Layout
- **Select Layout for Output** — Select a layout for an output. Options: Output, Layout (dropdowns)

### Gateway Stream
- **Start Gateway Push** — Bind a source to a gateway stream and start pushing. Options: Gateway Stream, Source (dropdowns)
- **Stop Gateway Push** — Stop pushing a gateway stream. Options: Gateway Stream (dropdown, active streams only)
- **Add Gateway Stream Service** — Add a new gateway stream service (RTMP/SRT/RTSP/HLS/TS/RTP). Options: JSON Body (text input)
- **Remove Gateway Stream Service** — Delete a gateway stream service. Options: Gateway Stream (dropdown)

### Multi Output
- **Multi Out Switch** — Switch between multi output modes. Options: Output (dropdown with Active indicator)

### Preview
- **Add Preview Source** — Assign a stream to a preview position. Options: Preview Position, Stream (dropdowns)
- **Remove Preview Source** — Remove a source from a preview position. Options: Preview Position (dropdown)
- **Preview Sources** — Select and view a preview source. Options: Preview Source (dropdown)

### Decode Source
- **Add Decode Source** — Add a new decode source (RTMP/RTSP/UDP/SRT/HLS/Zixi/RTP). Options: JSON Body (text input)
- **Remove Decode Source** — Delete a decode source. Options: Source (dropdown)

### Source Group
- **Add Source Group** — Create a new source group. Options: Group Name (text input)
- **Remove Source Group** — Delete a source group. Options: Group (dropdown)

### HDMI Output
- **Enable Output1 HDMI** — Control Output 1 HDMI interface. Options: Video HDMI Device, Video Enable, Audio HDMI Device, Audio Enable, Volume
- **Enable Output2 HDMI** — Control Output 2 HDMI interface. Options: Video HDMI Device, Video Enable, Audio HDMI Device, Audio Enable, Volume

### System
- **Reboot Device** — Reboot the Media Gateway device

## Variables

- **Device Info** — Device name, IP address, model, firmware version, software version, serial number, hardware version
- **Status** — CPU usage, memory usage, uptime
- **Output** — Current output resolution, interface, audio mute state
- **Layout** — Current layout ID and name
- **Gateway** — Gateway stream count
- **Source Groups** — Number of source groups

## Presets

### General
- **Reboot Device** — Reboot the device with a single button press

### Info
- **Display Device Info** — Shows device name, firmware/software version, serial number, hardware version
- **Display IP Address** — Shows the device IP address

### Gateway Stream (Add Push presets)
- **Add RTMP Push** — Pre-configured JSON body for adding an RTMP push stream
- **Add SRT Push** — Pre-configured JSON body for adding an SRT push stream
- **Add RTSP Push** — Pre-configured JSON body for adding an RTSP push stream
- **Add HLS Push** — Pre-configured JSON body for adding an HLS push stream
- **Add TS Push** — Pre-configured JSON body for adding a TS push stream
- **Add RTP Push** — Pre-configured JSON body for adding an RTP push stream

### Select Layout
- **Select Layout for Output** — Select a layout for an output (configure output and layout in button settings)

### Decode Source (Add Source presets)
- **Add RTMP Source** — Pre-configured JSON body for adding an RTMP decode source
- **Add RTSP Source** — Pre-configured JSON body for adding an RTSP decode source
- **Add UDP Source** — Pre-configured JSON body for adding a UDP decode source
- **Add SRT Source** — Pre-configured JSON body for adding an SRT decode source
- **Add HLS Source** — Pre-configured JSON body for adding an HLS decode source
- **Add Zixi Source** — Pre-configured JSON body for adding a Zixi decode source
- **Add RTP Source** — Pre-configured JSON body for adding an RTP decode source

### Source Group
- **Add Source Group** — Create a new source group
- **Remove Source Group** — Delete a source group (pick from dropdown)

### Playback
- **Start Stream Playback** — Start playback (configure output/layout/position/stream in button settings)
- **Stop Stream Playback** — Stop playback (configure output/layout/position in button settings)

### Gateway Push
- **Start Gateway Push** — Start pushing a source to a gateway stream
- **Stop Gateway Push** — Stop an active gateway push

### Multi Output
- **Multi Out Switch** — Switch multi output mode

### HDMI Output
- **Enable Output1 HDMI** — Control Output 1 HDMI video/audio/volume
- **Enable Output2 HDMI** — Control Output 2 HDMI video/audio/volume
