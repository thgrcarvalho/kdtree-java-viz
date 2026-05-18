export class Canvas2D {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.points = [];
        this.nodes = [];
        this.highlightedPoint = null;
        this.query = null;
        this.queryBox = null;
        this.answer = null;
        this.matches = null;
    }

    setTree(treeResponse) {
        this.points = treeResponse.points || [];
        this.nodes = [];
        if (treeResponse.root) {
            this.collectNodes(treeResponse.root);
        }
    }

    collectNodes(node) {
        this.nodes.push(node);
        if (node.left) this.collectNodes(node.left);
        if (node.right) this.collectNodes(node.right);
    }

    setQuery(point) { this.query = point; }
    setQueryBox(min, max) { this.queryBox = { min, max }; }
    setAnswer(point) { this.answer = point; }
    setMatches(points) { this.matches = points; }
    setHighlight(point) { this.highlightedPoint = point; }

    clearOverlay() {
        this.query = null;
        this.queryBox = null;
        this.answer = null;
        this.matches = null;
        this.highlightedPoint = null;
    }

    render() {
        const ctx = this.ctx;
        const W = this.canvas.width;
        const H = this.canvas.height;

        ctx.clearRect(0, 0, W, H);

        // 1. Splitting lines
        for (const node of this.nodes) {
            this.drawSplit(node, W, H);
        }

        // 2. Query box (range mode)
        if (this.queryBox) {
            ctx.strokeStyle = '#ffc857';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([5, 3]);
            const { min, max } = this.queryBox;
            ctx.strokeRect(min[0], min[1], max[0] - min[0], max[1] - min[1]);
            ctx.setLineDash([]);
        }

        // 3. Points
        const matchSet = new Set((this.matches || []).map(p => p.join(',')));
        for (const p of this.points) {
            const isMatch = matchSet.has(p.join(','));
            const isAnswer = this.answer && p[0] === this.answer[0] && p[1] === this.answer[1];
            const isHighlight = this.highlightedPoint
                && p[0] === this.highlightedPoint[0]
                && p[1] === this.highlightedPoint[1];
            this.drawPoint(p, { isMatch, isAnswer, isHighlight });
        }

        // 4. Query marker (nearest mode)
        if (this.query) {
            this.drawQueryMarker(this.query);
        }

        // 5. Line from query to answer (nearest mode, after animation)
        if (this.query && this.answer) {
            ctx.strokeStyle = '#5ee27a';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(this.query[0], this.query[1]);
            ctx.lineTo(this.answer[0], this.answer[1]);
            ctx.stroke();
        }
    }

    drawSplit(node, W, H) {
        const ctx = this.ctx;
        const axis = node.axis;
        const splitVal = node.point[axis];
        const otherMin = Math.max(node.min[1 - axis], 0);
        const otherMax = Math.min(node.max[1 - axis], axis === 0 ? H : W);

        ctx.strokeStyle = axis === 0 ? 'rgba(255, 99, 132, 0.3)' : 'rgba(99, 220, 132, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        if (axis === 0) {
            ctx.moveTo(splitVal, otherMin);
            ctx.lineTo(splitVal, otherMax);
        } else {
            ctx.moveTo(otherMin, splitVal);
            ctx.lineTo(otherMax, splitVal);
        }
        ctx.stroke();
    }

    drawPoint(p, { isMatch, isAnswer, isHighlight }) {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.arc(p[0], p[1], isHighlight ? 7 : 5, 0, Math.PI * 2);
        if (isAnswer || isMatch) {
            ctx.fillStyle = '#5ee27a';
        } else if (isHighlight) {
            ctx.fillStyle = '#ffc857';
        } else {
            ctx.fillStyle = '#5ab7ff';
        }
        ctx.fill();
        ctx.strokeStyle = '#0f1419';
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }

    drawQueryMarker(p) {
        const ctx = this.ctx;
        ctx.strokeStyle = '#ffc857';
        ctx.lineWidth = 2;
        const r = 7;
        ctx.beginPath();
        ctx.moveTo(p[0] - r, p[1] - r);
        ctx.lineTo(p[0] + r, p[1] + r);
        ctx.moveTo(p[0] + r, p[1] - r);
        ctx.lineTo(p[0] - r, p[1] + r);
        ctx.stroke();
    }
}
