import { lazy, useContext } from "react";
import BookContext from "../../contexts/book.context";

const Button = lazy(() => import("../common/button.component"));

const EditButton = ({ record }) => {
  const { showModal, setSelectedRecord } = useContext(BookContext);

  const handleEdit = () => {
    setSelectedRecord(record);
    showModal("edit");
  };

  return <Button buttonCase="edit" onClickEdit={handleEdit} />;
};

export default EditButton;
