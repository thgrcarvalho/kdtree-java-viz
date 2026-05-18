package io.github.thgrcarvalho.kdtreeviz.web.dto;

import java.util.List;

public record NearestResponse(double[] nearest, double distance, List<TraceStepDto> trace) {}
