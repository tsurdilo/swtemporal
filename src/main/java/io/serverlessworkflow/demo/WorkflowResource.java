package io.serverlessworkflow.demo;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import io.serverlessworkflow.api.Workflow;
import io.serverlessworkflow.demo.temporal.ServerlessWorkflowUtils;
import io.temporal.api.common.v1.WorkflowExecution;
import io.temporal.client.WorkflowOptions;
import io.temporal.client.WorkflowStub;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@ApplicationScoped
@Path("/runworkflow")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class WorkflowResource {

    @Inject
    WorkflowApplicationObserver observer;

    @ConfigProperty(name = "sw.task.queue")
    String taskQueue;

    @ConfigProperty(name = "sw.id.prefix")
    String idPrefix;

    private static final Logger LOG = Logger.getLogger(WorkflowResource.class);

    @POST
    public JsonNode runWorkflow(JsonNode workflowDslAndData) {

        String workflowData = workflowDslAndData.get("workflowdata").asText();
        String workflowDsl = workflowDslAndData.get("workflowdsl").asText();

        WorkflowOptions workflowOptions =
                WorkflowOptions.newBuilder().setTaskQueue(taskQueue)
                        .setWorkflowId(idPrefix + ServerlessWorkflowUtils.getRandomInRange(1, 100)).build();

        WorkflowStub workflowStub = observer.getClient().newUntypedWorkflowStub("TemporalServerlessWorkflow", workflowOptions);
        Workflow workflow = Workflow.fromSource(workflowDsl);

        try {
            WorkflowExecution workflowExecution = ServerlessWorkflowUtils.startWorkflow(workflowStub,
                    workflow, ServerlessWorkflowUtils.mapper.readTree(workflowData));
            LOG.info("Starting workflow with id: " + workflowExecution.getWorkflowId() + " and runId: " +
                    workflowExecution.getRunId());

            JsonNode resultNode = workflowStub.getResult(JsonNode.class);
            LOG.info("Workflow execution result:\n" + resultNode.toPrettyString());
            return resultNode;
        } catch (JsonProcessingException e) {
            return ServerlessWorkflowUtils.getErrorData(e.getMessage());
        }
    }
}
