import { useContext, useEffect, useState } from "react";
import * as APIService from "../../services/api.js";
import styles from "./TagManipulation.module.scss";
import TagManipulationItem from "../TagManipulationItem/TagManipulationItem.js";
import { ITag } from "../../common/types/tagTypes/tagTypes.js";
import UserContext from "../UserContext/UserContext.js";
import { HexColorPicker } from "react-colorful";
import { hexifyColors } from "../../common/functions/hexifyColors.js";
import Tag from "../Tag/Tag.js";

function TagManipulation() {
  const [error, setError] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [tagList, setTagList] = useState<ITag[]>([]);
  const [primedForDeletionList, setPrimedForDeletionList] = useState<string[]>(
    []
  );
  const [tagNameColor, setTagNameColor] = useState("#000000");
  const [tagBackgroundColor, setTagBackgroundColor] = useState("#FFFFFF");
  const [tagName, setTagName] = useState("");
  const [validForUpdating, setValidForUpdating] = useState(false);

  const sessionValue = useContext(UserContext);
  const [isAllSelected, setIsAllSelected] = useState(false);

  async function getAllTags() {
    try {
      const allTags = await APIService.fetchAllTags();
      setTagList(allTags.data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    getAllTags();
  }, []);

  function decideUpdatability() {
    setValidForUpdating(
      tagName.length > 3 &&
        tagNameColor.length === 7 &&
        tagBackgroundColor.length === 7
    );
  }
  useEffect(() => {
    decideUpdatability();
  }, [tagName, tagNameColor, tagBackgroundColor]);

  function manageDeletionList(id: string) {
    const foundIndex = primedForDeletionList.indexOf(id);
    if (foundIndex === -1) {
      setPrimedForDeletionList([...primedForDeletionList, id]);
    } else {
      setPrimedForDeletionList(
        primedForDeletionList.filter((applianceId) => applianceId !== id)
      );
    }
  }

  function selectAllTags() {
    if (
      (!isAllSelected && primedForDeletionList.length === 0) ||
      primedForDeletionList.length !== tagList.length
    ) {
      setPrimedForDeletionList(tagList.map((tag) => tag._id));
    } else {
      setPrimedForDeletionList([]);
    }
    setIsAllSelected(!isAllSelected);
  }

  function cancelSelection() {
    setPrimedForDeletionList([]);
  }

  async function sendForm(event) {
    event.preventDefault();
    if (tagName.length > 2) {
      try {
        const response = await APIService.generateTag(
          tagName,
          tagNameColor,
          tagBackgroundColor,
          sessionValue.userId,
          "token"
        );
        setResponseMessage(response.message);
        getAllTags();
      } catch (err) {
        setError(err.message);
      }
    } else {
      setResponseMessage("The tag's name cannot be under 3 characters!");
    }
  }

  async function deletePrimedForDeletion() {
    try {
      const responseForDelete = APIService.deleteTagsByIds(
        primedForDeletionList,
        "token"
      );
      const responseforDataRenewal = APIService.fetchAllTags();

      const combinedResponse = await Promise.all([
        responseForDelete,
        responseforDataRenewal,
      ]).then((values) => values.join(" "));
      setResponseMessage(combinedResponse);

      console.log(
        `Successfully deleted ${primedForDeletionList.length} appliances`
      );
      setPrimedForDeletionList([]);
    } catch (err) {
      setError(err.message);
    }
  }

  async function sendDeleteTagCall(id: string) {
    try {
      const response = await APIService.deleteTagById(id, "token");
      getAllTags();
      setResponseMessage(response.message);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <h1>Tag manipulation</h1>
      <div className={styles.registerContainer}>
        <form onSubmit={sendForm}>
          <ul>
            <li>
              <p>
                <label>Name : </label>
                <input
                  type="text"
                  name="name"
                  onInput={() => setTagName(event.target.value)}
                />
              </p>
            </li>
            <li>
              <HexColorPicker
                color={tagBackgroundColor}
                onChange={setTagBackgroundColor}
              />
              <p>
                <label>Background color : </label>

                <input
                  type="text"
                  name="backgroundColor"
                  onInput={() => setTagBackgroundColor(event.target.value)}
                  value={hexifyColors(tagBackgroundColor)}
                />
              </p>
            </li>
            <li>
              <HexColorPicker color={tagNameColor} onChange={setTagNameColor} />
              <p>
                <label>Name color : </label>

                <input
                  type="text"
                  name="nameColor"
                  onInput={() => setTagNameColor(event.target.value)}
                  value={hexifyColors(tagNameColor)}
                />
              </p>
            </li>
            {tagName && (
              <li>
                Display
                <p>
                  <Tag
                    customStyle={{
                      color: tagNameColor,
                      backgroundColor: tagBackgroundColor,
                    }}
                    tagName={tagName}
                  />
                </p>
              </li>
            )}
          </ul>
          <button type="submit" disabled={!validForUpdating}>
            Create Tag
          </button>
        </form>
      </div>
      <button type="button" onClick={() => deletePrimedForDeletion()}>
        Delete {primedForDeletionList.length} tags
      </button>
      {primedForDeletionList.length !== tagList.length && (
        <button type="button" onClick={() => selectAllTags()}>
          Select all ({tagList.length}) tags
        </button>
      )}
      <button type="button" onClick={() => cancelSelection()}>
        Cancel selection{" "}
      </button>
      {error && <div className={styles.error}>{error}</div>}
      {responseMessage && (
        <div className={styles.success}>{responseMessage}</div>
      )}
      {tagList.length > 0 &&
        tagList.map((tag) => (
          <TagManipulationItem
            tag={tag}
            primeForDeletion={manageDeletionList}
            uponDeletion={sendDeleteTagCall}
            key={tag._id}
            IsSelected={primedForDeletionList.indexOf(tag._id) !== -1}
          />
        ))}
    </>
  );
}

export default TagManipulation;
