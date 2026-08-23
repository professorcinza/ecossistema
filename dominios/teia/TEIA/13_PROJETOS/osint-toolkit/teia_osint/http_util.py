"""Shared HTTP helpers with polite defaults."""

from __future__ import annotations

import json
import time
import urllib.error
import urllib.parse
import urllib.request
from typing import Any

USER_AGENT = "TEIA-osint-toolkit/0.1 (+https://github.com/mouracleiton/TEIA; research/accountability)"
DEFAULT_TIMEOUT = 30


def get_json(
    url: str,
    headers: dict[str, str] | None = None,
    params: dict[str, Any] | None = None,
    timeout: int = DEFAULT_TIMEOUT,
    retries: int = 2,
) -> tuple[Any | None, str | None]:
    if params:
        q = urllib.parse.urlencode({k: v for k, v in params.items() if v is not None})
        url = f"{url}?{q}" if "?" not in url else f"{url}&{q}"

    hdrs = {"User-Agent": USER_AGENT, "Accept": "application/json"}
    if headers:
        hdrs.update(headers)

    last_err = None
    for attempt in range(retries + 1):
        try:
            req = urllib.request.Request(url, headers=hdrs, method="GET")
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                raw = resp.read().decode("utf-8", errors="replace")
                return json.loads(raw), None
        except urllib.error.HTTPError as e:
            last_err = f"HTTP {e.code} for {url}"
            if e.code in (429, 500, 502, 503, 504) and attempt < retries:
                time.sleep(1.5 * (attempt + 1))
                continue
            return None, last_err
        except Exception as e:  # noqa: BLE001 — surface to result.errors
            last_err = f"{type(e).__name__}: {e}"
            if attempt < retries:
                time.sleep(1.0 * (attempt + 1))
                continue
            return None, last_err
    return None, last_err
