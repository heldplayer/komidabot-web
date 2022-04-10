#!/usr/bin/env python3

import configparser
import os
import subprocess
import sys


if __name__ == "__main__":
    if not os.getenv("VIRTUAL_ENV"):
        print("Must be run inside a virtual environment", file=sys.stderr)
        sys.exit(1)

    config = configparser.ConfigParser()
    config.read_file(open(os.getenv("CONFIG_FILE", "deploy.ini")))

    config_section = os.getenv("CONFIGURATION", "development")

    result = subprocess.run(["ng", "build", "--aot", f"--configuration={config.get(config_section, 'BUILD_CONFIGURATION')}"])
    if result.returncode != 0:
        sys.exit(result.returncode)

    result = subprocess.run(["rsync", "--recursive", "--delete", "--chown=www-data:www-data", "--progress", "--human-readable", "dist/komidabot-web/", config.get(config_section, "UPLOAD_DESTINATION")])
    if result.returncode != 0:
        sys.exit(result.returncode)
