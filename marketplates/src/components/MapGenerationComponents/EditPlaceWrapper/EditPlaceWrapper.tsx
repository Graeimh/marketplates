import { IMessageValues } from "../../../common/types/commonTypes.ts/commonTypes";
import PlaceEditor from "../PlaceEditor";

function EditPlaceWrapper(props: {
  messageSetter: React.Dispatch<IMessageValues>;
}) {
  const currentUrl = window.location.href;
  const urlValues = currentUrl.split("/");
  const idValue = urlValues[urlValues.length - 1];

  return (
    <PlaceEditor editPlaceId={idValue} messageSetter={props.messageSetter} />
  );
}

export default EditPlaceWrapper;
