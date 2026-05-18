package io.github.thgrcarvalho.kdtreeviz.web.dto;

public record TraceStepDto(
        String type,    // VISIT, PRUNE, CANDIDATE, RESULT
        double[] coords,
        int axis,
        int depth,
        double distance
) {}
