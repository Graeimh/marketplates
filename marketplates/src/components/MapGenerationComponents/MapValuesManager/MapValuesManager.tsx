import { LatLngExpression, latLng } from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

function MapValuesManager(props: {
  latitude: number | null;
  longitude: number | null;
  doubleClickEvent: (lon: number, lat: number) => void;
}) {
  // allows to interact with the map
  const map = useMap();

  useEffect(() => {
    // affixes a double click event to the map, giving out coordinates when the user does so
    map.addEventListener("dblclick", (e) => {
      props.doubleClickEvent(e.latlng.lng, e.latlng.lat);
    });
    // allows to have consistant map loading when the component is loaded
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
