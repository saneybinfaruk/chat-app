"use client";
import React from "react";
import { FaPlus } from "react-icons/fa6";

interface Props {
  title: string;
  onClick: () => void;
}
const DialogBtn = ({ title, onClick }: Props) => {
  return (
    <button className="btn btn-ghost" onClick={onClick}>
      <FaPlus />
      {title}
    </button>
  );
};

export default DialogBtn;
