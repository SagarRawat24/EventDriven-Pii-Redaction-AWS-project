#              PII-Resume-Redaction-Using-AWS 

<img width="1920" height="1080" alt="154shots_so" src="https://github.com/user-attachments/assets/2856ae09-ada4-4301-bcc7-0d585357b3d7" />


##
🌟 Project Overview: This project aims to automate the process of redacting personally identifiable information (PII), such as phone numbers and email addresses, from resumes using AWS services. The redaction process is powered by Python's regex capabilities and the PyMuPDF library for handling PDF files. The project leverages AWS Lambda for serverless execution, Amazon S3 for storing resumes and redacted files, and AWS Cognito for user authentication.

##
### ⚡️Tech Stack

##

### 💡AWS-Services

- AWS Lambda: Handles the processing of uploaded resumes, including scanning for PII using regex and redacting information using PyMuPDF. It provides scalable, serverless computing without the need for infrastructure management.

- Amazon S3: Serves as the storage location for both the original resumes and the redacted versions. Users upload resumes to S3, and the processed redacted documents are also saved in S3.

- AWS SDK: Use AWS SDK for nodejs  to interact with aws services programitically and implement logic and feaure easily

- PyMuPDF and Regex: PyMuPDF is used to manipulate PDF files, while regular expressions (regex) are employed to detect PII, including phone numbers and email addresses. These are then redacted from the resumes before the final document is stored in S3.

- AWS IAM (Identity and Access Management): Controls access to AWS services by assigning permissions to users, Lambda functions, and S3 buckets. IAM ensures that only authenticated and authorized users can access specific resources and services.

- AWS CloudWatch: Provides monitoring and logging capabilities. CloudWatch logs are used to track the execution of Lambda functions, capture any errors during redaction, and monitor overall system performance.
