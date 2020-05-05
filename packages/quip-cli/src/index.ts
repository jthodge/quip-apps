import arg from "arg";
import pkg from "../package.json";
import {init, initArgs} from "./init";
import {CLIArgs} from "./types";

const commandMap: {
    [name: string]: (args: CLIArgs) => void | Promise<void>;
} = {
    "init": init,
};

let args: CLIArgs = {_: []};
try {
    args = arg({
        "--help": Boolean,
        "-h": "--help",
        "--version": Boolean,
        "-v": "--version",
        ...initArgs,
    });
} catch (err) {
    if (err.code === "ARG_UNKNOWN_OPTION") {
        console.error(err.message);
        process.exit(1);
    } else {
        throw err;
    }
}

const cmdName = args._.length && args._[0];
const command = commandMap[cmdName];
if (args["--version"]) {
    console.log(pkg.version);
} else if (args["--help"] || !command) {
    process.stdout.write(`quip-cli version ${pkg.version}
usage:
    qla init
`);
} else {
    const promise = command(args);
    if (promise) {
        promise.catch(err => {
            console.error(err.message);
            process.exit(1);
        });
    }
}
