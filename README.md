# react-silhouette

The `<Silhouette />` wrapper component for [React.js](https://reactjs.org/) is used to exert control over, and respond to, React's unmounting process. Each immediate child descendent of a `Silhouette` is explicitly **cached**, even when it has been removed from the React DOM, and will therefore _still remain visible on screen_.

This permits the caller to perform additional operations in response to the unmounting event, before permitting the component to unmount _for real_.

Caching the component does _not_ cause React to remount the component again. When React attempts to unmount a component, a `<Silhouette />` merely shifts it's 'perspective' of the unmounted element. This way, the element doesn't actually go anywhere until you explicitly say so.

## 🚀 Getting Started

Using [`npm`]():

```bash
npm install --save react-silhouette
```

Using [`yarn`]():

```bash
yarn add react-silhouette
```

## ✍️ Example

```javascript
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, Animated } from 'react-native';
import Silhouette from 'react-silhouette';

const FadeOutFrame = ({ unmount, ...extraProps }) => {
  const [ animOpacity ] = useState(
    new Animated.Value(1),
  );
  useEffect(
    () => {
      // XXX: When the component is ready to be unmounted,
      //      the Frame will be passed an "unmount" function,
      //      which you can use to delay the process.
      //
      //      Here, we defer unmounting until the component
      //      has faded away.
      (typeof unmount === 'function') && Animated.timing(
        animOpacity,
        {
          toValue: 0,
          useNativeDriver: true,
          duration: 1000,
        },
      )
      .start(unmount);
    },
    [unmount],
  );
  return (
    <Animated.View
      {...extraProps}
      style={{
        opacity: animOpacity,
      }}
    />
  );
};

export default () => {
  const [ deleted, setDeleted ] = useState(false);
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}
    >
      <Silhouette
        Frame={FadeOutFrame}
      >
        {(!deleted) && (
          <TouchableOpacity
            onPress={() => setDeleted(true)}
          >
            <Text
              children="I will fade away when deleted!"
            />
          </TouchableOpacity>
        )}
      </Silhouette>
    </View>
  );
};
```

## ✌️  License
[MIT](https://opensource.org/licenses/MIT)

<p align="center">
  <a href="https://www.buymeacoffee.com/cawfree">
    <img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy @cawfree a coffee" width="232" height="50" />
  </a>
</p>
