import React, { useRef } from "react";
import { FaCirclePlay, FaFilePdf } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { MdAudiotrack } from "react-icons/md";

interface Props {
  files: {
    file: File;
    previewURL: string;
  }[];
  setFiles: React.Dispatch<
    React.SetStateAction<
      {
        file: File;
        previewURL: string;
      }[]
    >
  >;
}
const SelectedFiles = ({ files, setFiles }: Props) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  const captureVideoThumbnail = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const video = document.createElement("video");
      video.src = URL.createObjectURL(file);

      video.onloadeddata = () => {
        // Seek to a specific time to capture thumbnail (0.5 seconds here)
        video.currentTime = 0.5;

        video.onseeked = () => {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbnailURL = canvas.toDataURL("image/jpeg");
            resolve(thumbnailURL);
          } else {
            reject("Unable to capture thumbnail");
          }
        };
      };

      video.onerror = () => {
        reject("Error loading video");
      };
    });
  };
  const removeFromSelectedFile = (file: File) => {
    const filteredList = files.filter((f) => f.file !== file);
    setFiles([...filteredList]);
  };
  return (
    <div className=" flex w-full gap-4 items-center py-3 flex-wrap">
      {files.map(({ file, previewURL }, index) => (
        <div key={file.name + index} className="relative">
          <div className="bg-gray-300 rounded-lg w-full h-full">
            {/* Render preview based on file type */}

            {file.type.startsWith("image/") && (
              <img
                src={previewURL}
                alt="Preview"
                className="w-16 h-16 object-cover rounded-lg"
              />
            )}

            {file.type.startsWith("audio/") && (
              <div className="flex items-center">
                <MdAudiotrack size={23} className="m-2" />
                <p className="pr-2">
                  {file.name.slice(0, file.name.length / 1.5) + "..."}
                </p>
              </div>
            )}

            {file.type.startsWith("video/") && (
              <div className="relative w-16 h-16 ">
                <video
                  ref={videoRef}
                  src={previewURL}
                  className="hidden w-full h-full rounded-lg"
                  onLoadedData={async () => {
                    const thumbnail = await captureVideoThumbnail(file);
                    setFiles((prevFiles) =>
                      prevFiles.map((f, i) =>
                        i === index ? { ...f, previewURL: thumbnail } : f
                      )
                    );
                  }}
                ></video>
                {/* Render video thumbnail */}
                <div className="relative w-full h-full rounded-lg">
                  <img
                    src={previewURL}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <FaCirclePlay className="absolute inset-0 m-auto text-4xl text-white flex justify-center items-center" />
                </div>
              </div>
            )}

            {file.type === "application/pdf" && (
              <div className="flex items-center">
                <FaFilePdf size={23} className="m-2" />
                <p className="pr-2">
                  {file.name.slice(0, file.name.length / 1.5) + "..."}
                </p>
              </div>
            )}
          </div>
          <IoClose
            className="absolute -top-2 -right-2 btn btn-circle btn-xs"
            onClick={() => removeFromSelectedFile(file)}
          />
        </div>
      ))}
    </div>
  );
};

export default SelectedFiles;
