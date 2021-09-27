package io.serverlessworkflow.demo.temporal;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.temporal.activity.Activity;
import io.temporal.activity.DynamicActivity;
import io.temporal.common.converter.EncodedValues;

public class TemporalServerlessActivities implements DynamicActivity {
    private  ObjectMapper mapper = new ObjectMapper();

    @Override
    public Object execute(EncodedValues args) {
        //String activityType = Activity.getExecutionContext().getInfo().getActivityType();
        //JsonNode workflowData = args.get(0, JsonNode.class);
        try {
            // simulate 200 ms "work"
            Thread.sleep(200);
            return mapper.readTree(
                    getReturnJson(Activity.getExecutionContext().getInfo().getActivityType(), "invoked"));
        } catch (Exception e) {
            return null;
        }
    }

    private String getReturnJson(String key, String value) {
        return "{\n" + "  \"" + key + "\": \"" + value + "\"\n" + "}";
    }
}
