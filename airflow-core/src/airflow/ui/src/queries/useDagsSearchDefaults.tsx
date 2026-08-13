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
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { OpenAPI } from "openapi/requests/core/OpenAPI";

type DagsSearchDefaultsResponse = {
  advanced_search_default: boolean;
};

// TODO: replace this hand-written request with the generated
// `useFlagsServiceGetDagsSearchDefaults` hook from "openapi/queries" once
// `npm run codegen` has been re-run against the new
// GET /ui/flags/dags_search_defaults route.
export const useDagsSearchDefaults = () =>
  useQuery({
    queryFn: async () => {
      const { data } = await axios.get<DagsSearchDefaultsResponse>(
        `${OpenAPI.BASE}/ui/flags/dags_search_defaults`,
        { withCredentials: OpenAPI.CREDENTIALS === "include" },
      );

      return data;
    },
    queryKey: ["dagsSearchDefaults"],
  });
