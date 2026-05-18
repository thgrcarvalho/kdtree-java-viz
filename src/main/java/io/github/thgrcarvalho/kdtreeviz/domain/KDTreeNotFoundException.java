package io.github.thgrcarvalho.kdtreeviz.domain;

public class KDTreeNotFoundException extends RuntimeException {

    public KDTreeNotFoundException(String id) {
        super("KDTree not found: " + id);
    }
}
