import PlaceEditor from "../PlaceEditor";

function EditPlaceWrapper() {
  const currentUrl = window.location.href;
  const urlValues = currentUrl.split("/");
  const idValue = urlValues[urlValues.length - 1];

  return <PlaceEditor editPlaceId={idValue} />;
}

export default EditPlaceWrapper;
