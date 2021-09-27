var customerApplication = {
    "id": "customerapplication",
    "name": "Customer Application Workflow",
    "version": "1.0",
    "specVersion": "0.7",
    "timeouts": {
        "workflowExecTimeout": {
            "duration": "PT1M"
        },
        "actionExecTimeout": "PT10S"
    },
    "retries": [
        {
            "name": "WorkflowRetries",
            "delay": "PT3S",
            "maxAttempts": 10
        }
    ],
    "start": "NewCustomerApplication",
    "states": [
        {
            "name": "NewCustomerApplication",
            "type": "event",
            "onEvents": [{
                "eventRefs": ["NewApplicationEvent"],
                "actionMode": "parallel",
                "actions":[
                    {
                        "name": "Invoke Check Customer Info Function",
                        "functionRef": "CheckCustomerInfo"
                    },
                    {
                        "name": "Invoke Update Application Info Function",
                        "functionRef": "UpdateApplicationInfo"
                    }
                ]
            }],
            "transition": "MakeApplicationDecision"
        },
        {
            "name": "MakeApplicationDecision",
            "type": "switch",
            "dataConditions": [
                {
                    "condition": "$..[?(@.age >= 20)]",
                    "transition": "ApproveApplication"
                },
                {
                    "condition": "$..[?(@.age < 20)]",
                    "transition": "RejectApplication"
                }
            ],
            "defaultCondition": {
                "transition": "RejectApplication"
            }
        },
        {
            "name": "ApproveApplication",
            "type": "operation",
            "actions": [
                {
                    "name": "Invoke Approve Application Function",
                    "functionRef": "ApproveApplication",
                    "sleep": {
                        "before": "PT1S"
                    }
                }
            ],
            "end": true
        },
        {
            "name": "RejectApplication",
            "type": "operation",
            "actions": [
                {
                    "name": "Invoke Reject Application Function",
                    "functionRef": "RejectApplication",
                    "sleep": {
                        "before": "PT1S"
                    }
                }
            ],
            "end": true
        }
    ],
    "functions": [
        {
            "name": "CheckCustomerInfo",
            "type": "rest"
        },
        {
            "name": "UpdateApplicationInfo",
            "type": "rest"
        },
        {
            "name": "ApproveApplication",
            "type": "rest"
        },
        {
            "name": "RejectApplication",
            "type": "rest"
        }
    ],
    "events": [
        {
            "name": "NewApplicationEvent",
            "type": "com.fasterxml.jackson.databind.JsonNode",
            "source": "applicationsSource"
        }
    ]
}

var parallelStateExample = {
    "id": "parallelexec",
    "version": "1.0",
    "specVersion": "0.7",
    "name": "Parallel Execution Workflow",
    "description": "Executes two branches in parallel",
    "start": "ParallelExec",
    "states":[
      {
         "name": "ParallelExec",
         "type": "parallel",
         "completionType": "allOf",
         "branches": [
            {
              "name": "ShortDelayBranch",
              "actions": [{
                "subFlowRef": "shortdelayworkflowid"
              }]
            },
            {
              "name": "LongDelayBranch",
              "actions": [{
                "subFlowRef": "longdelayworkflowid"
              }]
            }
         ],
         "end": true
      }
    ]
};

var eventBasedSwitchState = {
    "id": "eventbasedswitch",
    "version": "1.0",
    "specVersion": "0.7",
    "name": "Event Based Switch Transitions",
    "description": "Event Based Switch Transitions",
    "start": "CheckVisaStatus",
    "events": [
    {
        "name": "visaApprovedEvent",
        "type": "VisaApproved",
        "source": "visaCheckSource"
    },
    {
        "name": "visaRejectedEvent",
        "type": "VisaRejected",
        "source": "visaCheckSource"
    }
    ],
    "states":[
      {
         "name":"CheckVisaStatus",
         "type":"switch",
         "eventConditions": [
            {
              "eventRef": "visaApprovedEvent",
              "transition": "HandleApprovedVisa"
            },
            {
              "eventRef": "visaRejectedEvent",
              "transition": "HandleRejectedVisa"
            }
         ],
         "eventTimeout": "PT1H",
         "defaultCondition": {
            "transition": "HandleNoVisaDecision"
         }
      },
      {
        "name": "HandleApprovedVisa",
        "type": "operation",
        "actions": [
          {
            "subFlowRef": "handleApprovedVisaWorkflowID"
          }
        ],
        "end": true
      },
      {
          "name": "HandleRejectedVisa",
          "type": "operation",
          "actions": [
            {
              "subFlowRef": "handleRejectedVisaWorkflowID"
            }
          ],
          "end": true
      },
      {
          "name": "HandleNoVisaDecision",
          "type": "operation",
          "actions": [
            {
              "subFlowRef": "handleNoVisaDecisionWorkflowId"
            }
          ],
          "end": true
      }
    ]
};

