package io.github.thgrcarvalho.kdtreeviz.web;

import io.github.thgrcarvalho.kdtreeviz.application.KdTreeApplicationService;
import io.github.thgrcarvalho.kdtree.domain.KDTree;
import io.github.thgrcarvalho.kdtreeviz.web.dto.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tree")
public class KdTreeController {

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
        var query = request.query();
        var nearest = service.nearest(id, query);
        if (nearest == null)
            return new NearestResponse(null, Double.NaN, List.of());
        var distance = Math.sqrt(squaredDistance(nearest, query));
        // TODO: populate trace from KDTree traversal once implemented
        return new NearestResponse(nearest, distance, List.of());
    }

    @PostMapping("/{id}/range")
    public RangeResponse range(@PathVariable String id, @RequestBody RangeRequest request) {
        var matches = service.rangeSearch(id, request.min(), request.max());
        // TODO: populate trace from KDTree traversal once implemented
        return new RangeResponse(matches, List.of());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void reset(@PathVariable String id) {
        service.deleteKDTree(id);
    }

    private TreeResponse toTreeResponse(KDTree kdTree) {
        // TODO: replace null root with toNodeDto(kdTree.root()) once KDTree is
        // implemented
        // return new TreeResponse(kdTree.getId(), kdTree.getDimensions(),
        // kdTree.size(), null, kdTree.points());
        return null;
    }

    private static double squaredDistance(double[] a, double[] b) {
        double sum = 0;
        for (int i = 0; i < a.length; i++)
            sum += (a[i] - b[i]) * (a[i] - b[i]);
        return sum;
    }
}
