import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ITagStyle } from "../../../common/types/tagTypes/tagTypes";
import styles from "./Tag.module.scss";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { useState } from "react";

function Tag(props: {
  customStyle: ITagStyle;
  tagName: string;
  isTiny: boolean;
  onClose?: () => void;
  onClick?: () => void;
  isIn?: boolean;
}) {
  const reversedStyle: ITagStyle = {
    color: props.customStyle.backgroundColor,
    backgroundColor: props.customStyle.color,
  };
  const [buttonStyle, setButtonStyle] = useState<ITagStyle>(reversedStyle);

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
              onMouseDown={() => setButtonStyle(props.customStyle)}
              onMouseLeave={() => setButtonStyle(reversedStyle)}
              style={buttonStyle}
            >
              <FontAwesomeIcon icon={solid("xmark")} />
            </button>
          ) : (
            <button
              type="button"
              id={styles.tagCloseButton}
              onClick={props.onClick}
              onMouseDown={() => setButtonStyle(props.customStyle)}
              onMouseLeave={() => setButtonStyle(reversedStyle)}
              style={buttonStyle}
            >
              <FontAwesomeIcon icon={solid("circle-plus")} />
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
