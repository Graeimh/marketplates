import { useContext, useEffect, useState } from "react";
import * as tagService from "../../../services/tagService.js";
import formStyles from "../../../common/styles/Forms.module.scss";
import manipulationStyles from "../../../common/styles/ManipulationContainer.module.scss";
import tagStyles from "../TagManipulationItem/TagManipulationItem.module.scss";
import styles from "./TagManipulation.module.scss";
import TagManipulationItem from "../TagManipulationItem/TagManipulationItem.js";
import { ITag, ITagValues } from "../../../common/types/tagTypes/tagTypes.js";
import UserContext from "../../Contexts/UserContext/UserContext.js";
import { HexColorPicker } from "react-colorful";
import { hexifyColors } from "../../../common/functions/hexifyColors.js";
import Tag from "../../MapGenerationComponents/Tag/Tag.js";
import { checkPermission } from "../../../common/functions/checkPermission.js";
import { UserType } from "../../../common/types/userTypes/userTypes.js";
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

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
  const [isStateLoading, setIsStateLoading] = useState(true);
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
  }, [value]);

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
        getAllTags();
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
    new RegExp(tagQuery, "i").test(tag.name)
  );
  const displayedTagList = tagQuery.length > 0 ? filteredTagList : tagList;

  return (
    <>
      <Helmet>
        <title>Dashboard - Tags</title>
        <link rel="canonical" href="http://localhost:5173/dashboard/tags" />
      </Helmet>

      <article id={manipulationStyles.manipulationContainer}>
        <h2>Manage tags</h2>
        <section className={formStyles.formContainer}>
          <form onSubmit={sendForm} id={styles.formCreateTag}>
            <h3>Create a tag</h3>
            <section>
              <ul className={tagStyles.tagEditor}>
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
            </section>
            <section className={tagStyles.specificDataTagList}>
              <ul className={tagStyles.tagEditor}>
                <li className={tagStyles.centeredTagEditorElement}>
                  <HexColorPicker
                    color={formData.tagBackgroundColor}
                    onChange={(e) =>
                      setFormData({ ...formData, tagBackgroundColor: e })
                    }
                    style={{ margin: "auto" }}
                  />
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
                <li className={tagStyles.centeredTagEditorElement}>
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
            </section>
            <section className={tagStyles.centeredTagEditorElement}>
              {formData.tagName && (
                <>
                  <h3>Display</h3>
                  <Tag
                    customStyle={{
                      color: formData.tagNameColor,
                      backgroundColor: formData.tagBackgroundColor,
                    }}
                    tagName={formData.tagName}
                    isTiny={false}
                  />
                </>
              )}
            </section>
            <div className={formStyles.finalButtonContainer}>
              <button type="submit" disabled={!validForUpdating}>
                Create Tag
              </button>
            </div>
          </form>
        </section>
        <section id={manipulationStyles.searchBar}>
          <label>
            <FontAwesomeIcon icon={solid("magnifying-glass")} />
            Search for a tag :{" "}
          </label>
          <input
            type="text"
            name="tagQuery"
            onChange={(e) => {
              setTagQuery(e.target.value);
            }}
          />
        </section>
        <section id={manipulationStyles.manipulationButtonsContainer}>
          <button type="button" onClick={() => deletePrimedForDeletion()}>
            Delete {primedForDeletionList.length} tags
          </button>

          <button type="button" onClick={() => cancelSelection()}>
            Cancel selection
          </button>

          <>
            <button
              type="button"
              onClick={() => selectAllTags()}
              disabled={primedForDeletionList.length === tagList.length}
            >
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

          {error && <div className={tagStyles.error}>{error}</div>}
          {responseMessage && (
            <div className={tagStyles.success}>{responseMessage}</div>
          )}
        </section>
      </article>
      <ul id={manipulationStyles.manipulationItemContainer}>
        {displayedTagList.length > 0 &&
          displayedTagList.map((tag) => (
            <li>
              <TagManipulationItem
                tag={tag}
                primeForDeletion={manageDeletionList}
                uponDeletion={sendDeleteTagCall}
                refetch={getAllTags}
                key={tag._id}
                IsSelected={primedForDeletionList.indexOf(tag._id) !== -1}
              />
            </li>
          ))}
      </ul>
    </>
  );
}

export default TagManipulation;
