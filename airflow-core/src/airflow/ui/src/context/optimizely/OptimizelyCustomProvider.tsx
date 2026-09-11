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
  createInstance,
  createPollingProjectConfigManager,
  createStaticProjectConfigManager,
  OptimizelyProvider,
} from "@optimizely/react-sdk";
import { useMemo, type PropsWithChildren } from "react";

import { getBucketingId } from "./bucketingId";
import { EMPTY_DATAFILE } from "./emptyDatafile";

const sdkKey = import.meta.env.VITE_OPTIMIZELY_SDK_KEY as string | undefined;

// Feature flagging is opt-in per deployment. Without a key we still mount a provider —
// ``useDecide`` throws without one — but back it with a static empty datafile so an
// Airflow install that never asked for a vendor makes no outbound request and polls
// nothing. Every flag then decides to a null variation, which callers treat as "use the
// built-in default".
export const OptimizelyCustomProvider = ({ children }: PropsWithChildren) => {
  const client = useMemo(
    () =>
      createInstance({
        projectConfigManager:
          sdkKey === undefined || sdkKey === ""
            ? createStaticProjectConfigManager({ datafile: EMPTY_DATAFILE })
            : createPollingProjectConfigManager({ sdkKey }),
      }),
    [],
  );

  const user = useMemo(() => ({ id: getBucketingId() }), []);

  return (
    <OptimizelyProvider client={client} user={user}>
      {children}
    </OptimizelyProvider>
  );
};
