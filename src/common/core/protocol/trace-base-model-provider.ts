/*
 * Copyright (C) 2018 École Polytechnique de Montréal
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { Trace } from './../model/trace';
import { EventType } from './../../base/events';

export class TraceBaseModelProvider {

    protected trace_: Trace;

    constructor(trace: Trace) {
        this.trace_ = trace;
    }

    get trace() {
        return this.trace_;
    }

    set trace(trace: Trace) {
        this.trace_ = trace;
    }

    protected listenForTraceChange() {
        window.addEventListener(EventType.TRACE_CHANGED, (e: CustomEvent) => {
            this.trace_ = e.detail.model as Trace;
            window.dispatchEvent(new Event(EventType.MODEL_PROVIDER_CHANGED));
        });
    }
}
