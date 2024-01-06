import { IMessageValues } from "../../../common/types/commonTypes.ts/commonTypes";
import MapEditor from "../MapEditor";

function EditMapWrapper(props: {
  messageSetter: React.Dispatch<IMessageValues>;
}) {
  const currentUrl = window.location.href;
  const urlValues = currentUrl.split("/");
  const idValue = urlValues[urlValues.length - 1];

  return (
    <MapEditor
      key={idValue}
      editedMap={idValue}
      messageSetter={props.messageSetter}
    />
  );
}

export default EditMapWrapper;
