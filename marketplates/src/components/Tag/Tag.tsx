import { ITagStyle } from "../../common/types/tagTypes/tagTypes";
import styles from "./Tag.module.scss";

function Tag(props: {
  customStyle: ITagStyle;
  tagName: string;
  isTiny: boolean;
  onClose?: () => void;
  onClick?: () => void;
  isIn?: boolean;
}) {
  return (
    <>
      <div
        style={props.customStyle}
        className={props.isTiny ? styles.tinyTagContainer : styles.tagContainer}
      >
        {props.tagName}
        {props.isIn !== undefined ? (
          props.isIn ? (
            <button
              type="button"
              id={styles.tagCloseButton}
              onClick={props.onClose}
            >
              X
            </button>
          ) : (
            <button
              type="button"
              id={styles.tagCloseButton}
              onClick={props.onClick}
            >
              O
            </button>
          )
        ) : (
          ""
        )}
      </div>
    </>
  );
}
export default Tag;
