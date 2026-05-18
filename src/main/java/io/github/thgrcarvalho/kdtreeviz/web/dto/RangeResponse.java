package io.github.thgrcarvalho.kdtreeviz.web.dto;

import java.util.List;

public record RangeResponse(List<double[]> points, List<TraceStepDto> trace) {}
