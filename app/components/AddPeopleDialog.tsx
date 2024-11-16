import React from "react";
import PeopleDialog from "./PeopleDialog";
import { User } from "../interfaces/interfaces";
import { findAllUser } from "../mongodb/query/users";

const AddPeopleDialog = async () => {
  const users = (await findAllUser()) as User[];

  return <PeopleDialog users={users || []} />;
};

export default AddPeopleDialog;
