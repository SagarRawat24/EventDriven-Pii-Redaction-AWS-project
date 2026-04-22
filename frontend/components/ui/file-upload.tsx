'use client'
import { cn } from "@/lib/utils";
import React, { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { IconUpload, IconCheck, IconX, IconLoader } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const mainVariant = {
  initial: { x: 0, y: 0 },
  animate: { x: 20, y: -20, opacity: 0.9 },
};

const secondaryVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

type UploadStatus = "idle" | "uploading" | "processing" | "ready" | "error";

export const FileUpload = ({
  onChange,
}: {
  onChange?: (files: File[]) => void;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [downloadUrl, setDownloadUrl] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => {
    clearInterval(pollRef.current);
    clearTimeout(timeoutRef.current);
  }, []);

  const validateFile = (file: File): string | null => {
    if (file.type !== "application/pdf") {
      return "Only PDF files are allowed.";
    }
    if (file.size > 5 * 1024 * 1024) {
      return "File size must be under 5 MB.";
    }
    return null;
  };

  const handleFileChange = (newFiles: File[]) => {
    const file = newFiles[0];
    if (!file) return;

    setUploadStatus("idle");
    setDownloadUrl(undefined);
    setErrorMessage("");

    const validationError = validateFile(file);
    if (validationError) {
      setErrorMessage(validationError);
      setUploadStatus("error");
      return;
    }

    setFiles([file]);
    onChange && onChange([file]);
    uploadToS3(file);
  };

  const uploadToS3 = async (file: File) => {
     
     console.log("pollRef.current value:", pollRef);

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadStatus("uploading");

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/post`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const { fileName } = res.data;
      setUploadStatus("processing");

      pollRef.current = setInterval(async () => {
        try {
          const poll = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/status?fileName=${encodeURIComponent(fileName)}`
          );
          if (poll.data.ready) {
            clearInterval(pollRef.current);
            clearTimeout(timeoutRef.current);
            setDownloadUrl(poll.data.url);
            setUploadStatus("ready");
          }
        } catch {
          // network blip — polling jaari rahegi
        }
      }, 3000);

      timeoutRef.current = setTimeout(() => {
        clearInterval(pollRef.current);
        setUploadStatus("error");
        setErrorMessage("Timed out. Please try again.");
      }, 5 * 60 * 1000);

    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Upload failed. Please try again.";
      setErrorMessage(msg);
      setUploadStatus("error");

      
    }
     console.log("pollRef.current value at end:", pollRef);
  };

  const handleClick = () => {
    if (uploadStatus === "uploading" || uploadStatus === "processing") return;
    fileInputRef.current?.click();
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearInterval(pollRef.current);
    clearTimeout(timeoutRef.current);
    setFiles([]);
    setUploadStatus("idle");
    setDownloadUrl(undefined);
    setErrorMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    accept: { "application/pdf": [".pdf"] },
    maxSize: 5 * 1024 * 1024,
    onDrop: handleFileChange,
    onDropRejected: (rejections) => {
      const msg = rejections[0]?.errors[0]?.message || "File rejected.";
      setErrorMessage(msg);
      setUploadStatus("error");
    },
  });

  const statusIcon: Partial<Record<UploadStatus, React.ReactNode>> = {
    uploading: <IconLoader className="h-4 w-4 text-blue-500 animate-spin" />,
    processing: <IconLoader className="h-4 w-4 text-blue-500 animate-spin" />,
    ready: <IconCheck className="h-4 w-4 text-green-500" />,
    error: <IconX className="h-4 w-4 text-red-500" />,
  };

  return (
    <div className="w-full mt-20" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          accept="application/pdf"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />

        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>

        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base">
            Upload PDF
          </p>
          <p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2">
            Drag or drop your PDF here or click to upload (max 5 MB)
          </p>

          {/* Processing */}
          {uploadStatus === "processing" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-20 mt-4 flex flex-col items-center gap-1"
            >
              <p className="text-blue-500 text-sm font-medium flex items-center gap-2">
                <IconLoader className="h-4 w-4 animate-spin" />
                Redacting your PDF, please wait...
              </p>
            </motion.div>
          )}

          {/* Ready — download */}
          {uploadStatus === "ready" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-20 mt-4 flex flex-col items-center gap-1"
            >
              <p className="text-blue-500 text-sm font-medium">
                Redaction complete!
              </p>
              <a
                href={downloadUrl}
                download
                onClick={(e) => e.stopPropagation()}
                className="px-4 py-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition-colors"
              >
                Download Redacted PDF
              </a>
              <button
                onClick={handleReset}
                className="mt-2 text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 underline"
              >
                Upload another
              </button>
            </motion.div>
          )}

          {/* Error */}
          {uploadStatus === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-20 mt-4 flex flex-col items-center gap-1"
            >
              <p className="text-red-500 text-sm font-medium">{errorMessage}</p>
              <button
                onClick={handleReset}
                className="mt-1 text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 underline"
              >
                Try again
              </button>
            </motion.div>
          )}

          <div className="relative w-full mt-10 max-w-xl mx-auto">
            {files.length > 0 &&
              files.map((file, idx) => (
                <motion.div
                  key={"file" + idx}
                  layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                  className={cn(
                    "relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-md",
                    "shadow-sm",
                    uploadStatus === "ready" &&
                      "border border-green-200 dark:border-green-900",
                    uploadStatus === "error" &&
                      "border border-red-200 dark:border-red-900",
                    (uploadStatus === "uploading" ||
                      uploadStatus === "processing") &&
                      "border border-blue-200 dark:border-blue-900"
                  )}
                >
                  <div className="flex justify-between w-full items-center gap-4">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="text-base text-neutral-700 dark:text-neutral-300 truncate max-w-xs"
                    >
                      {file.name}
                    </motion.p>
                    <div className="flex items-center gap-2">
                      {uploadStatus !== "idle" && statusIcon[uploadStatus]}
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                        className="rounded-lg px-2 py-1 w-fit shrink-0 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white shadow-input"
                      >
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </motion.p>
                    </div>
                  </div>

                  <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-600 dark:text-neutral-400">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800"
                    >
                      {file.type}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                    >
                      modified {new Date(file.lastModified).toLocaleDateString()}
                    </motion.p>
                  </div>

                  {/* Progress bar */}
                  {uploadStatus === "uploading" && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-blue-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "90%" }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                  )}
                  {uploadStatus === "processing" && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-blue-400"
                      initial={{ width: "90%" }}
                      animate={{ width: "95%" }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                    />
                  )}
                  {uploadStatus === "ready" && (
                    <div className="absolute bottom-0 left-0 h-0.5 bg-green-500 w-full" />
                  )}
                  {uploadStatus === "error" && (
                    <div className="absolute bottom-0 left-0 h-0.5 bg-red-500 w-full" />
                  )}
                </motion.div>
              ))}

            {!files.length && (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn(
                  "relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                  "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                )}
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-neutral-600 flex flex-col items-center"
                  >
                    Drop it
                    <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                  </motion.p>
                ) : (
                  <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                )}
              </motion.div>
            )}

            {!files.length && (
              <motion.div
                variants={secondaryVariant}
                className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
              />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex bg-gray-100 dark:bg-neutral-900 shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? "bg-gray-50 dark:bg-neutral-950"
                  : "bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
              }`}
            />
          );
        })
      )}
    </div>
  );
}