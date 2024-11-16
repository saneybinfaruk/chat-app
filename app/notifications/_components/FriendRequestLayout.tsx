"use client";
import React from "react";

interface Props {
  fullName: string;
  avatarUrl: string;
  id: string;
}
const FriendRequestLayout = ({ fullName, avatarUrl, id }: Props) => {
  
  const onAccapt = async () => {
    const response = await fetch("/api/friends/accapt-request", {
      method: "PUT",
      body: JSON.stringify({ requestId: id, accapt: true }),
    });

    console.log(response);
  };
  const onReject = async () => {
    const response = await fetch("/api/friends/accapt-request", {
      method: "PUT",
      body: JSON.stringify({ requestId: id, accapt: false }),
    });

    console.log(response);
  };

  return (
    <div className="m-4 bg-violet-50 max-w-sm rounded-2xl overflow-hidden">
      <div className="flex items-center">
        <div className="avatar p-5">
          <div className="ring-primary w-14 rounded-full ring ring-offset-1">
            <img
              src={
                avatarUrl
                  ? avatarUrl
                  : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              }
            />
          </div>
        </div>

        <h4 className="text-md font-semibold">{fullName}</h4>
      </div>
      <div className="flex justify-end gap-4 bg-violet-100 border-t border-slate-300 p-3">
        <button className="btn btn-sm btn-primary" onClick={onAccapt}>
          Accapt
        </button>
        <button className="btn btn-sm btn-warning" onClick={onReject}>
          Reject
        </button>
      </div>
    </div>
  );
};

export default FriendRequestLayout;
