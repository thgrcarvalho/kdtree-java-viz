package io.github.thgrcarvalho.kdtreeviz.web.dto;

import java.util.List;

public record TreeResponse(
        String id,
        int dimensions,
        int size,
        NodeDto root,
        List<double[]> points
) {}
