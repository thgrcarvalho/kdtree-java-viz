export class TracePlayer {
    constructor(canvas2d, treeView, traceListEl) {
        this.canvas2d = canvas2d;
        this.treeView = treeView;
        this.traceListEl = traceListEl;
        this.timers = [];
        this.cancelled = false;
    }

    async play(trace, stepMs = 280) {
        this.cancel();
        this.cancelled = false;
        this.traceListEl.innerHTML = '';

        for (const step of trace) {
            if (this.cancelled) return;
            await this.delay(stepMs);
            if (this.cancelled) return;

            const li = document.createElement('li');
            li.className = step.kind === 'VISIT' ? 'visit' : 'prune';
            li.textContent = `${step.kind} (${step.point.map(v => v.toFixed(0)).join(', ')}) axis=${step.axis}`;
            this.traceListEl.appendChild(li);
            li.scrollIntoView({ block: 'nearest' });

            if (step.kind === 'VISIT') {
                this.canvas2d.setHighlight(step.point);
                this.canvas2d.render();
                this.treeView.highlight(step.point);
            }
        }

        this.canvas2d.setHighlight(null);
        this.canvas2d.render();
        this.treeView.highlight(null);
    }

    delay(ms) {
        return new Promise(resolve => {
            const t = setTimeout(resolve, ms);
            this.timers.push(t);
        });
    }

    cancel() {
        this.cancelled = true;
        this.timers.forEach(clearTimeout);
        this.timers = [];
    }
}
