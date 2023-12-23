import MapEditor from "../MapEditor";

function EditMapWrapper() {
  const currentUrl = window.location.href;
  const urlValues = currentUrl.split("/");
  const idValue = urlValues[urlValues.length - 1];

  return <MapEditor editedMap={idValue} />;
}

export default EditMapWrapper;
