/*
 * Copyright (C) 2017 École Polytechnique de Montréal
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { TimelineViewModel } from './timeline-viewmodel';
import { TimelinePresentation } from './timeline-presentation';
import { colors } from './../ui/colors';
import { IChart } from './../base/chart';
import { IDictionary, Dictionary } from './../base/dictionary';

export class TimelineChart implements IChart {

    public graphicsContainer: PIXI.Container;

    private viewModel_: TimelineViewModel;
    private timelinePresentation_: TimelinePresentation;
    private rows_: IDictionary<PIXI.Graphics>;

    private nbRows_: number;

    constructor(height: number) {
        this.graphicsContainer = new PIXI.Container();
        this.timelinePresentation_ = new TimelinePresentation();
        this.rows_ = new Dictionary();

        /* This is arbitrary for the moment */
        this.nbRows_ = height / 10;
    }

    public draw() {
        this.clear();
        let viewModelContext = this.viewModel_.context;
        for (let event of this.viewModel_.events) {
            let eventGraphic = this.rows_.get(event.entryID.toString());
            if (eventGraphic === undefined) {
                continue;
            }
            for (let state of event.states) {
                let color = this.timelinePresentation_.getColorOfState(state.value);
                if (color === undefined) {
                    continue;
                }
                let resolution = (viewModelContext.max - viewModelContext.min) / viewModelContext.count;
                let start = Math.max(state.startTime, viewModelContext.min);
                let x = Math.round((start - viewModelContext.min) / resolution);
                let y = (event.entryID + 1) * 20;
                let width = Math.round(state.duration / resolution);

                eventGraphic.beginFill(color, 1);
                eventGraphic.drawRect(x, y, width, this.timelinePresentation_.getThicknessOfState(state.value));
                eventGraphic.endFill();
            }
        }
    }

    public clear() {
        this.rows_.values().forEach(e => e.clear());
    }

    set model(model: TimelineViewModel) {
        if (model !== undefined) {
            this.viewModel_ = model;
            this.rows_.clear();
            for (let entry of this.viewModel_.entries) {
                if (this.nbRows_ < this.rows_.count()) {
                    break;
                }
                if (!this.rows_.contains(entry.id.toString())) {
                    let graphics = new PIXI.Graphics();
                    this.rows_.add(entry.id.toString(), graphics);
                    this.graphicsContainer.addChild(graphics);
                }
            }
        }
    }
}
