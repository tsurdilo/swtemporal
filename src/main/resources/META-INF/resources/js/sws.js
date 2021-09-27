/**
 * Copyright 2020 The Serverless Workflow Specification Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

$(document).ready(function(){
  $('a[data-toggle="tab"]').on('shown.bs.tab', function(e){
    var activeTab = $(e.target).text(); // Get the name of active tab
    var previousTab = $(e.relatedTarget).text(); // Get the name of previous tab
    $(".active-tab span").html(activeTab);
    $(".previous-tab span").html(previousTab);
  });
});