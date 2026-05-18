package io.github.thgrcarvalho.kdtreeviz.infrastructure;

import io.github.thgrcarvalho.kdtree.domain.KDTree;
import io.github.thgrcarvalho.kdtreeviz.domain.KDTreeRepository;
import org.springframework.stereotype.Repository;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class InMemoryKDTreeRepository implements KDTreeRepository {

    private final Map<String, KDTree> store = new ConcurrentHashMap<>();

    @Override
    public KDTree save(KDTree kdTree) {
        store.put(kdTree.getId(), kdTree);
        return kdTree;
    }

    @Override
    public Optional<KDTree> findById(String id) {
        return Optional.ofNullable(store.get(id));
    }

    @Override
    public void deleteById(String id) {
        store.remove(id);
    }
}
