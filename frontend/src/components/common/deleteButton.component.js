import { lazy, useContext } from "react";
import ModalContext from "../../contexts/modal.context";
import ConsumerAPI from "../../api/consumer.api";

const { deleteConsumer } = ConsumerAPI

const Button = lazy(() => import("./button.component"));

const DeleteButton = ({ variant }) => {
  const { selectedRows } = useContext(ModalContext);

  const handleDelete = async () => {
    switch (variant) {
        case 'consumer':
            const response = await Promise.all(selectedRows.forEach(row => deleteConsumer(row.ConsumerId)))
            if (response.success) {
                
            }
    }
  };

  return <Button buttonCase="detete" onClickEdit={handleDelete} />;
};

export default EditButton;
