package io.github.thgrcarvalho.kdtreeviz.domain;

import io.github.thgrcarvalho.kdtree.domain.KDTree;

import java.util.Optional;

public interface KDTreeRepository {

    KDTree save(KDTree tree);

    Optional<KDTree> findById(String id);

    void deleteById(String id);
}
