"use strict";
// Copyright The Helm Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
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
const exec = __importStar(require("@actions/exec"));
const path = __importStar(require("path"));
const defaultChartTestingImage = "quay.io/helmpack/chart-testing:v2.4.0";
const defaultKubeconfig = path.join(process.env["HOME"] || "", ".kube", "config");
class ChartTesting {
    constructor(image, config, command, kubeconfig, context) {
        this.image = image;
        this.config = config;
        this.command = command;
        this.kubeconfig = kubeconfig;
        this.context = context;
        this.containerRunning = false;
        if (image === "") {
            this.image = defaultChartTestingImage;
        }
        if (command === "") {
            throw new Error("command is required");
        }
        if (kubeconfig === "") {
            this.kubeconfig = defaultKubeconfig;
        }
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.runInContainer("ct", this.command);
        });
    }
    startContainer() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Running ct...");
            let args = ["pull", this.image];
            yield exec.exec("docker", args);
            const workspace = process.env[`GITHUB_WORKSPACE`] || "";
            args = [
                "run",
                "--rm",
                "--interactive",
                "--detach",
                "--network=host",
                "--name=ct",
                `--volume=${workspace}/${this.config}:/etc/ct/ct.yaml`,
                `--volume=${workspace}:/workdir`,
                "--workdir=/workdir",
                this.image,
                "cat"
            ];
            yield exec.exec("docker", args);
            this.containerRunning = true;
            yield this.runInContainer("mkdir", "-p", "/root/.kube");
            yield exec.exec("docker", ["cp", this.kubeconfig, "ct:/root/.kube/config"]);
            if (this.context !== "") {
                yield exec.exec("kubectl", ["config", "use-context", this.context]);
            }
        });
    }
    runInContainer(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.containerRunning) {
                yield this.startContainer();
            }
            let procArgs = ["exec", "--interactive", "ct"];
            procArgs.push(...args);
            yield exec.exec("docker", procArgs);
        });
    }
}
exports.ChartTesting = ChartTesting;
