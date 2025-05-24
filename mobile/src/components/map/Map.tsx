import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import MapView, { LatLng, Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { styles } from './styles';

interface MapProps {
  onLocationChange?: (latitude: number, longitude: number) => void;
  initialPosition?: LatLng; 
  editable?: boolean; 
}

export default function Map({ onLocationChange, initialPosition, editable = true }: MapProps) {
  const [latitude, setLatitude] = useState<number | null>(initialPosition?.latitude || null);
  const [longitude, setLongitude] = useState<number | null>(initialPosition?.longitude || null);
  const [coordinate, setCoordinate] = useState<LatLng | null>(initialPosition || null);

  useEffect(() => {
    if (initialPosition) {
      setLatitude(initialPosition.latitude);
      setLongitude(initialPosition.longitude);
      setCoordinate(initialPosition);
    } else {
   
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          setCoordinate({ latitude, longitude });
          onLocationChange && onLocationChange(latitude, longitude);
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
        },
        { enableHighAccuracy: false, timeout: 15000}
      );
    }
  }, [initialPosition]);

  return (
    <View style={styles.container}>
      {latitude !== null && longitude !== null ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          provider="google"
          showsUserLocation={true}
          zoomEnabled={true}
          minZoomLevel={17}
          loadingEnabled={true}
          onLongPress={(e) => {
            if (!editable) return; 
            const newCoordinate = e.nativeEvent.coordinate;
            setCoordinate(newCoordinate);
            setLatitude(newCoordinate.latitude);
            setLongitude(newCoordinate.longitude);
            onLocationChange && onLocationChange(newCoordinate.latitude, newCoordinate.longitude);
          }}
        >
          {coordinate && (
            <Marker
              draggable={editable} 
              coordinate={coordinate}
              onDragEnd={(e) => {
                if (!editable) return; 
                const newCoordinate = e.nativeEvent.coordinate;
                setLatitude(newCoordinate.latitude);
                setLongitude(newCoordinate.longitude);
                onLocationChange && onLocationChange(newCoordinate.latitude, newCoordinate.longitude);
              }}
              title="Ponto de encontro"
              description="Aqui é o ponto de encontro"
            />
          )}
        </MapView>
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
    </View>
  );
}