import React from 'react';
import {
  Camera,
  DefaultLight,
  FilamentScene,
  FilamentView,
  Model,
  useCameraManipulator,
} from 'react-native-filament';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {Dimensions, StyleSheet, View} from 'react-native';
import {useSharedValue} from 'react-native-worklets-core';
import Ferrari from './Ferrari.glb';
import HouseModel from './model.glb';
import Workspace from './workspace.glb';
const modelPath =
  'https://raw.githubusercontent.com/google/filament/main/third_party/models/DamagedHelmet/DamagedHelmet.glb';

function Scene() {
  const cameraManipulator = useCameraManipulator({
    orbitHomePosition: [0, 0, 8], // "Camera location"
    targetPosition: [0, 0, 0], // "Looking at"
    orbitSpeed: [0.003, 0.003],
  });

  // Pan gesture
  const viewHeight = Dimensions.get('window').height;
  const panGesture = Gesture.Pan()
    .onBegin(event => {
      const yCorrected = viewHeight - event.translationY;
      cameraManipulator?.grabBegin(event.translationX, yCorrected, false); // false means rotation instead of translation
    })
    .onUpdate(event => {
      const yCorrected = viewHeight - event.translationY;
      cameraManipulator?.grabUpdate(event.translationX, yCorrected);
    })
    .maxPointers(1)
    .onEnd(() => {
      cameraManipulator?.grabEnd();
    });

  // Scale gesture
  const previousScale = useSharedValue(1);
  const scaleMultiplier = 100;
  const pinchGesture = Gesture.Pinch()
    .onBegin(({scale}) => {
      previousScale.value = scale;
    })
    .onUpdate(({scale, focalX, focalY}) => {
      const delta = scale - previousScale.value;
      cameraManipulator?.scroll(focalX, focalY, -delta * scaleMultiplier);
      previousScale.value = scale;
    });
  const combinedGesture = Gesture.Race(pinchGesture, panGesture);

  return (
    <GestureDetector gesture={combinedGesture}>
      <FilamentView style={styles.container}>
        <Camera cameraManipulator={cameraManipulator} />
        <DefaultLight />

        <Model source={{uri: modelPath}} transformToUnitCube />
        {/*<Model source={HouseModel} transformToUnitCube />*/}
        {/*<Model source={Workspace} transformToUnitCube />*/}
        {/*<Model source={Ferrari} transformToUnitCube />*/}
      </FilamentView>
    </GestureDetector>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <FilamentScene>
          <Scene />
        </FilamentScene>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
