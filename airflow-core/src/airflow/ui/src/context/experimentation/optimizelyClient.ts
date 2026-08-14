/*!
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import {
  createBatchEventProcessor,
  createInstance,
  createPollingProjectConfigManager,
} from "@optimizely/react-sdk";

// Optimizely SDK keys are meant to be embedded in client bundles — each one only unlocks the
// public datafile for a single environment. This key is scoped to the Development environment,
// where the "airflow-1" flag's experiment is running; the flag is disabled in Production, so
// this integration is a no-op there regardless of which environment this UI build is served from.
const OPTIMIZELY_SDK_KEY = "5gNMbgfacTvisHLDmscvK";

export const optimizelyClient = createInstance({
  eventProcessor: createBatchEventProcessor(),
  projectConfigManager: createPollingProjectConfigManager({ sdkKey: OPTIMIZELY_SDK_KEY }),
});
