import { Button, Input, Modal, Alert } from "rsuite";

export default function ModalList({
  modal,
  setModal,
  newTitleOK,
  setNewTitleOK,
  newListTitle,
  setNewListTitle,
  newListElement,
  setNewListElement,
  newListContent,
  setNewListContent,
  sendNewListToDB,
}) {
  function handleTitleChange(value) {
    setNewListTitle(value);
  }

  function handleNewElementChange(value) {
    setNewListElement(value);
  }

  function deleteLastElement() {
    let aux = [...newListContent];
    if (aux.length === 0) {
      Alert.info("Nothing else to delete!");
      return;
    }
    aux.pop();
    setNewListContent(aux);
  }

  function updateNewList() {
    if (!newListElement) {
      Alert.error("Empty element!");
      return;
    }
    setNewListContent([...newListContent, <li>{newListElement}</li>]);
    setNewListElement("");
  }

  function updateTitle() {
    if (!newListTitle) {
      Alert.error("Please enter a title");
      return;
    }
    setNewTitleOK(true);
  }

  return (
    <Modal
      full
      show={modal}
      onHide={() => {
        setModal(false);
      }}
    >
      <Modal.Header>
        <Modal.Title>
          {newTitleOK ? newListTitle : <p>Create new to-do list</p>}
          <hr />
          {!newTitleOK ? (
            <div className="TitleCreate">
              <Input placeholder="Title of todo list" onChange={handleTitleChange} />
              <Button appearance="primary" onClick={updateTitle}>
                Add Title
              </Button>
            </div>
          ) : (
            <div />
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <ul>{newListContent}</ul>
        </div>
        {newTitleOK ? (
          <div className="TitleCreate">
            <Input
              placeholder="Add element to list"
              value={newListElement}
              onChange={handleNewElementChange}
            />
            <Button appearance="primary" onClick={updateNewList}>
              +
            </Button>
          </div>
        ) : (
          <div />
        )}
      </Modal.Body>
      <Modal.Footer>
        {newTitleOK ? (
          <Button appearance="primary" color="red" onClick={deleteLastElement}>
            Delete last entry
          </Button>
        ) : (
          ""
        )}
        <Button appearance="primary" onClick={sendNewListToDB}>
          Submit List
        </Button>
        <Button
          appearance="subtle"
          onClick={() => {
            setModal(false);
          }}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
