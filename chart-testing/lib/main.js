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
const core = __importStar(require("@actions/core"));
const ct_1 = require("./ct");
const ImageInput = "image";
const ConfigInput = "config";
const CommandInput = "command";
const KubeconfigInput = "kubeconfig";
const ContextInput = "context";
function createChartTesting() {
    const image = core.getInput(ImageInput);
    const config = core.getInput(ConfigInput);
    const command = core.getInput(CommandInput, { required: true });
    const kubeconfig = core.getInput(KubeconfigInput);
    const context = core.getInput(ContextInput);
    return new ct_1.ChartTesting(image, config, command, kubeconfig, context);
}
exports.createChartTesting = createChartTesting;
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ct = createChartTesting();
            yield ct.execute();
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
