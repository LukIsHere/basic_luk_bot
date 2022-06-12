"use strict";

import fs from "fs";

let writeStream;
let cfg = {
    debugEnabled: false,
    logsDir: null,
    useAnsiColours: true
}

function log(logLine, logType) {
    let d = new Date();
    let dateStr =
        d.getFullYear() + "-" +
        "00".slice(0, (0 - d.getMonth().toString().length)) + (d.getMonth() + 1) + "-" +
        "00".slice(0, (0 - d.getDate().toString().length)) + d.getDate() + "  " +
        "00".slice(0, (0 - d.getHours().toString().length)) + d.getHours() + ":" +
        "00".slice(0, (0 - d.getMinutes().toString().length)) + d.getMinutes() + ":" +
        "00".slice(0, (0 - d.getSeconds().toString().length)) + d.getSeconds();
    let formattedLogLine = "[" + dateStr + " | " + logType + "]: " + logLine;
    if (cfg.useAnsiColours) {
        let ansi;
        switch (logType) {
            case " INFO":
                ansi = "\x1b[0;37m";
                break;
            case " WARN":
                ansi = "\x1b[0;93m";
                break;
            case "ERROR":
                ansi = "\x1b[0;91m";
                break;
            case "FATAL":
                ansi = "\x1b[0;31m";
                break;
            case "DEBUG":
                ansi = "\x1b[0;92m";
                break;
            case "ALERT":
                ansi = "\x1b[0;91m";
                break;
        }
        process.stdout.write(ansi + formattedLogLine + "\x1b[0m\n");
    } else {
        process.stdout.write(formattedLogLine + "\n");
    }
    if (writeStream) writeStream.write(formattedLogLine + "\n");
}

function config(obj) {
    let oldCfg = {}
    Object.assign(oldCfg, cfg);
    Object.assign(cfg, obj);
    if (oldCfg.logsDir !== cfg.logsDir) {
        const d = new Date();
        let logFile = cfg.logsDir + "/" + d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + "_" + Math.floor(d.getTime() / 1000) + ".log";
        fs.promises.mkdir(cfg.logsDir, { recursive: true })
            .then(() => {
                writeStream = fs.createWriteStream(logFile);
            })
            .catch((err) => {
                cfg.logsDir = null;
                log("[LOGGER]: FAILED TO CREATE LOGS DIRECTORY AND WRITE STREAM: " + err, "ERROR");
            });
    }
}

function info(logLine) { log(logLine, " INFO") }
function warn(logLine) { log(logLine, " WARN") }
function error(logLine, error) {
    if (typeof error !== undefined && typeof error.stack !== undefined) {
        logLine += " " + error.stack;
    }
    log(logLine, "ERROR");
}
function fatal(logLine, error) {
    if (typeof error !== undefined && typeof error.stack !== undefined) {
        logLine += " " + error.stack;
    }
    log(logLine, "FATAL");
}
function debug(logLine) {
    if (!cfg.debugEnabled) return;
    log(logLine, "DEBUG");
}

export default {
    info,
    warn,
    error,
    fatal,
    debug,
    config
}
