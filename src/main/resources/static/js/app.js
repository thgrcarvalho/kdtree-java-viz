import * as api from './api.js';
import { Canvas2D } from './canvas2d.js';
import { TreeView } from './treeview.js';
import { TracePlayer } from './trace.js';

const canvas = document.getElementById('canvas');
const canvas2d = new Canvas2D(canvas);
const treeView = new TreeView(document.getElementById('tree'));
const traceList = document.getElementById('trace');
const tracePlayer = new TracePlayer(canvas2d, treeView, traceList);
const status = document.getElementById('status');
const hint = document.getElementById('hint');

let treeId = null;
let mode = 'insert';
let dragStart = null;

const hints = {
    insert: 'Click anywhere to insert a point.',
    nearest: 'Click to query the nearest point — descent + pruning will animate.',
    range: 'Drag to define a rectangular range query.'
};

async function init() {
    const created = await api.createTree(2);
    treeId = created.id;
    status.textContent = `Session ${treeId.substring(0, 8)}…`;
    await refreshTree();
}

async function refreshTree(treeResponse) {
    const t = treeResponse || await api.getTree(treeId);
    canvas2d.setTree(t);
    canvas2d.render();
    treeView.setTree(t);
    treeView.render();
}

function setMode(m) {
    mode = m;
    hint.textContent = hints[m];
    document.querySelectorAll('.mode').forEach(b => {
        b.classList.toggle('active', b.dataset.mode === m);
    });
    tracePlayer.cancel();
    canvas2d.clearOverlay();
    canvas2d.render();
    treeView.highlight(null);
    traceList.innerHTML = '';
}

document.querySelectorAll('.mode').forEach(button => {
    button.addEventListener('click', () => setMode(button.dataset.mode));
});

document.getElementById('clear').addEventListener('click', async () => {
    if (!treeId) return;
    await api.deleteTree(treeId);
    await init();
    setMode('insert');
});

function canvasPoint(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return [
        Math.round((event.clientX - rect.left) * scaleX),
        Math.round((event.clientY - rect.top) * scaleY)
    ];
}

function fitCanvas() {
    const rect = canvas.getBoundingClientRect();
    const w = Math.floor(rect.width);
    const h = Math.floor(rect.height);
    if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w;
        canvas.height = h;
        canvas2d.render();
    }
}

new ResizeObserver(fitCanvas).observe(canvas);
window.addEventListener('resize', fitCanvas);

canvas.addEventListener('mousedown', (e) => {
    if (mode === 'range') {
        dragStart = canvasPoint(e);
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (mode === 'range' && dragStart) {
        const p = canvasPoint(e);
        const min = [Math.min(dragStart[0], p[0]), Math.min(dragStart[1], p[1])];
        const max = [Math.max(dragStart[0], p[0]), Math.max(dragStart[1], p[1])];
        canvas2d.setQueryBox(min, max);
        canvas2d.render();
    }
});

canvas.addEventListener('mouseup', async (e) => {
    const p = canvasPoint(e);

    if (mode === 'insert') {
        const response = await api.insertPoint(treeId, p);
        await refreshTree(response.tree);
        return;
    }

    if (mode === 'nearest') {
        canvas2d.clearOverlay();
        canvas2d.setQuery(p);
        canvas2d.render();
        const response = await api.nearest(treeId, p);
        await tracePlayer.play(response.trace || []);
        if (response.nearest) {
            canvas2d.setAnswer(response.nearest);
            canvas2d.render();
            status.textContent = `Nearest: (${response.nearest.join(', ')}) — distance ${response.distance.toFixed(2)}`;
        } else {
            status.textContent = 'Tree is empty.';
        }
        return;
    }

    if (mode === 'range' && dragStart) {
        const min = [Math.min(dragStart[0], p[0]), Math.min(dragStart[1], p[1])];
        const max = [Math.max(dragStart[0], p[0]), Math.max(dragStart[1], p[1])];
        dragStart = null;
        canvas2d.setQueryBox(min, max);
        canvas2d.render();
        if (min[0] === max[0] || min[1] === max[1]) {
            return;
        }
        const response = await api.rangeSearch(treeId, min, max);
        await tracePlayer.play(response.trace || []);
        canvas2d.setMatches(response.points || []);
        canvas2d.render();
        status.textContent = `Range matched ${(response.points || []).length} point(s).`;
    }
});

init().catch(err => {
    status.textContent = 'Init failed: ' + err.message;
    console.error(err);
});
