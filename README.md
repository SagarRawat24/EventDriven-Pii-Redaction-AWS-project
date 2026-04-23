#              PII-Resume-Redaction-Using-AWS 

<img width="1920" height="1080" alt="154shots_so" src="https://github.com/user-attachments/assets/2856ae09-ada4-4301-bcc7-0d585357b3d7" />


##
🌟 Project Overview: This project aims to automate the process of redacting personally identifiable information (PII), such as phone numbers and email addresses, from resumes using AWS services. The redaction process is powered by Python's regex capabilities and the PyMuPDF library for handling PDF files. The project leverages AWS Lambda for serverless execution, Amazon S3 for storing resumes and redacted files, and AWS Cognito for user authentication.

##
### 🚀 Tech Stack

### 🎨 Frontend
![Next JS](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React JS](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![ShadCN](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=radix-ui&logoColor=white)
![Aceternity UI](https://img.shields.io/badge/Aceternity_UI-111111?style=for-the-badge&logo=vercel&logoColor=white)

### ⚙️ Backend
![Node JS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express JS](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

### ☁️ Cloud & AWS
![AWS S3](https://img.shields.io/badge/Amazon_S3-569A31?style=for-the-badge&logo=amazon-s3&logoColor=white)
![AWS Lambda](https://img.shields.io/badge/AWS_Lambda-FF9900?style=for-the-badge&logo=aws-lambda&logoColor=white)
![CloudWatch](https://img.shields.io/badge/Amazon_CloudWatch-FF4F8B?style=for-the-badge&logo=amazoncloudwatch&logoColor=white)
![IAM](https://img.shields.io/badge/AWS_IAM-DD344C?style=for-the-badge&logo=amazonaws&logoColor=white)

##

### 🔍 Architecture Diagram 

<img width="1288" height="708" alt="latestarchitecture" src="https://github.com/user-attachments/assets/5e7d7e34-60c5-4efc-8dca-9ebbb0a4e7e2" />


### 💡AWS-Services

- AWS Lambda: Handles the processing of uploaded resumes, including scanning for PII using regex and redacting information using PyMuPDF. It provides scalable, serverless computing without the need for infrastructure management.

- Amazon S3: Serves as the storage location for both the original resumes and the redacted versions. Users upload resumes to S3, and the processed redacted documents are also saved in S3.

- AWS SDK: Use AWS SDK for nodejs  to interact with aws services programitically and implement logic and feaure easily

- PyMuPDF and Regex: PyMuPDF is used to manipulate PDF files, while regular expressions (regex) are employed to detect PII, including phone numbers and email addresses. These are then redacted from the resumes before the final document is stored in S3.

- AWS IAM (Identity and Access Management): Controls access to AWS services by assigning permissions to users, Lambda functions, and S3 buckets. IAM ensures that only authenticated and authorized users can access specific resources and services.

- AWS CloudWatch: Provides monitoring and logging capabilities. CloudWatch logs are used to track the execution of Lambda functions, capture any errors during redaction, and monitor overall system performance.
