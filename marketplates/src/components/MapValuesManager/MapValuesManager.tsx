import { LatLngExpression, latLng } from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

function MapValuesManager(props: {
  latitude: number | null;
  longitude: number | null;
}) {
  const map = useMap();

  console.log(props.longitude, props.latitude);
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 250);
  }, [map]);

  useEffect(() => {
    if (props.latitude !== null && props.longitude !== null) {
      const expression: LatLngExpression = latLng(
        props.latitude,
        props.longitude
      );
      map.flyTo(expression, 18);
    } else {
      map.flyTo(latLng(50, 50), 5);
    }
  }, [props.latitude, props.longitude]);
  return <></>;
}

export default MapValuesManager;
