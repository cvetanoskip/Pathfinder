import React, { useState, useRef } from "react";
import { ScrollView, StatusBar } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import {
  MapView,
  Camera,
  ShapeSource,
  LineLayer,
  CircleLayer,
  SymbolLayer,
  CameraRef,
} from "@maplibre/maplibre-react-native";
import { Activity } from "../store/useStore";
import { formatDuration, formatPace } from "../utils/formatters";
import {
  Container,
  Header,
  BackButton,
  BackArrow,
  HeaderTitles,
  HeaderTitle,
  HeaderSub,
  MapCard,
  Legend,
  LegendItem,
  LegendDot,
  LegendText,
  StatsRow,
  StatCard,
  StatIcon,
  StatValue,
  StatLabel,
  InfoCard,
  InfoTitle,
  InfoRow,
  InfoKey,
  InfoVal,
  PaceCard,
} from "./RouteDetailScreen.styles";

type RouteParams = { activity: Activity };

export default function RouteDetailScreen() {
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<{ params: RouteParams }, "params">>();
  const { activity } = params;
  const cameraRef = useRef<CameraRef>(null);
  const [mapReady, setMapReady] = useState(false);

  const mapTilerKey = process.env.EXPO_PUBLIC_MAPTILER_KEY;
  const styleURL = `https://api.maptiler.com/maps/basic-v2/style.json?key=${mapTilerKey}`;

  const coords = activity.coordinates;
  const midIndex = Math.floor(coords.length / 2);
  const center = coords[midIndex] ?? coords[0];

  const lngs = coords.map((c) => c.longitude);
  const lats = coords.map((c) => c.latitude);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const paddingPercent = 0.3;
  const lngPad = (maxLng - minLng) * paddingPercent || 0.005;
  const latPad = (maxLat - minLat) * paddingPercent || 0.005;

  const routeGeoJSON: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features:
      coords.length > 1
        ? [
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: coords.map((p) => [p.longitude, p.latitude]),
              },
              properties: {},
            },
          ]
        : [],
  };

  const startGeoJSON: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [coords[0].longitude, coords[0].latitude],
        },
        properties: { label: "S" },
      },
    ],
  };

  const endGeoJSON: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [
            coords[coords.length - 1].longitude,
            coords[coords.length - 1].latitude,
          ],
        },
        properties: { label: "E" },
      },
    ],
  };

  const formattedDate = new Date(activity.date).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = new Date(activity.date).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleMapReady = () => {
    setMapReady(true);
    if (coords.length > 1) {
      cameraRef.current?.fitBounds(
        [minLng - lngPad, minLat - latPad],
        [maxLng + lngPad, maxLat + latPad],
        [40, 40, 40, 40],
        800,
      );
    }
  };

  return (
    <Container>
      <StatusBar barStyle="light-content" />

      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <BackArrow>←</BackArrow>
        </BackButton>
        <HeaderTitles>
          <HeaderTitle>Route Detail</HeaderTitle>
          <HeaderSub>{formattedDate}</HeaderSub>
        </HeaderTitles>
      </Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        <MapCard>
          <MapView
            style={{ height: 300 }}
            mapStyle={styleURL}
            scrollEnabled={true}
            zoomEnabled={true}
            logoEnabled={true}
            attributionEnabled={true}
            onDidFinishLoadingMap={handleMapReady}
          >
            <Camera
              ref={cameraRef}
              zoomLevel={13}
              centerCoordinate={[center.longitude, center.latitude]}
              animationDuration={0}
            />

            {mapReady && coords.length > 1 && (
              <>
                <ShapeSource id="routeSource" shape={routeGeoJSON}>
                  <LineLayer
                    id="routeLine"
                    style={{
                      lineColor: "#FF6B35",
                      lineWidth: 4,
                      lineJoin: "round",
                      lineCap: "round",
                    }}
                  />
                </ShapeSource>

                <ShapeSource id="startSource" shape={startGeoJSON}>
                  <CircleLayer
                    id="startCircleOuter"
                    style={{
                      circleRadius: 14,
                      circleColor: "rgba(34, 197, 94, 0.25)",
                      circleStrokeWidth: 0,
                    }}
                  />
                  <CircleLayer
                    id="startCircle"
                    style={{
                      circleRadius: 8,
                      circleColor: "#22C55E",
                      circleStrokeWidth: 2.5,
                      circleStrokeColor: "#ffffff",
                    }}
                  />
                </ShapeSource>

                <ShapeSource id="endSource" shape={endGeoJSON}>
                  <CircleLayer
                    id="endCircleOuter"
                    style={{
                      circleRadius: 14,
                      circleColor: "rgba(239, 68, 68, 0.25)",
                      circleStrokeWidth: 0,
                    }}
                  />
                  <CircleLayer
                    id="endCircle"
                    style={{
                      circleRadius: 8,
                      circleColor: "#EF4444",
                      circleStrokeWidth: 2.5,
                      circleStrokeColor: "#ffffff",
                    }}
                  />
                </ShapeSource>
              </>
            )}
          </MapView>

          <Legend>
            <LegendItem>
              <LegendDot color="#22C55E" />
              <LegendText>Start</LegendText>
            </LegendItem>
            <LegendItem>
              <LegendDot color="#EF4444" />
              <LegendText>End</LegendText>
            </LegendItem>
            <LegendItem>
              <LegendDot color="#FF6B35" />
              <LegendText>Route</LegendText>
            </LegendItem>
          </Legend>
        </MapCard>

        <StatsRow>
          <StatCard>
            <StatIcon>📍</StatIcon>
            <StatValue>{activity.distance.toFixed(2)}</StatValue>
            <StatLabel>km</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon>⏱️</StatIcon>
            <StatValue>
              {activity.duration ? formatDuration(activity.duration) : "--:--"}
            </StatValue>
            <StatLabel>duration</StatLabel>
          </StatCard>
          <PaceCard>
            <StatIcon>⚡</StatIcon>
            <StatValue>{formatPace(activity.pace ?? null)}</StatValue>
            <StatLabel>min/km</StatLabel>
          </PaceCard>
          <StatCard>
            <StatIcon>👟</StatIcon>
            <StatValue>{activity.steps ?? 0}</StatValue>
            <StatLabel>steps</StatLabel>
          </StatCard>
        </StatsRow>

        <InfoCard>
          <InfoTitle>📅 Activity Info</InfoTitle>
          <InfoRow>
            <InfoKey>Date</InfoKey>
            <InfoVal>{formattedDate}</InfoVal>
          </InfoRow>
          <InfoRow>
            <InfoKey>Time</InfoKey>
            <InfoVal>{formattedTime}</InfoVal>
          </InfoRow>
          <InfoRow>
            <InfoKey>Distance</InfoKey>
            <InfoVal>{activity.distance.toFixed(3)} km</InfoVal>
          </InfoRow>
          <InfoRow>
            <InfoKey>Duration</InfoKey>
            <InfoVal>
              {activity.duration ? formatDuration(activity.duration) : "N/A"}
            </InfoVal>
          </InfoRow>
          <InfoRow>
            <InfoKey>Avg Pace</InfoKey>
            <InfoVal>{formatPace(activity.pace ?? null)} /km</InfoVal>
          </InfoRow>
          <InfoRow>
            <InfoKey>Steps</InfoKey>
            <InfoVal>{activity.steps ?? 0}</InfoVal>
          </InfoRow>
        </InfoCard>
      </ScrollView>
    </Container>
  );
}
