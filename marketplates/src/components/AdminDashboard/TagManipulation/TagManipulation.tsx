import { useContext, useEffect, useState } from "react";
import * as tagService from "../../../services/tagService.js";
import stylesUserDashboard from "../../../common/styles/Dashboard.module.scss";
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
import { regular, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { IMessageValues } from "../../../common/types/commonTypes.ts/commonTypes.js";

function TagManipulation(props: {
  messageSetter: React.Dispatch<IMessageValues>;
}) {
  // Setting states
  // Array of tags meant to be displayed, edited or deleted
  const [tagList, setTagList] = useState<ITag[]>([]);

  // Array of place by Ids meant to be deleted upon pressing the delete button
  const [primedForDeletionList, setPrimedForDeletionList] = useState<string[]>(
    []
  );

  // Data to be sent to back end
  const [formData, setFormData] = useState<ITagValues>({
    isOfficial: true,
    tagBackgroundColor: "#FFFFFF",
    tagName: "Tag name",
    tagNameColor: "#000000",
  });

  // Tracks the data sent to be back end is correct or not
  const [validForUpdating, setValidForUpdating] = useState(false);

  // Gives the information whether or not all the tags belongs to the primed for deletion list
  const [isAllSelected, setIsAllSelected] = useState(false);

  // Tracks the filter values used to sort the tags
  const [tagQuery, setTagQuery] = useState("");

  // Fetching the user's current data
  const userContextValue = useContext(UserContext);

  // Filtering the displayed content to match the filter
  const filteredTagList = tagList.filter((tag) =>
    new RegExp(tagQuery, "i").test(tag.name)
  );
  const displayedTagList = tagQuery.length > 0 ? filteredTagList : tagList;

  // When the user's access token is reset, pull the values anew if possible
  useEffect(() => {
    getAllTags();
  }, [userContextValue]);

  // Data validation made to match the back end specifications
  useEffect(() => {
    decideUpdatability();
  }, [formData]);

  async function getAllTags() {
    try {
      if (checkPermission(userContextValue.status, UserType.Admin)) {
        const allTags = await tagService.fetchAllTags();
        setTagList(allTags.data);
      }
    } catch (err) {
      props.messageSetter({
        message: "An error has occured and we could not fetch tags",
        successStatus: false,
      });
    }
  }

  // Modifying the form's data according to the modifications in a specific input
  function updateField(event) {
    //hexifyColors ensures the colors keep a "#aaaaaa" format
    switch (event.target.name) {
      case "tagNameColor":
        setFormData({
          ...formData,
          tagNameColor: hexifyColors(event.target.userContextValue.toString()),
        });
        break;
      case "tagBackgroundColor":
        setFormData({
          ...formData,
          tagBackgroundColor: hexifyColors(
            event.target.userContextValue.toString()
          ),
        });
        break;
      default:
        setFormData({
          ...formData,
          [event.target.name]: event.target.value,
        });
    }
  }

  function decideUpdatability() {
    setValidForUpdating(
      formData.tagName.length > 3 &&
        formData.tagNameColor.length === 7 &&
        formData.tagBackgroundColor.length === 7
    );
  }

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
    // We check if some tags were already selected and we add them to the primed for deletion list

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

  // Empties the list of tags to be deleted
  function cancelSelection() {
    setPrimedForDeletionList([]);
  }

  // Sending data to the back end
  async function sendForm(event) {
    event.preventDefault();
    if (checkPermission(userContextValue.status, UserType.Admin)) {
      if (formData.tagName.length > 2) {
        try {
          await tagService.generateTag(formData, userContextValue.userId);
          props.messageSetter({
            message: "Tag successfully created",
            successStatus: true,
          });
          getAllTags();
        } catch (err) {
          props.messageSetter({
            message: "An error has occured and we could not create the tag",
            successStatus: false,
          });
        }
        setFormData({
          isOfficial: true,
          tagBackgroundColor: "#FFFFFF",
          tagName: "Tag name",
          tagNameColor: "#000000",
        });
      }
    } else {
      props.messageSetter({
        message: "The tag could not be created due to incorrect values.",
        successStatus: false,
      });
    }
  }

  async function deletePrimedForDeletion() {
    try {
      if (checkPermission(userContextValue.status, UserType.Admin)) {
        await tagService.deleteTagsByIds(primedForDeletionList);
        await tagService.fetchAllTags();

        props.messageSetter({
          message: "Successfully deleted the selected tags",
          successStatus: true,
        });
        setPrimedForDeletionList([]);
        getAllTags();
      }
    } catch (err) {
      props.messageSetter({
        message:
          "An error has occured and we could not delete the selected tags",
        successStatus: false,
      });
    }
  }

  async function sendDeleteTagCall(id: string) {
    try {
      if (checkPermission(userContextValue.status, UserType.Admin)) {
        await tagService.deleteTagById(id);
        getAllTags();
        props.messageSetter({
          message: "The tags have been successfully deleted",
          successStatus: true,
        });
      }
    } catch (err) {
      props.messageSetter({
        message: "An error has occured and we could not delete this tag",
        successStatus: false,
      });
    }
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - Tags</title>
        <link rel="canonical" href="http://localhost:5173/dashboard/tags" />
      </Helmet>

      <article id={manipulationStyles.manipulationContainer}>
        <h1>Manage tags</h1>
        <section className={formStyles.formContainer}>
          <form onSubmit={sendForm} id={styles.formCreateTag}>
            <h3>Create a tag</h3>
            <section>
              <ul className={tagStyles.tagEditor}>
                <li>
                  <label htmlFor="tagName">Tag name : </label>
                  <br />
                  <input
                    type="text"
                    name="tagName"
                    id="tagName"
                    onInput={updateField}
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
                  <label htmlFor="tagBackgroundColor">
                    Background Color :{" "}
                  </label>
                  <br />
                  <input
                    type="text"
                    name="tagBackgroundColor"
                    onInput={updateField}
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
                  <label htmlFor="tagNameColor">Name Color : </label>
                  <input
                    type="text"
                    name="tagNameColor"
                    onInput={updateField}
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
          <label htmlFor="tagQuery">
            <FontAwesomeIcon icon={solid("magnifying-glass")} />
            Search for a tag :
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
          <span className={stylesUserDashboard.deleteButton}>
            <button type="button" onClick={() => deletePrimedForDeletion()}>
              <FontAwesomeIcon icon={regular("trash-can")} />
              Delete {primedForDeletionList.length} tags
            </button>
          </span>

          <button type="button" onClick={() => cancelSelection()}>
            <FontAwesomeIcon icon={regular("rectangle-xmark")} />
            Cancel selection
          </button>

          <>
            <button
              type="button"
              onClick={() => selectAllTags()}
              disabled={primedForDeletionList.length === tagList.length}
            >
              <FontAwesomeIcon icon={solid("reply-all")} />
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
                messageSetter={props.messageSetter}
              />
            </li>
          ))}
      </ul>
    </>
  );
}

export default TagManipulation;
