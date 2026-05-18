export class TreeView {
    constructor(container) {
        this.container = container;
        this.tree = null;
    }

    setTree(treeResponse) {
        this.tree = treeResponse;
    }

    render() {
        if (!this.tree || !this.tree.root) {
            this.container.innerHTML = '<p style="color: #8a92a6; font-size: 0.85rem;">Tree is empty</p>';
            return;
        }
        const ul = document.createElement('ul');
        ul.appendChild(this.renderNode(this.tree.root));
        this.container.innerHTML = '';
        this.container.appendChild(ul);
    }

    renderNode(node) {
        const li = document.createElement('li');
        li.dataset.point = JSON.stringify(node.point);
        li.innerHTML = `(${node.point.map(v => v.toFixed(0)).join(', ')})<span class="axis">axis=${node.axis}</span>`;
        if (node.left || node.right) {
            const childUl = document.createElement('ul');
            if (node.left) childUl.appendChild(this.renderNode(node.left));
            if (node.right) childUl.appendChild(this.renderNode(node.right));
            li.appendChild(childUl);
        }
        return li;
    }

    highlight(point) {
        const key = point ? JSON.stringify(point) : null;
        this.container.querySelectorAll('li').forEach(li => {
            li.classList.toggle('highlight', key !== null && li.dataset.point === key);
        });
    }
}
