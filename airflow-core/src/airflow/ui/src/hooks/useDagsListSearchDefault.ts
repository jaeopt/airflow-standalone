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
import { useDecide } from "@optimizely/react-sdk";

export const DAGS_LIST_SEARCH_DEFAULT_FLAG = "airflow-1";

// Advanced (substring) search has always been off until the user opts in; every path that
// is not an explicit "on" variation must keep that.
export const FALLBACK_ADVANCED_DEFAULT = false;

const advancedDefaultByVariation: Record<string, boolean> = {
  off: false,
  on: true,
  variant_a_advanced_off: false,
  variant_b_advanced_on: true,
};

export const resolveAdvancedDefault = (variationKey: string | null | undefined): boolean =>
  advancedDefaultByVariation[variationKey ?? ""] ?? FALLBACK_ADVANCED_DEFAULT;

// Resolves the Dags List advanced-search default from the `airflow-1` flag. Falls back to
// the historical default whenever no decision is available — flagging not configured,
// decision still loading, SDK error, or an unrecognised variation — so the page renders
// immediately and never lands in a half-configured state.
export const useDagsListSearchDefault = (): boolean => {
  const { decision } = useDecide(DAGS_LIST_SEARCH_DEFAULT_FLAG);

  return resolveAdvancedDefault(decision?.variationKey);
};
