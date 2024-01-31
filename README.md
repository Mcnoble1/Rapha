# Rapha
Decentralized Healthcare Platform 

Our inspiration for the Decentralized Healthcare Platform stems from the need to revolutionize the healthcare experience. The project focuses on creating a comprehensive patient portal, offering seamless access to medical records, appointment history, lab results, and prescriptions, along with features like appointment scheduling and secure messaging with healthcare providers. To ensure efficient data exchange, we use web5 protocols. A robust consent management system empowers patients to control access to their health data, allowing them to grant or revoke consent for sharing with healthcare providers or researchers.

## Demo Video
https://github.com/Mcnoble1/Rapha/assets/40045755/eacbe375-6739-4f99-9431-37b474e0491f



## What it does
Rapha uses Decentralized Identifiers (DIDs) to enable users, including patients, doctors, and healthcare providers, to create and manage their unique digital identities. Each user possesses a personal Decentralized Web Node (DWN) as a secure data store, ensuring control over health records and selective data sharing with trusted parties. 

**Health Records Management:** Users securely upload and manage comprehensive health records in their personal DWN, encrypted for privacy.
**Selective Data Sharing:** Complete control over sharing health records with trusted parties, ensuring privacy and user-managed data across the healthcare system.
**Verifiable Credentials (VCs):** The app supports the issuance and verification of VCs for healthcare-related information. For example, doctors can issue digitally signed VCs containing medical certifications, qualifications, or authorization to perform certain procedures. Patients can receive VCs as proof of their vaccination records or medical conditions, which can be securely shared with authorized third parties.
**Healthcare Protocol Integration:** Seamless integration with FHIR and HL7 protocols for interoperability, enabling data exchange across diverse healthcare systems.
**Secure Communication:** Encrypted messaging channels facilitate confidential communication between patients and healthcare providers.

## How we built it
- ReactJS for the User Interface
- Web5.js SDK for the backend 
- Decentralized Identifiers for unique user identity and authentication
- Decentralized Web Nodes for secure data storage, 
- Web5 Protocols for permissioned data and information sharing and access, 
- Verifiable Credentials and Presentation Exchange for verification of doctors licenses and hospitals license.
- Verifiable Credentials and Presentation Exchange for verification for immunization and vaccination records

## Accomplishments that we're proud of
**- Patients registration**
Users (Patients) have their dashboard where they can create, edit, share and delete their profiles securely after being onboarded into the platform.

**- Medical Practitioners registration**
Users (Doctors) have their dashboard where they can create, edit, share and delete their profiles securely after being onboarded into the platform.

**- Secure Electronic Health Record System using Protocols**
We have Implemented a secure storage system for storing and managing medical records that keep tracks of previous records and keeps getting updated on the go.

**- Manual Verification of Medical License**
We have an admin portal to verify the the authenticity of medical practitioners and issue a Verifiable Credential that enables them to interact with patients. In the future, we will integrate with health organizations or government bodies that can verify and validate these credentials.

**- Chat System:**
Real-time chat system to facilitate communication between patients and medical practitioners.

- Patients can consult with doctors, share medical records, and get prescriptions and medical certificates.

## What's next for Rapha
Adding and onboarding Hospitals and Lab Test Centres, Private Hospitals and medical agencies
Govt agencies to help facilitate verification
Patients can send out request for doctors or care workers
Rapha blog for doctors to write articles about their respective fields
Research Hubs and patients can monetize by participating and sharing their health records.
Appointment Booking:
Develop a feature that allows patients to book appointments with doctors or hospitals.

## Installation

You'll need to install Node.js >=v14.16+ (Recommended Version) (NPM comes along with it) and TailAdmin uses **Vite** for frontend tooling, to perform installation and building production version, please follow these steps from below:

- Use the terminal and navigate to the project Rapha root.

- create a .env file with the details <code>ADMIN_DID=YOUR_DID_TO_SERVE_AS_PLATFORMS_PUBLIC_DID</code>
  enter the DID of the browser instance you want as the ADMIN DID to view registered doctors and issue verifiable credentials

- Then run : <code>npm install</code>

- Then run : <code>npm run dev</code>

Now, in the browser go to <code>localhost:5173</code>

Navigate to <code>localhost:5173/admin/dashboard</code> to enter the admin dashboard to view registered doctors and issue verifiable credentials


**For Production Build**
Run : <code>npm run build</code>

Default build output directory: /dist

This command will generate a dist as build folder in the root of your template that you can upload to your server.

![download](https://github.com/Mcnoble1/Rapha/assets/40045755/db26d9a9-0622-4cd6-9bde-4552a1da96c0)
![images](https://github.com/Mcnoble1/Rapha/assets/40045755/ef8b1d47-11d3-4ad2-a315-40dae0d6b3fb)
