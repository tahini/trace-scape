/*
 * Copyright (C) 2017 École Polytechnique de Montréal
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { VisibleWindow } from './../visible-window';
import { ITreeModel } from '../model/tree-model';

export interface TimelineViewModel {
    entries: TimelineEntry[];
    events: TimelineRowModel[];
    arrows: TimelineArrow[];
    context: VisibleWindow;
}

export interface TimelineEntry extends ITreeModel {
    startTime: number;
    endTime: number;
    name: string;
}

export interface TimelineArrow {
    sourceId: number;
    destinationId: number;
    startTime: number;
    duration: number;
}

export interface TimelineRowModel {
    entryID: number;
    states: TimelineState[];
}

export interface TimelineState {
    startTime: string;
    duration: string;
    value: number;
    label: string;
}
