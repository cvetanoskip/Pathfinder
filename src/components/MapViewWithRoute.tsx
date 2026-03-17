import React, { useState } from "react";
import {
  MapView,
  Camera,
  ShapeSource,
  LineLayer,
  CircleLayer,
  setAccessToken,
} from "@maplibre/maplibre-react-native";

import {
  MapContainer,
  Placeholder,
  PlaceholderText,
} from "./MapViewWithRoute.styles";

setAccessToken(null);

interface Props {
  currentLocation: { latitude: number; longitude: number } | null;
  route: { latitude: number; longitude: number }[];
  isTracking?: boolean;
}

export default function MapViewWithRoute({
  currentLocation,
  route,
  isTracking = false,
}: Props) {
  const [mapReady, setMapReady] = useState(false);

  if (!currentLocation) {
    return (
      <Placeholder>
        <PlaceholderText>Getting your location...</PlaceholderText>
      </Placeholder>
    );
  }

  const mapTilerKey = process.env.EXPO_PUBLIC_MAPTILER_KEY;
  const styleURL = `https://api.maptiler.com/maps/basic-v2/style.json?key=${mapTilerKey}`;

  const routeGeoJSON: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features:
      route.length > 1
        ? [
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: route.map((p) => [p.longitude, p.latitude]),
              },
              properties: {},
            },
          ]
        : [],
  };

  const locationGeoJSON: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [currentLocation.longitude, currentLocation.latitude],
        },
        properties: {},
      },
    ],
  };

  return (
    <MapContainer>
      <MapView
        style={{ flex: 1 }}
        mapStyle={styleURL}
        compassEnabled
        logoEnabled={false}
        attributionEnabled={false}
        onDidFinishLoadingMap={() => setMapReady(true)}
      >
        <Camera
          zoomLevel={15}
          centerCoordinate={[
            currentLocation.longitude,
            currentLocation.latitude,
          ]}
          animationMode="flyTo"
          animationDuration={500}
        />

        {mapReady && (
          <>
            <ShapeSource id="locationSource" shape={locationGeoJSON}>
              <CircleLayer
                id="locationPulse"
                style={{
                  circleRadius: 14,
                  circleColor: "rgba(255, 107, 53, 0.2)",
                  circleStrokeWidth: 0,
                }}
              />
              <CircleLayer
                id="locationDot"
                style={{
                  circleRadius: 7,
                  circleColor: "#FF6B35",
                  circleStrokeWidth: 2,
                  circleStrokeColor: "#ffffff",
                }}
              />
            </ShapeSource>

            {route.length > 1 && (
              <ShapeSource id="routeSource" shape={routeGeoJSON}>
                <LineLayer
                  id="routeLine"
                  style={{
                    lineColor: "#FF6B35",
                    lineWidth: 5,
                    lineJoin: "round",
                    lineCap: "round",
                  }}
                />
              </ShapeSource>
            )}
          </>
        )}
      </MapView>
    </MapContainer>
  );
}
