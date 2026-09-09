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
import { createInstance, createPollingProjectConfigManager } from "@optimizely/react-sdk";
import type { Client } from "@optimizely/react-sdk";

// Feature flag keys evaluated by the UI. Keep in sync with the Optimizely project.
export const DAGS_LIST_SEARCH_DEFAULT_FLAG = "airflow-1";

// Variation keys for DAGS_LIST_SEARCH_DEFAULT_FLAG. `off`/`on` are the flag's
// default variations; the `variant_*` pair belongs to the A/B rule.
export const ADVANCED_SEARCH_ON_VARIATION = "variant_b_advanced_on";

const sdkKey: string | undefined = import.meta.env.VITE_OPTIMIZELY_SDK_KEY;

// A single client per application: a second one would poll its own datafile and
// could hand different call sites conflicting decisions. Null when no SDK key is
// configured, which is the normal case for a deployment that has not opted in.
export const optimizelyClient: Client | undefined =
  sdkKey === undefined || sdkKey === ""
    ? undefined
    : createInstance({
        projectConfigManager: createPollingProjectConfigManager({ sdkKey }),
      });