var provisionOrdersExample = {
    "id": "provisionorders",
    "version": "1.0",
    "specVersion": "0.7",
    "name": "Provision Orders",
    "description": "Provision Orders and handle errors thrown",
    "start": "ProvisionOrder",
    "functions": [
      {
         "name": "provisionOrderFunction",
         "operation": "http://myapis.org/provisioningapi.json#doProvision"
      }
    ],
    "errors": [
     {
      "name": "Missing order id"
     },
     {
      "name": "Missing order item"
     },
     {
      "name": "Missing order quantity"
     }
    ],
    "states":[
      {
        "name":"ProvisionOrder",
        "type":"operation",
        "actionMode":"sequential",
        "actions":[
           {
              "functionRef": {
                 "refName": "provisionOrderFunction",
                 "arguments": {
                   "order": "${ .order }"
                 }
              }
           }
        ],
        "stateDataFilter": {
           "output": "${ .exceptions }"
        },
        "transition": "ApplyOrder",
        "onErrors": [
           {
             "errorRef": "Missing order id",
             "transition": "MissingId"
           },
           {
             "errorRef": "Missing order item",
             "transition": "MissingItem"
           },
           {
            "errorRef": "Missing order quantity",
            "transition": "MissingQuantity"
           }
        ]
    },
    {
       "name": "MissingId",
       "type": "operation",
       "actions": [
         {
           "subFlowRef": "handleMissingIdExceptionWorkflow"
         }
       ],
       "end": true
    },
    {
       "name": "MissingItem",
       "type": "operation",
       "actions": [
         {
           "subFlowRef": "handleMissingItemExceptionWorkflow"
         }
       ],
       "end": true
    },
    {
       "name": "MissingQuantity",
       "type": "operation",
       "actions": [
         {
           "subFlowRef": "handleMissingQuantityExceptionWorkflow"
         }
       ],
       "end": true
    },
    {
       "name": "ApplyOrder",
       "type": "operation",
       "actions": [
         {
           "subFlowRef": "applyOrderWorkflowId"
         }
       ],
       "end": true
    }
    ]
};

