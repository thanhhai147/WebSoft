import React, { lazy, useContext } from "react";
import ModalContext from "../../contexts/modal.context";

const Button = lazy(() => import("./button.component"));

export default function DeleteButton() {
  const { setIsDelete } = useContext(ModalContext)

  const handleDelete = () => {
    setIsDelete(true)
  }

  return (
    <Button buttonCase={"delete"} onClickDelete={handleDelete} />
  )
};
