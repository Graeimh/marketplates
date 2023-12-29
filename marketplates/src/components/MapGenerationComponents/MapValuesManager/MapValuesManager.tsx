import { LatLngExpression, latLng } from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

function MapValuesManager(props: {
  latitude: number | null;
  longitude: number | null;
  startingZoom: number;
  doubleClickEvent: (lon: number, lat: number) => void;
}) {
  // allows to interact with the map
  const map = useMap();

  // creates specific events when the map component is mounted
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

  // sets the initial position of the user on the map
  useEffect(() => {
    console.log("props.latitude", props.latitude);
    console.log("props.longitude", props.longitude);
    console.log("props.zoom", props.startingZoom);

    if (props.latitude !== null && props.longitude !== null) {
      const expression: LatLngExpression = latLng(
        props.latitude,
        props.longitude
      );
      map.flyTo(expression, props.startingZoom);
    } else {
      map.flyTo(latLng(50, 50), 5);
    }
  }, [props.latitude, props.longitude]);
  return <></>;
}

export default MapValuesManager;
