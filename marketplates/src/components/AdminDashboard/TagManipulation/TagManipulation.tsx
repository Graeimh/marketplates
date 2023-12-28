import { useContext, useEffect, useState } from "react";
import * as tagService from "../../../services/tagService.js";
import styles from "./TagManipulation.module.scss";
import TagManipulationItem from "../TagManipulationItem/TagManipulationItem.js";
import { ITag, ITagValues } from "../../../common/types/tagTypes/tagTypes.js";
import UserContext from "../../Contexts/UserContext/UserContext.js";
import { HexColorPicker } from "react-colorful";
import { hexifyColors } from "../../../common/functions/hexifyColors.js";
import Tag from "../../MapGenerationComponents/Tag/Tag.js";
import { checkPermission } from "../../../common/functions/checkPermission.js";
import { UserType } from "../../../common/types/userTypes/userTypes.js";

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

  const [formData, setFormData] = useState<ITagValues>({
    isOfficial: true,
    tagBackgroundColor: "#FFFFFF",
    tagName: "Tag name",
    tagNameColor: "#000000",
  });
  const [validForUpdating, setValidForUpdating] = useState(false);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [tagQuery, setTagQuery] = useState("");

  const value = useContext(UserContext);

  async function getAllTags() {
    try {
      if (checkPermission(value.status, UserType.Admin)) {
        const allTags = await tagService.fetchAllTags();
        setTagList(allTags.data);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    getAllTags();
  }, []);

  function decideUpdatability() {
    setValidForUpdating(
      formData.tagName.length > 3 &&
        formData.tagNameColor.length === 7 &&
        formData.tagBackgroundColor.length === 7
    );
  }
  useEffect(() => {
    decideUpdatability();
  }, [formData]);

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
    if (checkPermission(value.status, UserType.Admin)) {
      if (formData.tagName.length > 2) {
        try {
          const response = await tagService.generateTag(formData, value.userId);
          setResponseMessage(response.message);
          getAllTags();
        } catch (err) {
          setError(err.message);
        }
        setFormData({
          isOfficial: true,
          tagBackgroundColor: "#FFFFFF",
          tagName: "Tag name",
          tagNameColor: "#000000",
        });
      }
    } else {
      setResponseMessage("The tag's name cannot be under 3 characters!");
    }
  }

  async function deletePrimedForDeletion() {
    try {
      if (checkPermission(value.status, UserType.Admin)) {
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
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function sendDeleteTagCall(id: string) {
    try {
      if (checkPermission(value.status, UserType.Admin)) {
        const response = await tagService.deleteTagById(id);
        getAllTags();
        setResponseMessage(response.message);
      }
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
                  onInput={(e) =>
                    setFormData({
                      ...formData,
                      tagName: e.target.value,
                    })
                  }
                  value={formData.tagName}
                />
              </p>
            </li>
            <li>
              <HexColorPicker
                color={formData.tagBackgroundColor}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tagBackgroundColor: hexifyColors(e.toString()),
                  })
                }
              />
              <p>
                <label>Background color : </label>

                <input
                  type="text"
                  name="backgroundColor"
                  onInput={(e) =>
                    setFormData({
                      ...formData,
                      tagBackgroundColor: hexifyColors(
                        e.target.value.toString()
                      ),
                    })
                  }
                  value={formData.tagBackgroundColor}
                />
              </p>
            </li>
            <li>
              <HexColorPicker
                color={formData.tagNameColor}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tagNameColor: hexifyColors(e.toString()),
                  })
                }
              />
              <p>
                <label>Name color : </label>

                <input
                  type="text"
                  name="nameColor"
                  onInput={(e) =>
                    setFormData({
                      ...formData,
                      tagNameColor: hexifyColors(e.target.value.toString()),
                    })
                  }
                  value={formData.tagNameColor}
                />
              </p>
            </li>
            {formData.tagName && (
              <li>
                Display
                <Tag
                  customStyle={{
                    color: formData.tagNameColor,
                    backgroundColor: formData.tagBackgroundColor,
                  }}
                  tagName={formData.tagName}
                  isTiny={false}
                />
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
            refetch={getAllTags}
            key={tag._id}
            IsSelected={primedForDeletionList.indexOf(tag._id) !== -1}
          />
        ))}
    </>
  );
}

export default TagManipulation;
