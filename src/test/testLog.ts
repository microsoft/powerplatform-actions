// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { Logger } from "../lib";
import { createLogger, format, transports } from 'winston';
import path = require("path");

export class TestLog implements Logger {
    private _showTestLogs = process.env.DEBUG ?? false;
    private _logger;

    public constructor(logFile: string) {
        logFile = path.resolve(__dirname, '..', '..', 'out', 'logs', logFile);

        this._logger = createLogger({
            level: 'info',
            format: format.combine(
                format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss'
                }),
                format.prettyPrint()
            ),
            transports: [
                new transports.File({ filename: logFile })
            ]
        });

        if (this._showTestLogs) {
            this._logger.add(new transports.Console({
                format: format.combine(
                    format.colorize(),
                    format.simple()
                )
            }));
        }
    }

    info(...args: string[]): void {
        this._logger.log('info', args);
    }

    warn(...args: string[]): void {
        this._logger.log('warn', args);
    }

    error(...args: string[]): void {
        this._logger.log('error', args);
    }
}
