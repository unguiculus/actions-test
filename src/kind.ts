import * as core from '@actions/core';
import * as toolCache from '@actions/tool-cache';
import * as exec from '@actions/exec';
import * as io from '@actions/io';
import * as path from 'path';

const defaultKindVersion = "v0.5.1";

export class Kind {
    constructor(readonly version: string, readonly configFile: string, readonly nodeImage: string,
                readonly clusterName: string, readonly waitDuration: string, readonly logLevel: string) {
        if (version === "") {
            this.version = defaultKindVersion;
        }
    }

    async install() {
        console.log("installing kind...");
        const downloadUrl = `https://github.com/kubernetes-sigs/kind/releases/download/${this.version}/kind-linux-amd64`;
        console.log("downloading kind from '" + downloadUrl + "'...");

        let kindBinary: string | null = null;
        kindBinary = await toolCache.downloadTool(downloadUrl);
        const binDir = path.join(process.env["HOME"] || "", "bin");

        await io.mkdirP(binDir);
        await exec.exec("chmod", ["+x", kindBinary]);

        console.log("moving kind binary to '" + binDir + "'...");
        await io.mv(kindBinary, path.join(binDir, "kind"));

        core.addPath(kindBinary);
    }

    async createCluster() {
        console.log("creating kind cluster...");

        const commandLine = this.createCommandLine();
        console.log("kind commandline: kind " + commandLine.join(" "));

        await exec.exec("kind", commandLine);
    }

    private createCommandLine(): string[] {
        let args: string[] = ["create", "cluster"];
        if (this.configFile !== "") {
            const workspace: string = process.env[`GITHUB_WORKSPACE`] || "";
            const cfgPath: string = path.join(workspace, this.configFile);
            args.push("--config", cfgPath);
        }
        if (this.nodeImage !== "") {
            args.push("--image", this.nodeImage);
        }
        if (this.clusterName !== "") {
            args.push("--name", this.clusterName);
        }
        if (this.waitDuration !== "") {
            args.push("--wait", this.waitDuration);
        }
        if (this.logLevel !== "") {
            args.push("--loglevel", this.logLevel)
        }
        return args;
    }
}
