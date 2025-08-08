import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>We need your permission to access the camera</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
  <View style={styles.overlay}>
    <View style={styles.bottomBar}>
      <TouchableOpacity style={styles.captureButton} />
      <TouchableOpacity onPress={toggleCameraFacing} style={styles.flipButton}>
        <Text style={styles.flipText}>↺</Text>
      </TouchableOpacity>
    </View>
  </View>
</CameraView>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  permissionButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  camera: {
    flex: 1,
  },
  overlay: {
  flex: 1,
  justifyContent: 'flex-end',
  },
  flipButton: {
  backgroundColor: 'rgba(0,0,0,0.4)',
  padding: 12,
  borderRadius: 25,
 left: 40, // space from capture button
  },

  flipText: {
    color: '#fff',
    fontSize: 18,
  },
  bottomBar: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 30,
  position: 'relative',
},

  captureButton: {
    width: 70,
    height: 70,
    backgroundColor: '#fff',
    borderRadius: 35,
    borderWidth: 4,
    borderColor: '#bbb',
    left: 20, // space from flip button
  },
});
