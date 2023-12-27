import { useContext, useEffect, useState } from "react";
import * as tagService from "../../../services/tagService.js";
import styles from "./TagManipulation.module.scss";
import TagManipulationItem from "../TagManipulationItem/TagManipulationItem.js";
import { ITag } from "../../../common/types/tagTypes/tagTypes.js";
import UserContext from "../../Contexts/UserContext/UserContext.js";
import { HexColorPicker } from "react-colorful";
import { hexifyColors } from "../../../common/functions/hexifyColors.js";
import Tag from "../../MapGenerationComponents/Tag/Tag.js";

function TagManipulation() {
  // Setting states
  // Error message display
  const [error, setError] = useState(null);

  // Response message display
  const [responseMessage, setResponseMessage] = useState("");

  // Array of tags meant to be displayed, edited or deleted
  const [tagList, setTagList] = useState<ITag[]>([]);

  // Array of place by Ids meant to be deleted upon pressing the delete button
  const [primedForDeletionList, setPrimedForDeletionList] = useState<string[]>(
    []
  );

  const [tagNameColor, setTagNameColor] = useState("#000000");
  const [tagBackgroundColor, setTagBackgroundColor] = useState("#FFFFFF");
  const [tagName, setTagName] = useState("");
  const [validForUpdating, setValidForUpdating] = useState(false);

  const sessionValue = useContext(UserContext);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [tagQuery, setTagQuery] = useState("");

  async function getAllTags() {
    try {
      const allTags = await tagService.fetchAllTags();
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

  function selectAllPresentTags(taglist: ITag[]) {
    setPrimedForDeletionList(
      tagList.filter((tag) => taglist.includes(tag)).map((tag) => tag._id)
    );
  }

  function cancelSelection() {
    setPrimedForDeletionList([]);
  }

  async function sendForm(event) {
    event.preventDefault();
    if (tagName.length > 2) {
      try {
        const response = await tagService.generateTag(
          tagName,
          tagNameColor,
          tagBackgroundColor,
          sessionValue.userId
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
      const responseForDelete = tagService.deleteTagsByIds(
        primedForDeletionList
      );
      const responseforDataRenewal = tagService.fetchAllTags();

      const combinedResponse = await Promise.all([
        responseForDelete,
        responseforDataRenewal,
      ]).then((values) => values.join(" "));
      setResponseMessage(combinedResponse);
      setPrimedForDeletionList([]);
    } catch (err) {
      setError(err.message);
    }
  }

  async function sendDeleteTagCall(id: string) {
    try {
      const response = await tagService.deleteTagById(id);
      getAllTags();
      setResponseMessage(response.message);
    } catch (err) {
      setError(err.message);
    }
  }

  const filteredTagList = tagList.filter((tag) =>
    new RegExp(tagQuery).test(tag.name)
  );
  const displayedTagList = tagQuery.length > 0 ? filteredTagList : tagList;

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
                    isTiny={false}
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
        <>
          <button type="button" onClick={() => selectAllTags()}>
            Select all ({tagList.length}) tags
          </button>

          {displayedTagList.length < tagList.length && (
            <button
              type="button"
              onClick={() => selectAllPresentTags(displayedTagList)}
            >
              Select ({displayedTagList.length}) tags
            </button>
          )}
        </>
      )}

      <button type="button" onClick={() => cancelSelection()}>
        Cancel selection{" "}
      </button>
      {error && <div className={styles.error}>{error}</div>}
      {responseMessage && (
        <div className={styles.success}>{responseMessage}</div>
      )}

      <label>Search for a tag : </label>
      <input
        type="text"
        name="tagQuery"
        onChange={(e) => {
          setTagQuery(e.target.value);
        }}
      />

      {displayedTagList.length > 0 &&
        displayedTagList.map((tag) => (
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
