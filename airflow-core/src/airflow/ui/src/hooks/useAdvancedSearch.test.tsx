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
import { renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { afterEach, describe, expect, it } from "vitest";

import { advancedSearchKey } from "src/constants/localStorage";
import { SearchDefaultContext } from "src/context/optimizely/searchDefault";

import { useAdvancedSearch } from "./useAdvancedSearch";

const wrapperWith =
  (advancedByDefault: boolean) =>
  ({ children }: PropsWithChildren) => (
    <SearchDefaultContext.Provider value={advancedByDefault}>{children}</SearchDefaultContext.Provider>
  );

afterEach(() => {
  globalThis.localStorage.clear();
});

describe("useAdvancedSearch", () => {
  it("starts enabled on the Dags list when the flag serves the advanced-on variant", () => {
    const { result } = renderHook(() => useAdvancedSearch("dags"), { wrapper: wrapperWith(true) });

    expect(result.current.enabled).toBe(true);
  });

  it("starts disabled on the Dags list for the control variant", () => {
    const { result } = renderHook(() => useAdvancedSearch("dags"), { wrapper: wrapperWith(false) });

    expect(result.current.enabled).toBe(false);
  });

  it("leaves other searchbars on the prefix-search default", () => {
    const { result } = renderHook(() => useAdvancedSearch("pools"), { wrapper: wrapperWith(true) });

    expect(result.current.enabled).toBe(false);
  });

  it("keeps a stored preference over the flag default", () => {
    globalThis.localStorage.setItem(advancedSearchKey("dags"), JSON.stringify(false));

    const { result } = renderHook(() => useAdvancedSearch("dags"), { wrapper: wrapperWith(true) });

    expect(result.current.enabled).toBe(false);
  });
});
