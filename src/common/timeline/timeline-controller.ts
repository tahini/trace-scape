/*
 * Copyright (C) 2017 École Polytechnique de Montréal
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { TimelineViewModel, TimelineEntry } from './timeline-viewmodel';
import { ITimelineModelProvider } from './../protocol/timeline-model-provider';
import { TimelineRequestFilter } from './../filter/timeline-request-filter';
import { BaseRequestFilter } from './../filter/base-request-filter';
import { ModelResponse } from '../protocol/model-response';
import { Status } from './../protocol/model-response';
import { VisibleWindow } from './../visible-window';
import { eventType } from './../events';
import { Utils } from './../utils';
import { Key } from './../key';

export class TimelineController {

    private readonly WAIT_BEFORE_REQUEST = 700;
    private readonly ZOOM_PERCENT = 0.05;

    private modelProvider_: ITimelineModelProvider;
    private visibleWindow_: VisibleWindow;
    private viewModel_: TimelineViewModel;

    /* Key bindings */
    private plus_: Key;
    private minus_: Key;
    private left_: Key;
    private right_: Key;

    constructor(viewWidth: number, modelProvider: ITimelineModelProvider) {
        this.modelProvider_ = modelProvider;
        this.visibleWindow_ = {
            min: this.modelProvider_.trace.start,
            max: this.modelProvider_.trace.end,
            count: viewWidth
        };
        this.viewModel_ = {
            entries: new Array(),
            events: new Array(),
            arrows: new Array(),
            context: this.visibleWindow_
        };

        this.initKeys();
        window.addEventListener(eventType.RANGE_SELECTED, this.rangeSelected.bind(this));
        window.addEventListener(eventType.RESET_RANGE, this.resetRange.bind(this));
    }

    public async inflate(visibleWindow?: VisibleWindow) {
        if (visibleWindow !== undefined) {
            this.visibleWindow_ = visibleWindow;
            this.viewModel_.context = this.visibleWindow_;
        }
        this.update();
    }

    get viewModel() {
        return this.viewModel_;
    }

    private async update() {
        let treeComplete = false;
        let eventComplete = false;
        let treeStatus: Status, eventStatus: Status;

        do {
            if (!treeComplete) {
                treeStatus = await this.updateTree();
                treeComplete = (treeStatus === Status.COMPLETED);
            }

            if (!eventComplete) {
                eventStatus = await this.updateData();
                eventComplete = (treeStatus === Status.COMPLETED);
            }

            window.dispatchEvent(new Event(eventType.TIMEGRAPH_CHANGED));
            await Utils.wait(this.WAIT_BEFORE_REQUEST);
        } while (!(treeComplete && eventComplete));
    }

    private async updateTree() : Promise <Status> {
        let filter: BaseRequestFilter = {
            start: this.visibleWindow_.min,
            end: this.visibleWindow_.max,
            count: this.visibleWindow_.count,
        };

        let response = await this.modelProvider_.fetchEntries(filter);
        this.viewModel_.entries = response.model;
        return response.status;
    }

    private async updateData() : Promise <Status> {
        let filter: TimelineRequestFilter = {
            start: this.visibleWindow_.min,
            end: this.visibleWindow_.max,
            count: this.visibleWindow_.count,
            entries: this.viewModel_.entries.map((entry) => entry.id)
        };

        let response = await this.modelProvider_.fetchEvents(filter);
        this.viewModel_.events = response.model;
        return response.status;
    }

    private resetRange(e: CustomEvent) {
        this.visibleWindow_.min = this.modelProvider_.trace.start;
        this.visibleWindow_.max = this.modelProvider_.trace.end;
        this.update();
    }

    private rangeSelected(e: CustomEvent) {
        this.visibleWindow_.min = e.detail.start.x;
        this.visibleWindow_.max = e.detail.end.x;
        this.update();
    }

    public zoomIn() {
        let delta = this.visibleWindow_.max - this.visibleWindow_.min;
        this.visibleWindow_.max = Math.round(this.visibleWindow_.min + (delta * (1 - this.ZOOM_PERCENT)));
        this.update();
    }

    public zoomOut() {
        let delta = this.visibleWindow_.max - this.visibleWindow_.min;
        this.visibleWindow_.max = Math.round(this.visibleWindow_.min + (delta * (1 + this.ZOOM_PERCENT)));
        this.update();
    }

    public panLeft() {
        let delta = (this.visibleWindow_.max - this.visibleWindow_.min) * this.ZOOM_PERCENT;
        this.visibleWindow_.max = Math.round(this.visibleWindow_.max - delta);
        this.visibleWindow_.min = Math.round(this.visibleWindow_.min - delta);
        this.update();
    }

    public panRight() {
        let delta = (this.visibleWindow_.max - this.visibleWindow_.min) * this.ZOOM_PERCENT;
        this.visibleWindow_.max = Math.round(this.visibleWindow_.max + delta);
        this.visibleWindow_.min = Math.round(this.visibleWindow_.min + delta);
        this.update();
    }

    private initKeys() {
        this.plus_ = new Key(107);
        this.plus_.press = this.zoomIn.bind(this);

        this.minus_ = new Key(109);
        this.minus_.press = this.zoomOut.bind(this);

        this.left_ = new Key(37);
        this.left_.press = this.panLeft.bind(this);

        this.right_ = new Key(39);
        this.right_.press = this.panRight.bind(this);
    }
}
