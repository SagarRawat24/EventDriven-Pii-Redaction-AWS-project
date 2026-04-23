#              PII-Resume-Redaction-Using-AWS 

<img width="1920" height="1080" alt="154shots_so" src="https://github.com/user-attachments/assets/2856ae09-ada4-4301-bcc7-0d585357b3d7" />


##
🌟 Project Overview: This project aims to automate the process of redacting personally identifiable information (PII), such as phone numbers and email addresses, from resumes using AWS services. The redaction process is powered by Python's regex capabilities and the PyMuPDF library for handling PDF files. The project leverages AWS Lambda for serverless execution, Amazon S3 for storing resumes and redacted files, and AWS Cognito for user authentication.

##
### ⚡️Tech Stack
![Next JS](https://img.shields.io/badge/Next.js-000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vue](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Svelte](https://img.shields.io/badge/Svelte-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
![jQuery](https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white)
##

### 💡AWS-Services

- AWS Lambda: Handles the processing of uploaded resumes, including scanning for PII using regex and redacting information using PyMuPDF. It provides scalable, serverless computing without the need for infrastructure management.

- Amazon S3: Serves as the storage location for both the original resumes and the redacted versions. Users upload resumes to S3, and the processed redacted documents are also saved in S3.

- AWS SDK: Use AWS SDK for nodejs  to interact with aws services programitically and implement logic and feaure easily

- PyMuPDF and Regex: PyMuPDF is used to manipulate PDF files, while regular expressions (regex) are employed to detect PII, including phone numbers and email addresses. These are then redacted from the resumes before the final document is stored in S3.

- AWS IAM (Identity and Access Management): Controls access to AWS services by assigning permissions to users, Lambda functions, and S3 buckets. IAM ensures that only authenticated and authorized users can access specific resources and services.

- AWS CloudWatch: Provides monitoring and logging capabilities. CloudWatch logs are used to track the execution of Lambda functions, capture any errors during redaction, and monitor overall system performance.
