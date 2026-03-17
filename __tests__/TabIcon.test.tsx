import React from "react";
import { render } from "@testing-library/react-native";
import TabIcon from "../src/components/TabBar/TabIcon";

describe("TabIcon Component", () => {
  it("renders correctly with label", () => {
    const { getByText } = render(
      <TabIcon
        focused={true}
        color="#FF6B35"
        iconFocused="navigate"
        iconUnfocused="navigate-outline"
        label="TRACK"
      />,
    );
    expect(getByText("TRACK")).toBeTruthy();
  });

  it("renders unfocused icon when focused is false", () => {
    const { getByText } = render(
      <TabIcon
        focused={false}
        color="#4B5563"
        iconFocused="navigate"
        iconUnfocused="navigate-outline"
        label="TRACK"
      />,
    );
    expect(getByText("TRACK")).toBeTruthy();
    expect(getByText("navigate-outline")).toBeTruthy();
  });

  it("renders focused icon when focused is true", () => {
    const { getByText } = render(
      <TabIcon
        focused={true}
        color="#FF6B35"
        iconFocused="navigate"
        iconUnfocused="navigate-outline"
        label="TRACK"
      />,
    );
    expect(getByText("navigate")).toBeTruthy();
  });
});
