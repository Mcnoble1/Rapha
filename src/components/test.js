{
    "protocol": "https://medical-records.com/protocol",
    "types": {
      "healthRecord": {
        "schema": "https://medical-records.com/schemas/health-record",
        "dataFormats": ["application/json"]
      },
      "allergyRecord": {
        "schema": "https://medical-records.com/schemas/allergy-record",
        "dataFormats": ["application/json"]
      },
      "surgeryRecord": {
        "schema": "https://medical-records.com/schemas/surgery-record",
        "dataFormats": ["application/json"]
      },
      "diagnosisRecord": {
        "schema": "https://medical-records.com/schemas/diagnosis-record",
        "dataFormats": ["application/json"]
      },
      "immunizationRecord": {
        "schema": "https://medical-records.com/schemas/immunization-record",
        "dataFormats": ["application/json"]
      },
      "medicalHistoryRecord": {
        "schema": "https://medical-records.com/schemas/medical-history-record",
        "dataFormats": ["application/json"]
      },
      "vitalSignsRecord": {
        "schema": "https://medical-records.com/schemas/vital-signs-record",
        "dataFormats": ["application/json"]
      }
    },
    "structure": {
      "healthRecord": {
        "$actions": [
          {
            "who": "patient",
            "can": "read"
          },
          {
            "who": "doctor",
            "can": "write"
          }
        ],
        "subRecords": {
          "allergies": {
            "type": "allergyRecord",
            "$actions": [
              {
                "who": "patient",
                "can": "read"
              },
              {
                "who": "doctor",
                "can": "write"
              }
            ]
          },
          "surgeries": {
            "type": "surgeryRecord",
            "$actions": [
              {
                "who": "patient",
                "can": "read"
              },
              {
                "who": "doctor",
                "can": "write"
              }
            ]
          },
          "diagnoses": {
            "type": "diagnosisRecord",
            "$actions": [
              {
                "who": "patient",
                "can": "read"
              },
              {
                "who": "doctor",
                "can": "write"
              }
            ]
          },
          "immunizations": {
            "type": "immunizationRecord",
            "$actions": [
              {
                "who": "patient",
                "can": "read"
              },
              {
                "who": "doctor",
                "can": "write"
              }
            ]
          },
          "medicalHistory": {
            "type": "medicalHistoryRecord",
            "$actions": [
              {
                "who": "patient",
                "can": "read"
              },
              {
                "who": "doctor",
                "can": "write"
              }
            ]
          },
          "vitalSigns": {
            "type": "vitalSignsRecord",
            "$actions": [
              {
                "who": "patient",
                "can": "read"
              },
              {
                "who": "doctor",
                "can": "write"
              }
            ]
          }
        }
      },
      "allergyRecord": {
        "$actions": [
          {
            "who": "patient",
            "can": "read"
          },
          {
            "who": "doctor",
            "can": "write"
          }
        ]
      },
      "surgeryRecord": {
        "$actions": [
          {
            "who": "patient",
            "can": "read"
          },
          {
            "who": "doctor",
            "can": "write"
          }
        ]
      },
      "diagnosisRecord": {
        "$actions": [
          {
            "who": "patient",
            "can": "read"
          },
          {
            "who": "doctor",
            "can": "write"
          }
        ]
      },
      "immunizationRecord": {
        "$actions": [
          {
            "who": "patient",
            "can": "read"
          },
          {
            "who": "doctor",
            "can": "write"
          }
        ]
      },
      "medicalHistoryRecord": {
        "$actions": [
          {
            "who": "patient",
            "can": "read"
          },
          {
            "who": "doctor",
            "can": "write"
          }
        ]
      },
      "vitalSignsRecord": {
        "$actions": [
          {
            "who": "patient",
            "can": "read"
          },
          {
            "who": "doctor",
            "can": "write"
          }
        ]
      }
    }
  }


const { record } = await web5.dwn.records.create({
  data: {
    mainRecordData: { ... }, // main record data
    allergy: { ... }, // allergy sub-record
    surgery: { ... }, // surgery sub-record
    diagnosis: { ... }, // diagnosis sub-record
    immunization: { ... }, // immunization sub-record
    medicalHistory: { ... }, // medical history sub-record
    vitalSigns: { ... } // vital signs sub-record
  },
  message: {
    protocol: 'http://medical-record-protocol.xyz',
    protocolPath: 'medicalRecord',
    schema: 'https://your-medical-record-schema-url',
    recipient: 'did:example:alice',
    dataFormat: 'application/json',
  },
});


// Create and store the main health record
const { record: healthRecord, status } = await web5.dwn.records.write({
  data: healthRecordData,
  message: {
    protocol: 'http://medical-records-protocol.xyz',
    protocolPath: 'healthRecord',
    schema: 'https://medical-records-schema.org/health-record',
    recipient: patientDid
  }
});
// Create and associate sub-records with the main health record
const { record: allergyRecord, status } = await web5.dwn.records.write({
  data: allergyData,
  message: {
    protocol: 'http://medical-records-protocol.xyz',
    protocolPath: 'healthRecord/allergy',
    schema: 'https://medical-records-schema.org/allergy',
    recipient: patientDid,
    parentId: healthRecord.id,
    contextId: healthRecord.contextId
  }
});
// Write other sub-records in a similar fashion


const response = await web5.dwn.records.query({
    from: patientDid,
    message: {
      filter: {
        schema: 'https://medical-records-schema.org/health-record',
        dataFormat: 'application/json'
      }
    }
  });
  
  response.records.forEach(record => {
    console.log(record.id);
    // Query and process the associated sub-records here
  });



  const response = await web5.dwn.records.query({
    from: "your-did",
    message: {
      filter: {
        schema: "https://medical-records.com/schemas/health-record",
        dataFormat: "application/json"
      }
    }
  });
  response.records.forEach(async (record) => {
    const healthRecord = await web5.dwn.records.read({
      message: {
        from: "your-did",
        recordId: record.id
      }
    });
  
    console.log(healthRecord);
  });