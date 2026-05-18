package io.github.thgrcarvalho.kdtreeviz.web.dto;

public record NodeDto(
        String id,
        double[] coords,
        int axis,
        int depth,
        double[] min,
        double[] max,
        NodeDto left,
        NodeDto right
) {}