var monitorJobsExample = {
    "id": "jobmonitoring",
    "version": "1.0",
    "specVersion": "0.7",
    "name": "Job Monitoring",
    "description": "Monitor finished execution of a submitted job",
    "start": "SubmitJob",
    "functions": [
      {
        "name": "submitJob",
        "operation": "http://myapis.org/monitorapi.json#doSubmit"
      },
      {
        "name": "checkJobStatus",
        "operation": "http://myapis.org/monitorapi.json#checkStatus"
      },
      {
        "name": "reportJobSuceeded",
        "operation": "http://myapis.org/monitorapi.json#reportSucceeded"
      },
      {
        "name": "reportJobFailed",
        "operation": "http://myapis.org/monitorapi.json#reportFailure"
      }
    ],
    "states":[
      {
        "name":"SubmitJob",
        "type":"operation",
        "actionMode":"sequential",
        "actions":[
        {
            "functionRef": {
              "refName": "submitJob",
              "arguments": {
                "name": "${ .job.name }"
              }
            },
            "actionDataFilter": {
              "results": "${ .jobuid }"
            }
        }
        ],
        "stateDataFilter": {
            "output": "${ .jobuid }"
        },
        "transition": "WaitForCompletion"
    },
    {
        "name": "WaitForCompletion",
        "type": "sleep",
        "duration": "PT5S",
        "transition": "GetJobStatus"
    },
    {
        "name":"GetJobStatus",
        "type":"operation",
        "actionMode":"sequential",
        "actions":[
        {
          "functionRef": {
              "refName": "checkJobStatus",
              "arguments": {
                "name": "${ .jobuid }"
              }
            },
            "actionDataFilter": {
              "results": "${ .jobstatus }"
            }
        }
        ],
        "stateDataFilter": {
            "output": "${ .jobstatus }"
        },
        "transition": "DetermineCompletion"
    },
    {
      "name":"DetermineCompletion",
      "type":"switch",
      "dataConditions": [
        {
          "condition": "${ .jobStatus == \"SUCCEEDED\" }",
          "transition": "JobSucceeded"
        },
        {
          "condition": "${ .jobStatus == \"FAILED\" }",
          "transition": "JobFailed"
        }
      ],
      "defaultCondition": {
        "transition": "WaitForCompletion"
      }
    },
    {
        "name":"JobSucceeded",
        "type":"operation",
        "actionMode":"sequential",
        "actions":[
        {
          "functionRef": {
              "refName": "reportJobSuceeded",
              "arguments": {
                "name": "${ .jobuid }"
              }
          }
        }
        ],
        "end": true
    },
    {
      "name":"JobFailed",
      "type":"operation",
      "actionMode":"sequential",
      "actions":[
      {
          "functionRef": {
            "refName": "reportJobFailed",
            "arguments": {
              "name": "${ .jobuid }"
            }
          }
      }
      ],
      "end": true
    }
    ]
};

var vetAppointmentExample = {
    "id": "VetAppointmentWorkflow",
    "name": "Vet Appointment Workflow",
    "description": "Vet service call via events",
    "version": "1.0",
    "specVersion": "0.7",
    "start": "MakeVetAppointmentState",
    "events": [
        {
            "name": "MakeVetAppointment",
            "source": "VetServiceSoure",
            "kind": "produced"
        },
        {
            "name": "VetAppointmentInfo",
            "source": "VetServiceSource",
            "kind": "consumed"
        }
    ],
    "states": [
        {
            "name": "MakeVetAppointmentState",
            "type": "operation",
            "actions": [
                {
                    "name": "MakeAppointmentAction",
                    "eventRef": {
                       "triggerEventRef": "MakeVetAppointment",
                       "data": "${ .patientInfo }",
                       "resultEventRef":  "VetAppointmentInfo"
                    },
                    "actionDataFilter": {
                        "results": "${ .appointmentInfo }"
                    }
                }
            ],
            "timeouts": {
              "actionExecTimeout": "PT15M"
            },
            "end": true
        }
    ]
};

var examplesMap = {};
examplesMap['customerapplication'] = customerApplication;

function selectExample(value) {
    if(value.length > 0) {
        var example = examplesMap[value];
        var model = monaco.editor.getModels()[0];
        model.setValue(JSON.stringify(example, null, 2));

        generateDiagram();
    }
}

function generateDiagram() {
    const { Specification, MermaidDiagram } = serverWorkflowSdk;

    const model = monaco.editor.getModels()[0];
    const modelVal = model.getValue();

    const mermaidSource = new MermaidDiagram(Specification.Workflow.fromSource(modelVal)).sourceCode();
    const mermaidDiv = document.querySelector(".workflowdiagram");

    mermaid.mermaidAPI.render('mermaid', mermaidSource, svgCode => {
        mermaidDiv.innerHTML = svgCode;
    });

}

function callUrl(type, url, data, callback){

    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open('POST', url);
    xhr.onreadystatechange = function() {
        if (xhr.readyState>3 && xhr.status==200) { callback(xhr.responseText); }
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/svg+xml');
    xhr.send(data);
    return xhr;
}

function changeTheme(theme) {
    if(theme.length > 0) {
        monaco.editor.setTheme(theme);
    }
}
