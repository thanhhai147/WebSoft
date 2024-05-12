import { lazy, useContext } from "react";
import ModalContext from "../../contexts/modal.context";

const Button = lazy(() => import("./button.component"));

const EditButton = ({ record }) => {
  const { showModal, setSelectedRecord } = useContext(ModalContext);

  const handleEdit = () => {
    setSelectedRecord(record);
    showModal("edit");
  };

  return <Button buttonCase="edit" onClickEdit={handleEdit} />;
};

export default EditButton;
