import { useContext, useEffect, useState } from "react";
import * as tagService from "../../../services/tagService.js";
import styles from "./TagManipulationItem.module.scss";
import { ITag, ITagValues } from "../../../common/types/tagTypes/tagTypes.js";
import { HexColorPicker } from "react-colorful";
import { hexifyColors } from "../../../common/functions/hexifyColors.js";
import Tag from "../../MapGenerationComponents/Tag/index.js";
import { checkPermission } from "../../../common/functions/checkPermission.js";
import { UserType } from "../../../common/types/userTypes/userTypes.js";
import UserContext from "../../Contexts/UserContext/UserContext.js";

function TagManipulationItem(props: {
  tag: ITag;
  uponDeletion: (tagId: string) => void;
  primeForDeletion: (tagId: string) => void;
  IsSelected: boolean;
  refetch: () => Promise<void>;
}) {
  const [formData, setFormData] = useState<ITagValues>({
    tagBackgroundColor: props.tag.backgroundColor,
    tagName: props.tag.name,
    tagNameColor: props.tag.nameColor,
  });

  const [error, setError] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [isPrimed, setIsPrimed] = useState(false);
  const [validForUpdating, setValidForUpdating] = useState(false);

  const value = useContext(UserContext);

  function handleDeletePrimer() {
    props.primeForDeletion(props.tag._id);
    setIsPrimed(!isPrimed);
  }

  function handleDelete() {
    props.uponDeletion(props.tag._id);
  }

  function decideUpdatability() {
    setValidForUpdating(
      formData.tagName.length > 3 &&
        formData.tagNameColor.length === 7 &&
        formData.tagBackgroundColor.length === 7 &&
        (formData.tagName !== props.tag.name ||
          formData.tagNameColor !== props.tag.nameColor ||
          formData.tagBackgroundColor !== props.tag.backgroundColor)
    );
  }
  useEffect(() => {
    decideUpdatability();
  }, [formData]);

  async function sendUpdateForm(event) {
    event.preventDefault();
    if (formData.tagName.length > 2) {
      try {
        if (checkPermission(value.status, UserType.Admin)) {
          const response = await tagService.updateTagById(
            props.tag._id,
            formData
          );
          setResponseMessage(response.message);
          props.refetch();
        }
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
    color: formData.tagNameColor,
    backgroundColor: formData.tagBackgroundColor,
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
                  onInput={(e) => {
                    setFormData({ ...formData, tagName: e.target.value });
                  }}
                  value={formData.tagName}
                />
              </p>
            </li>
            <li>
              <HexColorPicker
                color={formData.tagBackgroundColor}
                onChange={(e) =>
                  setFormData({ ...formData, tagBackgroundColor: e })
                }
              />
              <p>
                <label>Background Color : </label>
                <input
                  type="text"
                  name="backgroundColor"
                  onInput={(e) => {
                    setFormData({
                      ...formData,
                      tagBackgroundColor: hexifyColors(
                        e.target.value.toString()
                      ),
                    });
                  }}
                  value={formData.tagBackgroundColor}
                />
              </p>
            </li>
            <li>
              <HexColorPicker
                color={formData.tagNameColor}
                onChange={(e) => setFormData({ ...formData, tagNameColor: e })}
              />
              <p>
                <label>Name Color : </label>
                <input
                  type="text"
                  name="nameColor"
                  onInput={(e) => {
                    setFormData({
                      ...formData,
                      tagNameColor: hexifyColors(e.target.value.toString()),
                    });
                  }}
                  value={formData.tagNameColor}
                />
              </p>
            </li>
            <li>Before changes :</li>
            <li>
              {" "}
              <Tag
                customStyle={style}
                tagName={props.tag.name}
                isTiny={false}
              />
            </li>
            {(formData.tagName !== props.tag.name ||
              formData.tagBackgroundColor !== props.tag.backgroundColor ||
              formData.tagNameColor !== props.tag.nameColor) && (
              <>
                <li>After changes :</li>
                <li>
                  <Tag
                    customStyle={updatedStyle}
                    tagName={formData.tagName}
                    isTiny={false}
                  />
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
