/*
 * Copyright (C) 2017 École Polytechnique de Montréal
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { IComponent } from './component';
import { CpuUsageModelProvider } from './../protocol/xy/cpu-usage-model-provider';
import { XYWidget } from './../xy/xy-widget';
import { Trace } from './../model/trace';

export class CpuUsageComponent implements IComponent {

    private cpuModelProvider_: CpuUsageModelProvider;
    private readonly id_ = 'cpu';

    constructor(serverUrl: string, trace: Trace) {
        this.cpuModelProvider_ = new CpuUsageModelProvider(serverUrl, trace);
    }

    get html(): string {
        return `
        <div class="row">
            <div class="col-md-12">
                <canvas id="${this.id_}-overlay" style="position:absolute; pointer-events:none; z-index: 0;"></canvas>
                <canvas id="${this.id_}" style="z-index: 1;"></canvas>
            </div>
        </div>
        `;
    }

    get name(): string {
        return 'cpu';
    }

    get title(): string {
        return 'CPU Usage';
    }

    public show() {
        let cpu = new XYWidget(this.id_, this.cpuModelProvider_);
        cpu.inflate();
    }
}
