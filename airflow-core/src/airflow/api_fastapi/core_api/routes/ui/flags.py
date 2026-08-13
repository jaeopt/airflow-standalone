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

from fastapi import Depends

from airflow.api_fastapi.common.router import AirflowRouter
from airflow.api_fastapi.core_api.datamodels.ui.flags import DagsSearchDefaultsResponse
from airflow.api_fastapi.core_api.security import GetUserDep, requires_authenticated
from airflow.api_fastapi.core_api.services.ui.flags import get_dags_search_advanced_default

flags_router = AirflowRouter(tags=["Flags"])


@flags_router.get(
    "/flags/dags_search_defaults",
    dependencies=[Depends(requires_authenticated())],
)
def get_dags_search_defaults(user: GetUserDep) -> DagsSearchDefaultsResponse:
    """Get the DAGs List search defaults for the current user."""
    advanced_search_default = get_dags_search_advanced_default(str(user.get_id()))
    return DagsSearchDefaultsResponse(advanced_search_default=advanced_search_default)
