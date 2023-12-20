"use client";
import React from "react";
import { Button } from "../Button/Button";
import { toast } from "sonner";

const DeleteButton = () => {
  return (
    <Button
      variant={"default"}
      onClick={() => {
        toast.success("Đã xóa");
        // toast.error("Xóa thất bại")
      }}
    >
      Delete
    </Button>
  );
};

export default DeleteButton;
