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
const kind_1 = require("./kind");
const VersionInput = "version";
const NodeImageInput = "nodeImage";
const ConfigfileInput = "configFile";
const ClusterNameInput = "clusterName";
const WaitDurationInput = "waitDuration";
const LogLevelInput = "logLevel";
function createKind() {
    const version = core.getInput(VersionInput);
    const configFile = core.getInput(ConfigfileInput);
    const nodeImage = core.getInput(NodeImageInput);
    const clusterName = core.getInput(ClusterNameInput);
    const waitDuration = core.getInput(WaitDurationInput);
    const logLevel = core.getInput(LogLevelInput);
    return new kind_1.Kind(version, configFile, nodeImage, clusterName, waitDuration, logLevel);
}
exports.createKind = createKind;
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const kind = createKind();
            yield kind.install();
            yield kind.createCluster();
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
