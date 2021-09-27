package io.serverlessworkflow.demo.temporal;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import io.serverlessworkflow.api.actions.Action;
import io.serverlessworkflow.api.events.OnEvents;
import io.serverlessworkflow.api.interfaces.State;
import io.serverlessworkflow.api.states.EventState;
import io.serverlessworkflow.api.states.OperationState;
import io.serverlessworkflow.api.states.SleepState;
import io.serverlessworkflow.api.states.SwitchState;
import io.serverlessworkflow.api.switchconditions.DataCondition;
import io.temporal.activity.ActivityOptions;
import io.temporal.common.converter.EncodedValues;
import io.temporal.workflow.*;
import org.slf4j.Logger;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

public class TemporalServerlessWorkflow implements DynamicWorkflow {

    private Logger logger = Workflow.getLogger(TemporalServerlessWorkflow.class);
    private JsonNode workflowData;
    private io.serverlessworkflow.api.Workflow serverlessWorkflow;
    private ActivityStub activities;


    @Override
    public Object execute(EncodedValues args) {
        String workflowSource = args.get(0, String.class);
        String workflowDataInput = args.get(1, String.class);

        serverlessWorkflow = io.serverlessworkflow.api.Workflow.fromSource(workflowSource);

        if(workflowDataInput != null) {
            try {
                workflowData = ServerlessWorkflowUtils.mapper.readTree(workflowDataInput);
            } catch (JsonProcessingException e) {
                return ServerlessWorkflowUtils.getErrorData(e.getMessage());
            }
        }

        // signal listener -> set workflow data
        Workflow.registerListener(
                (DynamicSignalHandler)
                        (signalName, encodedArgs) -> {
                            try {
                                workflowData = ServerlessWorkflowUtils.mapper.readTree(encodedArgs.get(0, String.class));
                            } catch (JsonProcessingException e) {
                                workflowData = null;
                            }
                        }
        );

        // query listener -> return workflow data
        Workflow.registerListener(
                (DynamicQueryHandler)
                        (queryType, encodedArgs) ->
                                workflowData);

        ActivityOptions activityOptions = ServerlessWorkflowUtils.getActivityOptionsFromDsl(serverlessWorkflow);
        activities = Workflow.newUntypedActivityStub(activityOptions);

        executeDslWorkflowFrom(ServerlessWorkflowUtils.getStartingWorkflowState(serverlessWorkflow));

        return workflowData;
    }

    private void executeDslWorkflowFrom(State dslWorkflowState) {
        if (dslWorkflowState != null) {
            executeDslWorkflowFrom(executeStateAndReturnNext(dslWorkflowState));
        } else {
            return;
        }
    }

