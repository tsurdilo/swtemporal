# Serverless Workflow Demo - Temporal execution

This demo shows the integration of [Serverless Workflow](https://serverlessworkflow.io/)
with [Temporal](https://temporal.io/)

It also shows the Serverless Workflow project experience,
where you can easily build an online editor, visualization,
form-based workflow input and ability to start 
workflow execution and wait for results.

Obligatory note: this is a demo and not intended for production use.
The demo integration does not support 100% of the Serverless Workflow
specification but the intent is that it does soon.

## Start the demo app

### 1. Start Temporal Server on Docker

    git clone https://github.com/temporalio/docker-compose.git
    cd  docker-compose
    docker-compose -f docker-compose-cas-es.yml up

### 2. Start the demo app (Quarkus dev mode)

    mvn clean install quarkus:dev

## Interact with the demo

### 1. Access the demo

    http://localhost:8080

The top-part of the demo shows the Serverless Workflow online editor
and the dynamic graphical workflow representation. Note that the 
graphical generation is done via the Serverless Workflow [Typescript SDK](https://github.com/serverlessworkflow/sdk-typescript)
and the MermaidJS library.


<p align="center">
<img src="docs/demoimg1.png" width="650px"/>
</p>

The editor supports auto-completion and validation
using the [Serverless Workflow workflow Json Schema definition](https://github.com/serverlessworkflow/specification/blob/main/schema/workflow.json).

When you select one of the two pre-defined workflows from the top dropdown 
the workflow image will auto-generate. If you make some
changes to your workflow press the "Generate workflow diagram"
button to re-generate the workflow image to reflect your
changes/updates.

### 1. View/Edit the Customer Application workflow

Check out the Customer Application workflow.
Note the "MakeApplicationDecision" switch state, here we use 
JsonPath (default for Serverless Workflow is jq) to define two conditions
(depending on the customers provided age). 
You can play with the age numbers if you want to see different workflow
execution results.

### 2. Enter workflow data input

Our workflow expects some data inputs, namely the customer information
that is used during workflow execution.
Scroll down to the bottom part of the page.

<p align="center">
<img src="docs/demoimg2.png" width="650px"/>
</p>

Enter customer first and last name, age and some purchase request,
for example "purchase a laptop".

Press the "Run Workflow" button to start workflow execution.

### 3. Check the Temporal Web UI

Check the Temporal Web UI by navigating to:

    http://localhost:8080

<p align="center">
<img src="docs/demoimg3.png" width="650px"/>
</p>

You will see your "TemporalServerlessWorkflow" workflow was executed
completed. You can click on the workflow Run Id link to see execution details.

### 4. Check the workflow execution results

Back on our app page (localhost:8080)

look at the "Decision (workflow output)" section. You should see
the final decision ("Approved" or "Denied"), in the "Decision" text
box and the whole workflow out put JSON in the "Workflow Result"
textbox.

<p align="center">
<img src="docs/demoimg4.png" width="650px"/>
</p>



