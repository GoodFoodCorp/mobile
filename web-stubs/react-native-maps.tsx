// Remplace react-native-maps (module natif) dans la version web uniquement — voir metro.config.js.
import React from "react";
import { Text, View } from "react-native";

const MapView = React.forwardRef<unknown, { style?: unknown; children?: React.ReactNode }>(
  function MapView({ style }, ref) {
    // Les méthodes de carte (animateCamera, fitToCoordinates…) deviennent des no-op.
    React.useImperativeHandle(ref, () => new Proxy({}, { get: () => () => undefined }));
    return (
      <View
        style={[
          { backgroundColor: "#e8efe9", alignItems: "center", justifyContent: "center", minHeight: 160 },
          style as never,
        ]}
      >
        <Text style={{ color: "#5b6b60" }}>Carte indisponible dans le navigateur</Text>
      </View>
    );
  },
);

export const Marker = () => null;
export const Polyline = () => null;
export const PROVIDER_GOOGLE = "google";
export default MapView;
