/*
 * Copyright (C) 2017 École Polytechnique de Montréal
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as GoldenLayout from 'golden-layout';

import { ITreeModelProvider } from '../core/protocol/tree-model-provider';
import { ProjectExplorerModelProvider } from './../core/protocol/project-explorer-model-provider';
import { TreeWidget } from './../tree/tree-widget';
import { BaseGoldenLayoutComponent } from './component';
import { ConfigComponent } from './config-component';
import { ITreeModel } from './../core/model/tree-model';
import { ProjectExplorerModel } from './../core/model/project-explorer-model';
import { TraceManager } from '../core/trace-manager';
import { EventType } from './../base/events';
import { Http } from './../core/http';

export class NavigatorComponent extends BaseGoldenLayoutComponent {

    private treeWidget_: TreeWidget;
    private modelProvider_: ITreeModelProvider;

    constructor(config: ConfigComponent) {
        super(config);
        this.modelProvider_ = new ProjectExplorerModelProvider(this.config_.serverUrl);
    }

    get html(): string {
        return `
            <div>
                <label>Upload a trace</label>
                <input id="file" type="file">
            </div>
            <button id="submit" class="btn btn-outline-secondary btn-sm">Upload</button>
            <div id="${this.config_.id}"></div>
        `;
    }

    get itemConfiguration(): GoldenLayout.ItemConfig {
        return <GoldenLayout.ComponentConfig> {
            id: this.config_.id,
            title: this.config_.name,
            type: 'component',
            componentName: this.config_.name,
            isClosable: false,
        };
    }

    public show() {
        this.treeWidget_ = new TreeWidget(document.getElementById(this.config_.id), this.modelProvider_);
        this.treeWidget_.inflate({
            min: 0,
            max: 100,
            count: 10
        });

        this.treeWidget_.onDoubleClick = async (treeModel: ITreeModel) => {
            let model = treeModel as ProjectExplorerModel;
            let trace = await TraceManager.getInstance().openTrace(model.name, model.path);

            window.dispatchEvent(new CustomEvent(EventType.TRACE_CHANGED, {
                detail: {
                    model: trace
                }
            }));
        };

        let button = document.getElementById("submit");
        button.addEventListener("click", (e: MouseEvent) => {
            const input = document.getElementById('file') as HTMLInputElement;
            const file = input.files[0];
            let data = new FormData();
            data.append('file', file);
            Http.put("http://localhost:8080/tracecompass/traces", data, {
                method: 'PUT',
                mode: 'cors',
                body: data
            });
        });
    }
}
