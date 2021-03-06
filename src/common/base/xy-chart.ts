/*
 * Copyright (C) 2017 École Polytechnique de Montréal
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { XYSeries } from './../core/model/xy-model';
import { IShowable } from './showable';

export interface IXYChart extends IShowable {
    title: string;
    redraw(series: XYSeries[]): void;
    draw(series: XYSeries[]): void;
    clear(): void;
}
