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
import { describe, expect, it } from "vitest";

import { resolveAdvancedDefault } from "./useDagsListSearchDefault";

describe("resolveAdvancedDefault", () => {
  it.each([
    ["off", false],
    ["on", true],
    ["variant_a_advanced_off", false],
    ["variant_b_advanced_on", true],
  ])("maps the %s variation to %s", (variationKey, expected) => {
    expect(resolveAdvancedDefault(variationKey)).toBe(expected);
  });

  it.each([[null], [undefined], ["a_variation_added_after_this_release"]])(
    "falls back to the historical default for %s",
    (variationKey) => {
      expect(resolveAdvancedDefault(variationKey)).toBe(false);
    },
  );
});
