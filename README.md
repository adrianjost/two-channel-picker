# @adrianjost/two-channel-picker

> A simple two channel Color Picker

## About

I needed an intuitive color picker to control my warm-white-cold-white (WWCW) LED Strips with the [SmartLight Project](https://github.com/adrianjost/SmartLight-Web-Client).

<p align="center">
  <img src="docs/img/screenshot.png" alt="two channel picker screenshot" style="max-width: 300px;">
</p>

The picker value is therefore indepent from the displayed color. The given value is a number between 0 and 1 for each of the two channels. The brightness can be determined by dragging the slider along the Y-axis. Dragging along the X-axis changes the relationship between the two channels.

<p align="center">
  <img src="docs/img/values.png" align="center" alt="two channel picker screenshot" style="max-width: 500px;">
</p>

## Usage

### Vue

Install the package:

```bash
npm i @adrianjost/two-channel-picker
```

or

```bash
yarn add @adrianjost/two-channel-picker
```

In your App:

```vue
<template>
	<TwoChannelPicker v-model="channels" colorLeft="#fd9" colorRight="#9df" />
</template>

<script>
import TwoChannelPicker from "@adrianjost/two-channel-picker";

export default {
	components: {
		TwoChannelPicker,
	},
	data() {
		return {
			channels: [0, 1],
		};
	},
};
</script>
```

### As a native Web Component

```html
<script src="https://unpkg.com/vue"></script>
<script src="https://cdn.jsdelivr.net/npm/@adrianjost/two-channel-picker@0.2.0/dist/lib/TwoChannelPicker.umd.min.js"></script>

<div style="width: 300px; height: 300px;">
	<two-channel-picker
		id="picker"
		value="[0,1]"
		color-left="#fd9"
		color-right="#9df"
	></two-channel-picker>
</div>

<script>
	document.getElementById("picker").addEventListener("input", (event) => {
		console.log(event.detail[0]);
	});
</script>
```

> please note, that you may need to adjust the version number in the url.

## API

### Props

You can customize the picker with the following props/attributes

| attribute | type | default value | description |
| --- | --- | --- | --- |
| `value` / `v-model` | Array, String | `[1,0]` | the current channel values, if provided as a String, this must be `JSON.parse()`-able |
| `readOnly` | Boolean | `false` | should the user be able to move the marker? |
| `colorLeft` | String | `#fd9` | the color in the top left corner. Must be in the HEX Format with 3 or 6 digits. |
| `colorRight` | String | `#fd9` | the color in the top right corner. Must be in the HEX Format with 3 or 6 digits. |
