#!/bin/sh

node -v > /dev/null 2>&1
if test $? -ne 0
then
	echo "node wasn't found in the PATH. Please make sure node is installed and available in the PATH. Exiting..."
	exit 1
else
	SCRIPT_PATH="$(cd "$(dirname "$0")" ; pwd -P)"
	node "$SCRIPT_PATH/../../package/lib/cli/cli.js" "$@"
fi
