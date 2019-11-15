"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const toolCache = __importStar(require("@actions/tool-cache"));
const exec = __importStar(require("@actions/exec"));
const io = __importStar(require("@actions/io"));
const path = __importStar(require("path"));
const defaultKindVersion = "v0.5.1";
class Kind {
    constructor(version, configFile, nodeImage, clusterName, waitDuration, logLevel) {
        this.version = version;
        this.configFile = configFile;
        this.nodeImage = nodeImage;
        this.clusterName = clusterName;
        this.waitDuration = waitDuration;
        this.logLevel = logLevel;
        if (version === "") {
            this.version = defaultKindVersion;
        }
    }
    install() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("installing kind...");
            const downloadUrl = `https://github.com/kubernetes-sigs/kind/releases/download/${this.version}/kind-linux-amd64`;
            console.log("downloading kind from '" + downloadUrl + "'...");
            let kindBinary = null;
            kindBinary = yield toolCache.downloadTool(downloadUrl);
            const binDir = path.join(process.env["HOME"] || "", "bin");
            console.log("moving kind to '" + binDir + "'...");
            yield io.mkdirP(binDir);
            yield exec.exec("chmod", ["+x", kindBinary]);
            yield io.mv(kindBinary, path.join(binDir, "kind"));
            core.addPath(kindBinary);
        });
    }
    createCluster() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("creating kind cluster...");
            const commandLine = this.createCommandLine();
            console.log("kind args: " + commandLine);
            yield exec.exec("kind", commandLine);
        });
    }
    createCommandLine() {
        let args = ["create", "cluster"];
        if (this.configFile !== "") {
            const workspace = process.env[`GITHUB_WORKSPACE`] || "";
            const cfgPath = path.join(workspace, this.configFile);
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
            args.push("--loglevel", this.logLevel);
        }
        return args;
    }
}
exports.Kind = Kind;
