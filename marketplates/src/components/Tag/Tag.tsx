import { ITagStyle } from "../../common/types/tagTypes/tagTypes";
import styles from "./Tag.module.scss";

function Tag(props: {
  customStyle: ITagStyle;
  tagName: string;
  onClose?: () => void;
}) {
  return (
    <>
      <div style={props.customStyle} className={styles.tagContainer}>
        {props.tagName}
        {props.onClose && <button onClick={props.onClose}>X</button>}
      </div>
    </>
  );
}
export default Tag;
