# Project backup

Source, dashboard, requirements, research configurations and verification tests are backed up to https://github.com/maximumskif/military-terminal. Credentials, local evidence, alert history, funding snapshots and hosting metadata are excluded from this public repository. Local runtime state remains in the workspace and requires a separate private backup.

Run with Node 24+: node server.cjs. Runtime data can be placed in a private directory using SENTINEL_DATA_DIR. SAM credentials are supplied in the local form or SAM_API_KEY environment variable, never source files.
