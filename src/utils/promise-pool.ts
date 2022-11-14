export class PromisePool {
    size: number;
    private queue: {
        onResolve: (result: any) => void,
        onReject: (err: any) => void,
        cb: () => Promise<any>,
    }[];
    active: number;
    minimalPause: number;

    constructor(size: number, minimalPause = 0) {
        this.size = size;
        this.minimalPause = minimalPause;
        this.queue = [];
        this.active = 0;
    }

    run<T>(cb: () => Promise<T>): Promise<T> {
        const prom = new Promise<T>((resolve, reject) => {
            if (this.isFull()) {
                this.queue.push({
                    onResolve: resolve,
                    onReject: reject,
                    cb,
                });
            } else {
                this._runInPool(cb).then(resolve, reject);
            }
        });

        return prom;
    }

    isFull() {
        return this.active >= this.size;
    }

    private _runInPool<T>(cb: () => Promise<T>): Promise<T> {
        this.active++;
        const prom = cb().then(r => {
            this.active--;
            setTimeout(() => this._processQueueIfPossible(), this.minimalPause);
            return r;
        }).catch(err => {
            this.active--;
            setTimeout(() => this._processQueueIfPossible(), this.minimalPause);
            throw err;
        });
        return prom;
    }

    private _processQueueIfPossible() {
        if (this.isFull() || this.queue.length === 0) return;
        const { cb, onReject, onResolve } = this.queue.shift()!;
        this._runInPool(cb).then(onResolve, onReject)
    }
}