import { useEffect, useState } from "react";
import * as APIService from "../../services/api.js";
import styles from "./TagManipulationItem.module.scss";
import { ITag } from "../../common/types/tagTypes/tagTypes.js";
import { HexColorPicker } from "react-colorful";
import { hexifyColors } from "../../common/functions/hexifyColors.js";
import Tag from "../Tag/index.js";

function TagManipulationItem(props: {
  tag: ITag;
  uponDeletion: (userId: string) => void;
  primeForDeletion: (userId: string) => void;
  IsSelected: boolean;
}) {
  const [error, setError] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [isPrimed, setIsPrimed] = useState(false);
  const [validForUpdating, setValidForUpdating] = useState(false);
  const [tagNameColor, setTagNameColor] = useState(props.tag.nameColor);
  const [tagBackgroundColor, setTagBackgroundColor] = useState(
    props.tag.backgroundColor
  );
  const [tagName, setTagName] = useState(props.tag.name);

  function handleDeletePrimer() {
    props.primeForDeletion(props.tag._id);
    setIsPrimed(!isPrimed);
  }

  function handleDelete() {
    props.uponDeletion(props.tag._id);
  }

  function decideUpdatability() {
    setValidForUpdating(
      tagName.length > 3 &&
        tagNameColor.length === 7 &&
        tagBackgroundColor.length === 7 &&
        (tagName !== props.tag.name ||
          tagNameColor !== props.tag.nameColor ||
          tagBackgroundColor !== props.tag.backgroundColor)
    );
  }
  useEffect(() => {
    decideUpdatability();
  }, [tagName, tagNameColor, tagBackgroundColor]);

  async function sendUpdateForm(event) {
    event.preventDefault();
    if (tagName.length > 2) {
      try {
        const response = await APIService.updateTagById(
          props.tag._id,
          "token",
          tagBackgroundColor,
          tagName,
          tagNameColor
        );
        setResponseMessage(response.message);
      } catch (err) {
        setError(err.message);
      }
    } else {
      setResponseMessage("The tag's name cannot be under 3 characters!");
    }
  }

  const style = {
    color: props.tag.nameColor,
    backgroundColor: props.tag.backgroundColor,
  };

  const updatedStyle = {
    color: tagNameColor,
    backgroundColor: tagBackgroundColor,
  };

  return (
    <>
      <h4>Tag name : {props.tag.name}</h4>
      <div
        className={
          props.IsSelected
            ? styles.primedContainer
            : styles.tagManipulationItemContainer
        }
      >
        <button
          type="button"
          className={props.IsSelected ? styles.primedButton : ""}
          onClick={() => handleDeletePrimer()}
        >
          {props.IsSelected ? "●" : "○"}
        </button>
        <button type="button" onClick={handleDelete}>
          Delete tag
        </button>
        <form onSubmit={sendUpdateForm}>
          <ul>
            <li>
              <p>
                <label>Tag name : </label>
                <input
                  type="text"
                  name="name"
                  onInput={() => {
                    setTagName(event?.target.value);
                  }}
                  value={tagName}
                />
              </p>
            </li>
            <li>
              <HexColorPicker
                color={tagBackgroundColor}
                onChange={setTagBackgroundColor}
              />
              <p>
                <label>Background Color : </label>
                <input
                  type="text"
                  name="backgroundColor"
                  onInput={() => {
                    setTagBackgroundColor(event?.target.value);
                  }}
                  value={hexifyColors(tagBackgroundColor)}
                />
              </p>
            </li>
            <li>
              <HexColorPicker color={tagNameColor} onChange={setTagNameColor} />
              <p>
                <label>Name Color : </label>
                <input
                  type="text"
                  name="nameColor"
                  onInput={() => {
                    setTagNameColor(event?.target.value);
                  }}
                  value={hexifyColors(tagNameColor)}
                />
              </p>
            </li>
            <li>Before changes :</li>
            <li>
              {" "}
              <Tag customStyle={style} tagName={props.tag.name} />
            </li>
            {tagName !== props.tag.name && (
              <>
                <li>After changes :</li>
                <li>
                  <Tag customStyle={updatedStyle} tagName={tagName} />
                </li>
              </>
            )}
          </ul>
          <button type="submit" disabled={!validForUpdating}>
            Update tag
          </button>
        </form>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {responseMessage && (
        <div className={styles.success}>{responseMessage}</div>
      )}
    </>
  );
}

export default TagManipulationItem;
