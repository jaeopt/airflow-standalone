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
import { OPTIMIZELY_BUCKETING_ID_KEY } from "src/constants/localStorage";

// A random per-browser id rather than the Airflow username: bucketing only needs to be
// stable, and deliberately not identifying keeps usernames out of the vendor's event
// payloads. Falls back to an ephemeral id when storage is unavailable (private mode,
// storage disabled), which costs re-bucketing on reload but never throws.
export const getBucketingId = (storage: Storage = globalThis.localStorage): string => {
  try {
    const existing = storage.getItem(OPTIMIZELY_BUCKETING_ID_KEY);

    if (existing !== null && existing !== "") {
      return existing;
    }

    const created = globalThis.crypto.randomUUID();

    storage.setItem(OPTIMIZELY_BUCKETING_ID_KEY, created);

    return created;
  } catch {
    return globalThis.crypto.randomUUID();
  }
};
