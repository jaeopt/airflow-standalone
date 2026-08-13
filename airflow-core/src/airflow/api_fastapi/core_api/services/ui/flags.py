# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
from __future__ import annotations

import os
from functools import lru_cache

from optimizely import optimizely

_DAGS_SEARCH_FLAG_KEY = "airflow-1"
_ADVANCED_SEARCH_ON_VARIATION = "variant_b_advanced_on"


@lru_cache(maxsize=1)
def _get_optimizely_client() -> optimizely.Optimizely:
    sdk_key = os.environ.get("OPTIMIZELY_SDK_KEY", "")
    return optimizely.Optimizely(sdk_key=sdk_key)


def get_dags_search_advanced_default(user_id: str) -> bool:
    """Whether the DAGs List search should default to advanced/regex mode for this user."""
    user_context = _get_optimizely_client().create_user_context(user_id)
    if user_context is None:
        return False
    decision = user_context.decide(_DAGS_SEARCH_FLAG_KEY)
    return decision.enabled and decision.variation_key == _ADVANCED_SEARCH_ON_VARIATION
