import RegisterPlace from "../RegisterPlace";

function EditPlaceWrapper() {
  const currentUrl = window.location.href;
  const urlValues = currentUrl.split("/");
  const idValue = urlValues[urlValues.length - 1];

  return <RegisterPlace editPlaceId={idValue} />;
}

export default EditPlaceWrapper;
