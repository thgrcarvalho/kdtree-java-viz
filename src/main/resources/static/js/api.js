const BASE = '/api/tree';

export async function createTree(dimensions = 2) {
    const res = await fetch(BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dimensions })
    });
    if (!res.ok) throw new Error('createTree failed: ' + res.status);
    return res.json();
}

export async function getTree(id) {
    const res = await fetch(`${BASE}/${id}`);
    if (!res.ok) throw new Error('getTree failed: ' + res.status);
    return res.json();
}

export async function insertPoint(id, coords) {
    const res = await fetch(`${BASE}/${id}/points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coords })
    });
    if (!res.ok) throw new Error('insertPoint failed: ' + res.status);
    return res.json();
}

export async function nearest(id, query) {
    const res = await fetch(`${BASE}/${id}/nearest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
    });
    if (!res.ok) throw new Error('nearest failed: ' + res.status);
    return res.json();
}

export async function rangeSearch(id, min, max) {
    const res = await fetch(`${BASE}/${id}/range`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ min, max })
    });
    if (!res.ok) throw new Error('rangeSearch failed: ' + res.status);
    return res.json();
}

export async function deleteTree(id) {
    const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok && res.status !== 204) throw new Error('deleteTree failed: ' + res.status);
}
