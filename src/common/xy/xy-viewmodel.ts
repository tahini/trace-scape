/*
 * Copyright (C) 2017 École Polytechnique de Montréal
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

export interface XYViewModel {
    title: string;
    entries: Array<XYEntries>;
    series: Array<XYSeries>;
}

export interface XYSeries {
    name: string;
    x: Array<number>;
    y: Array<number>;
}

// TO COMPLETE
export interface XYEntries {
    id: number;
    parentId: number;
}
