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
import { useDecide, useOptimizelyUserContext } from "@optimizely/react-sdk";
import { useEffect, useRef } from "react";

import { advancedSearchKey } from "src/constants/localStorage";

const FLAG_KEY = "airflow-1";
const VARIANT_ADVANCED_ON = "variant_b_advanced_on";
const STORAGE_KEY = advancedSearchKey("dags");

type Params = {
  readonly isSearchLoading: boolean;
  readonly onToggle: (enabled: boolean) => void;
  readonly searchPattern: string;
  readonly totalEntries: number;
};

// Wires the "airflow-1" Dags List Search Default A/B test into the advanced-search toggle:
// seeds its default from the decided variant (once, never overriding an explicit user choice)
// and reports the experiment's two metrics (search_to_dag_detail_click, zero_result_search).
export const useDagsListSearchExperiment = ({
  isSearchLoading,
  onToggle,
  searchPattern,
  totalEntries,
}: Params) => {
  const { decision, isLoading } = useDecide(FLAG_KEY);
  const { userContext } = useOptimizelyUserContext();
  const trackedZeroResultPattern = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (isLoading || decision === null) {
      return;
    }

    if (
      globalThis.localStorage.getItem(STORAGE_KEY) === null &&
      decision.variationKey === VARIANT_ADVANCED_ON
    ) {
      onToggle(true);
    }
  }, [decision, isLoading, onToggle]);

  useEffect(() => {
    if (isSearchLoading || searchPattern === "" || totalEntries > 0) {
      return;
    }

    if (trackedZeroResultPattern.current === searchPattern) {
      return;
    }

    trackedZeroResultPattern.current = searchPattern;
    userContext?.trackEvent("zero_result_search");
  }, [isSearchLoading, searchPattern, totalEntries, userContext]);

  const trackResultClick = () => {
    if (searchPattern !== "") {
      userContext?.trackEvent("search_to_dag_detail_click");
    }
  };

  return { trackResultClick };
};
