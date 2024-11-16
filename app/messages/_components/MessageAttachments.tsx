import React from "react";

const MessageAttachments = ({ url }: { url: string }) => {
  const fileExtension = url.split(".").pop()?.toLowerCase();

  if (!fileExtension) return null;

  // Conditional rendering based on file extension
  if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(fileExtension)) {
    // Render image
    return (
      <a href={url}>
        <img
          src={url}
          alt="attachment"
          className="my-2 w-52 h-36 border border-violet-500 rounded-xl overflow-hidden bg-red-500 object-fill"
        />
      </a>
    );
  } else if (["mp3", "wav", "ogg", "m4a"].includes(fileExtension)) {
    // Render audio
    return (
      <audio controls className="attachment-audio">
        <source src={url} type={`audio/${fileExtension}`} />
        Your browser does not support the audio tag.
      </audio>
    );
  } else if (["mp4", "webm", "ogg"].includes(fileExtension)) {
    // Render video
    return (
      <video controls className="w-52 h-36">
        <source src={url} type={`video/${fileExtension}`} />
        Your browser does not support the video tag.
      </video>
    );
  } else if (["pdf"].includes(fileExtension)) {
    // Render PDF
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="block">
        <iframe
          src={url}
          className="w-52 h-60 border border-violet-500 rounded-xl"
          title="PDF Attachment"
        />
      </a>
    );
  }

  return null; // Fallback if no valid file extension is found
};

export default MessageAttachments;
