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
import { useDecide, useOptimizelyUserContext, type OptimizelyUserContext } from "@optimizely/react-sdk";
import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { advancedSearchKey } from "src/constants/localStorage";

import { useDagsListSearchExperiment } from "./useDagsListSearchExperiment";

const STORAGE_KEY = advancedSearchKey("dags");

const mockDecision = (variationKey: string | null) => {
  const result: ReturnType<typeof useDecide> =
    variationKey === null
      ? { decision: null, error: null, isLoading: true }
      : {
          decision: {
            enabled: variationKey !== "off",
            flagKey: "airflow-1",
            reasons: [],
            ruleKey: null,
            userContext: {} as unknown as OptimizelyUserContext,
            variables: {},
            variationKey,
          },
          error: null,
          isLoading: false,
        };

  vi.mocked(useDecide).mockReturnValue(result);
};

const trackEvent = vi.fn();

beforeEach(() => {
  const result: ReturnType<typeof useOptimizelyUserContext> = {
    error: null,
    isLoading: false,
    userContext: { trackEvent } as unknown as OptimizelyUserContext,
  };

  vi.mocked(useOptimizelyUserContext).mockReturnValue(result);
});

afterEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe("useDagsListSearchExperiment - default toggle", () => {
  it("applies the variant-B default when nothing is stored yet", () => {
    mockDecision("variant_b_advanced_on");
    const onToggle = vi.fn();

    renderHook(() =>
      useDagsListSearchExperiment({ isSearchLoading: false, onToggle, searchPattern: "", totalEntries: 0 }),
    );

    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it("does not toggle for the control variant", () => {
    mockDecision("variant_a_advanced_off");
    const onToggle = vi.fn();

    renderHook(() =>
      useDagsListSearchExperiment({ isSearchLoading: false, onToggle, searchPattern: "", totalEntries: 0 }),
    );

    expect(onToggle).not.toHaveBeenCalled();
  });

  it("does not override an already-stored user choice", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(false));
    mockDecision("variant_b_advanced_on");
    const onToggle = vi.fn();

    renderHook(() =>
      useDagsListSearchExperiment({ isSearchLoading: false, onToggle, searchPattern: "", totalEntries: 0 }),
    );

    expect(onToggle).not.toHaveBeenCalled();
  });

  it("does not toggle while the decision is still loading", () => {
    mockDecision(null);
    const onToggle = vi.fn();

    renderHook(() =>
      useDagsListSearchExperiment({ isSearchLoading: false, onToggle, searchPattern: "", totalEntries: 0 }),
    );

    expect(onToggle).not.toHaveBeenCalled();
  });
});

describe("useDagsListSearchExperiment - zero-result tracking", () => {
  it("tracks a zero-result search once for a given pattern", () => {
    mockDecision("variant_a_advanced_off");

    const { rerender } = renderHook(
      (props: { totalEntries: number }) =>
        useDagsListSearchExperiment({
          isSearchLoading: false,
          onToggle: vi.fn(),
          searchPattern: "nonexistent",
          totalEntries: props.totalEntries,
        }),
      { initialProps: { totalEntries: 0 } },
    );

    expect(trackEvent).toHaveBeenCalledOnce();
    expect(trackEvent).toHaveBeenCalledWith("zero_result_search");

    rerender({ totalEntries: 0 });

    expect(trackEvent).toHaveBeenCalledOnce();
    expect(trackEvent).toHaveBeenCalledWith("zero_result_search");
  });

  it("does not track when the search is still loading", () => {
    mockDecision("variant_a_advanced_off");

    renderHook(() =>
      useDagsListSearchExperiment({
        isSearchLoading: true,
        onToggle: vi.fn(),
        searchPattern: "nonexistent",
        totalEntries: 0,
      }),
    );

    expect(trackEvent).not.toHaveBeenCalled();
  });

  it("does not track when there is no active search pattern", () => {
    mockDecision("variant_a_advanced_off");

    renderHook(() =>
      useDagsListSearchExperiment({
        isSearchLoading: false,
        onToggle: vi.fn(),
        searchPattern: "",
        totalEntries: 0,
      }),
    );

    expect(trackEvent).not.toHaveBeenCalled();
  });

  it("does not track when there are results", () => {
    mockDecision("variant_a_advanced_off");

    renderHook(() =>
      useDagsListSearchExperiment({
        isSearchLoading: false,
        onToggle: vi.fn(),
        searchPattern: "tutorial",
        totalEntries: 3,
      }),
    );

    expect(trackEvent).not.toHaveBeenCalled();
  });
});

describe("useDagsListSearchExperiment - trackResultClick", () => {
  it("tracks a click-through while a search pattern is active", () => {
    mockDecision("variant_a_advanced_off");

    const { result } = renderHook(() =>
      useDagsListSearchExperiment({
        isSearchLoading: false,
        onToggle: vi.fn(),
        searchPattern: "tutorial",
        totalEntries: 1,
      }),
    );

    result.current.trackResultClick();

    expect(trackEvent).toHaveBeenCalledOnce();
    expect(trackEvent).toHaveBeenCalledWith("search_to_dag_detail_click");
  });

  it("does not track a click-through without an active search pattern", () => {
    mockDecision("variant_a_advanced_off");

    const { result } = renderHook(() =>
      useDagsListSearchExperiment({
        isSearchLoading: false,
        onToggle: vi.fn(),
        searchPattern: "",
        totalEntries: 1,
      }),
    );

    result.current.trackResultClick();

    expect(trackEvent).not.toHaveBeenCalled();
  });
});
