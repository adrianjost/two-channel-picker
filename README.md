# @adrianjost/two-channel-picker

> A simple two channel Color Picker

![two channel picker screenshot](docs/img/screenshot.png)

## Usage

### 1. Install

```bash
npm i @adrianjost/two-channel-picker
```

or

```bash
yarn add @adrianjost/two-channel-picker
```

### 2. Usage in Component (Vue)

```vue
<template>
  <TwoChannelPicker
    v-model="channels"
    colorLeft="#f00"
    colorRight="#00f"
  />
</template>

<script>
import TwoChannelPicker from "@adrianjost/two-channel-picker"

export default {
  components: {
    TwoChannelPicker
  },
  data(){
    return {
      channels: [0, 1]
    }
  }
}
</script>
```