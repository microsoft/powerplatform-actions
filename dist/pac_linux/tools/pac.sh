#!/bin/bash
dotnet "$(dirname "${BASH_SOURCE[0]}")/pac.dll" $@
