import { RefObject } from "react";
import { FileUpload } from "./ui/file-upload"

export default function Footer ({
  footerRef,
}: {
  footerRef: RefObject<HTMLDivElement | null>;
}) {
  return(
    <div ref={footerRef}>
        <FileUpload/>
    </div>
  )
}