    private State executeStateAndReturnNext(State dslWorkflowState) {
        if (dslWorkflowState instanceof EventState) {
            EventState eventState = (EventState) dslWorkflowState;
            // currently this demo supports only the first onEvents
            if (eventState.getOnEvents() != null && eventState.getOnEvents().size() > 0) {
                List<Action> eventStateActions = eventState.getOnEvents().get(0).getActions();
                if (eventState.getOnEvents().get(0).getActionMode() != null
                        && eventState
                        .getOnEvents()
                        .get(0)
                        .getActionMode()
                        .equals(OnEvents.ActionMode.PARALLEL)) {
                    List<Promise<JsonNode>> eventPromises = new ArrayList<>();
                    for (Action action : eventStateActions) {
                        eventPromises.add(
                                activities.executeAsync(
                                        action.getFunctionRef().getRefName(), JsonNode.class, workflowData));
                    }
                    // Invoke all activities in parallel. Wait for all to complete
                    Promise.allOf(eventPromises).get();

                    for (Promise<JsonNode> promise : eventPromises) {
                        addToWorkflowData(promise.get());
                    }
                } else {
                    for (Action action : eventStateActions) {
                        if (action.getSleep() != null && action.getSleep().getBefore() != null) {
                            Workflow.sleep(Duration.parse(action.getSleep().getBefore()));
                        }
                        // execute the action as an activity and assign its results to workflowData
                        addToWorkflowData(
                                activities.execute(
                                        action.getFunctionRef().getRefName(), JsonNode.class, workflowData));
                        if (action.getSleep() != null && action.getSleep().getAfter() != null) {
                            Workflow.sleep(Duration.parse(action.getSleep().getAfter()));
                        }
                    }
                }
            }
            if (eventState.getTransition() == null || eventState.getTransition().getNextState() == null) {
                return null;
            }
            return ServerlessWorkflowUtils.getWorkflowStateWithName(
                    eventState.getTransition().getNextState(), serverlessWorkflow);

        } else if (dslWorkflowState instanceof OperationState) {
            OperationState operationState = (OperationState) dslWorkflowState;
            if (operationState.getActions() != null && operationState.getActions().size() > 0) {
                // Check if actions should be executed sequentially or parallel
                if (operationState.getActionMode() != null
                        && operationState.getActionMode().equals(OperationState.ActionMode.PARALLEL)) {
                    List<Promise<JsonNode>> actionsPromises = new ArrayList<>();
                    for (Action action : operationState.getActions()) {
                        actionsPromises.add(
                                activities.executeAsync(
                                        action.getFunctionRef().getRefName(), JsonNode.class, workflowData));
                    }
                    // Invoke all activities in parallel. Wait for all to complete
                    Promise.allOf(actionsPromises).get();

                    for (Promise<JsonNode> promise : actionsPromises) {
                        addToWorkflowData(promise.get());
                    }
                } else {
                    for (Action action : operationState.getActions()) {
                        if (action.getSleep() != null && action.getSleep().getBefore() != null) {
                            Workflow.sleep(Duration.parse(action.getSleep().getBefore()));
                        }
                        // execute the action as an activity and assign its results to workflowData
                        addToWorkflowData(
                                activities.execute(
                                        action.getFunctionRef().getRefName(), JsonNode.class, workflowData));
                        if (action.getSleep() != null && action.getSleep().getAfter() != null) {
                            Workflow.sleep(Duration.parse(action.getSleep().getAfter()));
                        }
                    }
                }
            }
            if (operationState.getTransition() == null
                    || operationState.getTransition().getNextState() == null) {
                return null;
            }
            return ServerlessWorkflowUtils.getWorkflowStateWithName(
                    operationState.getTransition().getNextState(), serverlessWorkflow);
        } else if (dslWorkflowState instanceof SwitchState) {
            // Demo supports only data based switch
            SwitchState switchState = (SwitchState) dslWorkflowState;
            if (switchState.getDataConditions() != null && switchState.getDataConditions().size() > 0) {
                // evaluate each condition to see if its true. If none are true default to defaultCondition
                for (DataCondition dataCondition : switchState.getDataConditions()) {
                    if (ServerlessWorkflowUtils.isTrueDataCondition(
                            dataCondition.getCondition(), workflowData.toPrettyString())) {
                        if (dataCondition.getTransition() == null
                                || dataCondition.getTransition().getNextState() == null) {
                            return null;
                        }
                        return ServerlessWorkflowUtils.getWorkflowStateWithName(
                                dataCondition.getTransition().getNextState(), serverlessWorkflow);
                    }
                }
                // no conditions evaluated to true, use default condition
                if (switchState.getDefaultCondition().getTransition() == null) {
                    return null;
                }
                return ServerlessWorkflowUtils.getWorkflowStateWithName(
                        switchState.getDefaultCondition().getTransition().getNextState(), serverlessWorkflow);
            } else {
                // no conditions use the transition/end of default condition
                if (switchState.getDefaultCondition().getTransition() == null) {
                    return null;
                }
                return ServerlessWorkflowUtils.getWorkflowStateWithName(
                        switchState.getDefaultCondition().getTransition().getNextState(), serverlessWorkflow);
            }
        } else if (dslWorkflowState instanceof SleepState) {
            SleepState sleepState = (SleepState) dslWorkflowState;
            if (sleepState.getDuration() != null) {
                Workflow.sleep(Duration.parse(sleepState.getDuration()));
            }
            if (sleepState.getTransition() == null || sleepState.getTransition().getNextState() == null) {
                return null;
            }
            return ServerlessWorkflowUtils.getWorkflowStateWithName(
                    sleepState.getTransition().getNextState(), serverlessWorkflow);
        } else {
            logger.error("Invalid or unsupported in demo dsl workflow state: " + dslWorkflowState);
            return null;
        }
    }

    private void addToWorkflowData(JsonNode toAdd) {
        ((ObjectNode) workflowData).putAll(((ObjectNode) toAdd));
    }
}
