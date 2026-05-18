package io.github.thgrcarvalho.kdtreeviz.application;

import io.github.thgrcarvalho.kdtree.domain.KDTree;
import io.github.thgrcarvalho.kdtree.domain.NearestTrace;
import io.github.thgrcarvalho.kdtree.domain.QueryTrace;
import io.github.thgrcarvalho.kdtreeviz.domain.KDTreeNotFoundException;
import io.github.thgrcarvalho.kdtreeviz.domain.KDTreeRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class KdTreeApplicationService {

    private final KDTreeRepository repository;

    public KdTreeApplicationService(KDTreeRepository repository) {
        this.repository = repository;
    }

    public KDTree createKDTree(int dimensions) {
        var kdTree = new KDTree(UUID.randomUUID().toString(), dimensions);
        return repository.save(kdTree);
    }

    public KDTree getKDTree(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new KDTreeNotFoundException(id));
    }

    public KDTree insert(String id, double[] coords) {
        var kdTree = getKDTree(id);
        kdTree.insert(coords);
        return repository.save(kdTree);
    }

    public NearestTrace nearestTraced(String id, double[] query) {
        return getKDTree(id).nearestTraced(query);
    }

    public QueryTrace rangeSearchTraced(String id, double[] min, double[] max) {
        return getKDTree(id).rangeSearchTraced(min, max);
    }

    public void deleteKDTree(String id) {
        repository.deleteById(id);
    }
}
