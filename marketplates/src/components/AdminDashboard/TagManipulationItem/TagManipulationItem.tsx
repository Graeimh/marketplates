import { useContext, useEffect, useState } from "react";
import * as tagService from "../../../services/tagService.js";
import formStyles from "../../../common/styles/Forms.module.scss";
import itemStyles from "../../../common/styles/ManipulationItem.module.scss";
import styles from "./TagManipulationItem.module.scss";
import { ITag, ITagValues } from "../../../common/types/tagTypes/tagTypes.js";
import { HexColorPicker } from "react-colorful";
import { hexifyColors } from "../../../common/functions/hexifyColors.js";
import Tag from "../../MapGenerationComponents/Tag/index.js";
import { checkPermission } from "../../../common/functions/checkPermission.js";
import { UserType } from "../../../common/types/userTypes/userTypes.js";
import UserContext from "../../Contexts/UserContext/UserContext.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { regular, solid } from "@fortawesome/fontawesome-svg-core/import.macro";

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
      <article
        className={`
          ${
            props.IsSelected
              ? itemStyles.primedContainer
              : itemStyles.itemContainer
          } ${formStyles.formContainer}
            `}
      >
        <section>
          <h4>
            Tag :
            <Tag customStyle={style} tagName={props.tag.name} isTiny={false} />
          </h4>
          <button
            type="button"
            className={props.IsSelected ? itemStyles.primedButton : ""}
            onClick={() => handleDeletePrimer()}
          >
            {props.IsSelected ? (
              <FontAwesomeIcon icon={regular("trash-can")} />
            ) : (
              <FontAwesomeIcon icon={solid("trash-can-arrow-up")} />
            )}
            {props.IsSelected ? " Cancel selection" : " Select"}
          </button>

          <button type="button" onClick={handleDelete}>
            <FontAwesomeIcon icon={solid("tag")} />
            <FontAwesomeIcon icon={solid("xmark")} /> Delete tag
          </button>
        </section>
        <form onSubmit={sendUpdateForm}>
          <section>
            <ul className={styles.tagEditor}>
              <li>
                <label>Tag name : </label>
                <br />
                <input
                  type="text"
                  name="name"
                  onInput={(e) => {
                    setFormData({ ...formData, tagName: e.target.value });
                  }}
                  value={formData.tagName}
                />
              </li>
            </ul>
            <div className={styles.specificDataTagList}>
              <ul className={styles.tagEditor}>
                <li className={styles.centeredTagEditorElement}>
                  <div>
                    <HexColorPicker
                      color={formData.tagBackgroundColor}
                      onChange={(e) =>
                        setFormData({ ...formData, tagBackgroundColor: e })
                      }
                      style={{ margin: "auto" }}
                    />
                  </div>
                  <label>Background Color : </label>
                  <br />
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
                </li>
                <li className={styles.centeredTagEditorElement}>
                  <HexColorPicker
                    color={formData.tagNameColor}
                    onChange={(e) =>
                      setFormData({ ...formData, tagNameColor: e })
                    }
                    style={{ margin: "auto" }}
                  />
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
                </li>
              </ul>
            </div>
          </section>
          <section>
            <ul>
              <li className={styles.centeredTagEditorElement}>
                Before changes :
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
                  <li className={styles.centeredTagEditorElement}>
                    After changes :
                    <Tag
                      customStyle={updatedStyle}
                      tagName={formData.tagName}
                      isTiny={false}
                    />
                  </li>
                </>
              )}
            </ul>
          </section>
          <div className={formStyles.finalButtonContainer}>
            <button type="submit" disabled={!validForUpdating}>
              Update tag
            </button>
          </div>
        </form>
      </article>

      {error && <div className={styles.error}>{error}</div>}
      {responseMessage && (
        <div className={styles.success}>{responseMessage}</div>
      )}
    </>
  );
}

export default TagManipulationItem;
