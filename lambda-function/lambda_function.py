import json
import boto3
import fitz  # PyMuPDF
import re
import os
import logging
import urllib.parse

# ✅ Configure structured logging
logger = logging.getLogger()
logger.setLevel(os.environ.get("LOG_LEVEL", "INFO"))

# ✅ Reuse boto3 client outside handler (avoids cold-start overhead)
s3_client = boto3.client('s3')

# ✅ Destination bucket from environment variable (not hardcoded)
DESTINATION_BUCKET = os.environ.get("DESTINATION_BUCKET")


class Redactor:

    # Phone & email patterns
    PHONE_REG_1 = re.compile(
        r"\b(?:\+?1[-.\s]?)?(?:\(?[2-9]\d{2}\)?[-.\s]?)?[2-9]\d{2}[-.\s]?\d{4}\b"
    )
    PHONE_REG_2 = re.compile(r"\+91[-.\s]?\d{10}")
    EMAIL_REG = re.compile(
        r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b"
    )

    @staticmethod
    def get_sensitive_data(text: str) -> list:
        """Extract phone numbers and email addresses from text."""
        phones_1 = Redactor.PHONE_REG_1.findall(text)
        phones_2 = Redactor.PHONE_REG_2.findall(text)
        emails   = Redactor.EMAIL_REG.findall(text)
        found    = phones_1 + phones_2 + emails

        if found:
            logger.info(f"Found {len(found)} sensitive item(s) to redact")
        return found

    def __init__(self, input_path: str, output_path: str):
        self.input_path  = input_path
        self.output_path = output_path

    def redact(self) -> str:
        """Redact sensitive data from PDF and save to output_path."""
        doc = fitz.open(self.input_path)
        total_redactions = 0

        for page_num, page in enumerate(doc):
            page.wrap_contents()
            text            = page.get_text("text")
            sensitive_items = self.get_sensitive_data(text)

            for item in sensitive_items:
                areas = page.search_for(item)
                for area in areas:
                    page.add_redact_annot(area, fill=(0, 0, 0))
                    total_redactions += 1

            page.apply_redactions()

        # ✅ Save with garbage collection and deflate compression
        doc.save(self.output_path, garbage=4, deflate=True)
        doc.close()

        logger.info(f"Redaction complete. Total redactions applied: {total_redactions}")
        return self.output_path


def process_record(record: dict) -> dict:
    """Process a single S3 event record."""
    source_bucket = record['s3']['bucket']['name']

    # ✅ URL-decode the key (handles spaces and special characters)
    source_key = urllib.parse.unquote_plus(
        record['s3']['object']['key']
    )

    logger.info(f"Processing s3://{source_bucket}/{source_key}")

    # ✅ Validate it's a PDF before processing
    if not source_key.lower().endswith('.pdf'):
        logger.warning(f"Skipping non-PDF file: {source_key}")
        return {"skipped": True, "key": source_key}

    # ✅ Prevent infinite loop (source == destination)
    if source_bucket == DESTINATION_BUCKET:
        logger.warning("Source and destination buckets are the same. Skipping.")
        return {"skipped": True, "key": source_key}

    input_path  = '/tmp/input.pdf'
    output_path = '/tmp/redacted_output.pdf'

    try:
        # ✅ Download from source S3 bucket
        s3_client.download_file(source_bucket, source_key, input_path)
        logger.info(f"Downloaded: {source_key}")

        # ✅ Perform redaction
        redactor = Redactor(input_path, output_path)
        redactor.redact()

        # ✅ Flat structure — only filename, no nested folders
        filename = os.path.basename(source_key)

        # ✅ Always ensure .pdf extension
        if not filename.lower().endswith('.pdf'):
            filename = filename + '.pdf'

        # ✅ Save directly at root of destination bucket (no subfolders)
        destination_key = filename

        # ✅ Upload with correct Content-Type and encryption
        s3_client.upload_file(
            output_path,
            DESTINATION_BUCKET,
            destination_key,
            ExtraArgs={
                "ServerSideEncryption": "AES256",
                "ContentType": "application/pdf"
            }
        )
        logger.info(f"Uploaded to s3://{DESTINATION_BUCKET}/{destination_key}")

        return {"success": True, "destination_key": destination_key}

    finally:
        # ✅ Always clean up /tmp to avoid storage bleed
        for path in [input_path, output_path]:
            if os.path.exists(path):
                os.remove(path)
                logger.debug(f"Cleaned up: {path}")


def lambda_handler(event, context):
    """Main Lambda handler — processes all S3 records in the event."""

    if not DESTINATION_BUCKET:
        raise ValueError("Environment variable DESTINATION_BUCKET is not set")

    results = []

    # ✅ Loop over ALL records (not just index 0)
    for record in event.get('Records', []):
        try:
            result = process_record(record)
            results.append(result)
        except Exception as e:
            key = record['s3']['object'].get('key', 'unknown')
            logger.error(f"Failed to process {key}: {str(e)}", exc_info=True)
            raise  # ✅ Re-raise so Lambda retries and DLQ catches it

    return {
        'statusCode': 200,
        'body': json.dumps({
            'message': 'Processing complete',
            'results': results
        })
    }