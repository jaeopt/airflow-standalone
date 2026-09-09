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
import { describe, expect, it } from "vitest";

import { SearchDefaultContext } from "src/context/optimizely/searchDefault";

import { useSearchDefaultVariant } from "./useSearchDefaultVariant";

const wrapperWith =
  (advancedByDefault: boolean) =>
  ({ children }: PropsWithChildren) => (
    <SearchDefaultContext.Provider value={advancedByDefault}>{children}</SearchDefaultContext.Provider>
  );

describe("useSearchDefaultVariant", () => {
  it.each([
    { advancedByDefault: true, expected: true, key: "dags" },
    { advancedByDefault: false, expected: false, key: "dags" },
    // The experiment is scoped to the Dags list, so other searchbars stay on the control.
    { advancedByDefault: true, expected: false, key: "pools" },
    { advancedByDefault: true, expected: false, key: "variables" },
  ])(
    "returns $expected for key $key when the flag resolves to $advancedByDefault",
    ({ advancedByDefault, expected, key }) => {
      const { result } = renderHook(() => useSearchDefaultVariant(key), {
        wrapper: wrapperWith(advancedByDefault),
      });

      expect(result.current).toBe(expected);
    },
  );

  it("defaults to the control when no provider is present", () => {
    const { result } = renderHook(() => useSearchDefaultVariant("dags"));

    expect(result.current).toBe(false);
  });
});
