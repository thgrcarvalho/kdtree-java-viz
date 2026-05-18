package io.github.thgrcarvalho.kdtreeviz.web;

import io.github.thgrcarvalho.kdtree.domain.KDTree;
import io.github.thgrcarvalho.kdtree.domain.NearestTrace;
import io.github.thgrcarvalho.kdtree.domain.NodeView;
import io.github.thgrcarvalho.kdtree.domain.QueryTrace;
import io.github.thgrcarvalho.kdtree.domain.TraceStep;
import io.github.thgrcarvalho.kdtreeviz.application.KdTreeApplicationService;
import io.github.thgrcarvalho.kdtreeviz.web.dto.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/tree")
public class KdTreeController {

    private static final double UNBOUNDED = 1e18;

    private final KdTreeApplicationService service;

    public KdTreeController(KdTreeApplicationService service) {
        this.service = service;
    }

    @PostMapping
    public CreateTreeResponse create(@RequestBody CreateTreeRequest request) {
        var kdTree = service.createKDTree(request.dimensions());
        return new CreateTreeResponse(kdTree.getId(), kdTree.getDimensions());
    }

    @PostMapping("/{id}/points")
    public InsertResponse insert(@PathVariable String id, @RequestBody InsertRequest request) {
        var kdTree = service.insert(id, request.coords());
        return new InsertResponse(request.coords(), toTreeResponse(kdTree));
    }

    @GetMapping("/{id}")
    public TreeResponse getTree(@PathVariable String id) {
        return toTreeResponse(service.getKDTree(id));
    }

    @PostMapping("/{id}/nearest")
    public NearestResponse nearest(@PathVariable String id, @RequestBody NearestRequest request) {
        NearestTrace result = service.nearestTraced(id, request.query());
        if (result.point() == null) {
            return new NearestResponse(null, Double.NaN, List.of());
        }
        double distance = Math.sqrt(squaredDistance(result.point(), request.query()));
        return new NearestResponse(result.point(), distance, toTraceDtos(result.trace()));
    }

    @PostMapping("/{id}/range")
    public RangeResponse range(@PathVariable String id, @RequestBody RangeRequest request) {
        QueryTrace result = service.rangeSearchTraced(id, request.min(), request.max());
        return new RangeResponse(result.points(), toTraceDtos(result.trace()));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void reset(@PathVariable String id) {
        service.deleteKDTree(id);
    }

    private TreeResponse toTreeResponse(KDTree kdTree) {
        int dimensions = kdTree.getDimensions();
        double[] min = new double[dimensions];
        double[] max = new double[dimensions];
        Arrays.fill(min, -UNBOUNDED);
        Arrays.fill(max, UNBOUNDED);

        NodeDto root = buildNodeDto(kdTree.view(), 0, min, max, "", dimensions);
        List<double[]> points = kdTree.points();
        return new TreeResponse(kdTree.getId(), dimensions, points.size(), root, points);
    }

    private NodeDto buildNodeDto(NodeView view, int depth, double[] min, double[] max, String id, int dimensions) {
        if (view == null) {
            return null;
        }
        int axis = depth % dimensions;
        double[] point = view.point();

        double[] leftMax = max.clone();
        leftMax[axis] = point[axis];

        double[] rightMin = min.clone();
        rightMin[axis] = point[axis];

        NodeDto left = buildNodeDto(view.left(), depth + 1, min, leftMax, id + "L", dimensions);
        NodeDto right = buildNodeDto(view.right(), depth + 1, rightMin, max, id + "R", dimensions);

        return new NodeDto(id.isEmpty() ? "root" : id, point, axis, depth, min, max, left, right);
    }

    private static List<TraceStepDto> toTraceDtos(List<TraceStep> trace) {
        return trace.stream()
                .map(step -> new TraceStepDto(step.kind().name(), step.point(), step.axis()))
                .toList();
    }

    private static double squaredDistance(double[] a, double[] b) {
        double sum = 0;
        for (int i = 0; i < a.length; i++) {
            sum += (a[i] - b[i]) * (a[i] - b[i]);
        }
        return sum;
    }
}
