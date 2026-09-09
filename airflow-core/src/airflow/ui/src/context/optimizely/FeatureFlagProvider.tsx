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
import { OptimizelyProvider, useDecide } from "@optimizely/react-sdk";
import type { PropsWithChildren } from "react";

import { useAuthLinksServiceGetCurrentUserInfo } from "openapi/queries";
import {
  ADVANCED_SEARCH_ON_VARIATION,
  DAGS_LIST_SEARCH_DEFAULT_FLAG,
  optimizelyClient,
} from "src/optimizely";

import { SearchDefaultContext } from "./searchDefault";

// Bucketing needs an id that is stable for a given person across sessions so
// decisions do not flip underneath them. Anonymous renders share one id and so
// resolve to a single arbitrary variation, which is acceptable because the UI
// requires authentication for the pages under test.
const ANONYMOUS_USER_ID = "anonymous";

// Separate component because `useDecide` throws outside an <OptimizelyProvider>,
// so the decision cannot be read by the same component that renders the provider.
const SearchDefaultFromFlag = ({ children }: PropsWithChildren) => {
  const { decision } = useDecide(DAGS_LIST_SEARCH_DEFAULT_FLAG);

  return (
    <SearchDefaultContext.Provider value={decision?.variationKey === ADVANCED_SEARCH_ON_VARIATION}>
      {children}
    </SearchDefaultContext.Provider>
  );
};

export const FeatureFlagProvider = ({ children }: PropsWithChildren) => {
  const { data: currentUser } = useAuthLinksServiceGetCurrentUserInfo();

  // No SDK key configured: skip the provider entirely and let consumers fall
  // back to the context default rather than shipping a datafile poller.
  if (optimizelyClient === undefined) {
    return children;
  }

  return (
    <OptimizelyProvider client={optimizelyClient} user={{ id: currentUser?.id ?? ANONYMOUS_USER_ID }}>
      <SearchDefaultFromFlag>{children}</SearchDefaultFromFlag>
    </OptimizelyProvider>
  );
};
