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


### 💻 How to Run the Project 

### Clone the Project 

```
https://github.com/SagarRawat24/EventDriven-Pii-Redaction-AWS-project.git
```

### Setup Env Variable for Frontend 

```
NEXT_PUBLIC_API_URL= "your backend url"
```

 

### Frontend 

```
cd frontend
npm run dev 
```


### Setup Env Variable for Backend 

```
AWS_ACCESS_KEY_ID= your aws access key
AWS_SECRET_ACCESS_KEY=  your aws secert key
AWS_REGION= "your aws region"
S3_BUCKET_NAME=" upload pdf bucket name"
S3_DEST_BUCKET= "destination bucket name"
PORT= "backend port"
```

### Backend 

```
cd backend
node index.js
```


