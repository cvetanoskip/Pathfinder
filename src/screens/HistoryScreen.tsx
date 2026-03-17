import React from "react";
import { FlatList, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import useStore from "../store/useStore";
import {
  Container,
  Inner,
  Header,
  CountBadge,
  CountText,
  Card,
  CardLeft,
  CardIcon,
  CardInfo,
  DateText,
  DistanceText,
  CardRight,
  PointsText,
  Chevron,
  DeleteButton,
  EmptyState,
  EmptyIcon,
  EmptyText,
  DurationText,
} from "./HistoryScreen.styles";
import { formatDuration } from "../utils/formatters";

export default function HistoryScreen() {
  const activities = useStore((state) => state.activities);
  const deleteActivity = useStore((state) => state.deleteActivity);
  const navigation = useNavigation<any>();

  const sorted = [...activities].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Route",
      "Are you sure you want to delete this activity? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteActivity(id),
        },
      ],
    );
  };

  return (
    <Container>
      <Inner>
        <Header>Activity History</Header>

        {activities.length > 0 && (
          <CountBadge>
            <CountText>
              {activities.length} {activities.length === 1 ? "route" : "routes"}{" "}
              saved
            </CountText>
          </CountBadge>
        )}

        {activities.length === 0 ? (
          <EmptyState>
            <EmptyIcon>🥾</EmptyIcon>
            <EmptyText>No routes saved yet. Go for a walk!</EmptyText>
          </EmptyState>
        ) : (
          <FlatList
            data={sorted}
            keyExtractor={(item) => item.id ?? item.date}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Card
                onPress={() =>
                  navigation.navigate("RouteDetail", { activity: item })
                }
                activeOpacity={0.7}
                style={{
                  elevation: 3,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 6,
                }}
              >
                <CardLeft>
                  <CardIcon>🗺️</CardIcon>
                  <CardInfo>
                    <DateText>
                      {new Date(item.date).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </DateText>
                    <DistanceText>{item.distance.toFixed(2)} km</DistanceText>
                    {item.duration ? (
                      <DurationText>
                        {formatDuration(item.duration)}
                      </DurationText>
                    ) : null}
                    {item.steps ? (
                      <DurationText>
                        {item.steps.toLocaleString()} steps
                      </DurationText>
                    ) : null}
                  </CardInfo>
                </CardLeft>
                <CardRight>
                  <DeleteButton
                    onPress={() => handleDelete(item.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="trash-outline" size={14} color="#ef4444" />
                  </DeleteButton>
                  <Chevron>›</Chevron>
                </CardRight>
              </Card>
            )}
          />
        )}
      </Inner>
    </Container>
  );
}
