/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
export class AsyncTaskQueue {
  #queue = [];
  #isProcessing = false;
  #maxConcurrentTasks = 1;
  #isQueueEmpty = true;
  onCompleteCallback = null;
  onErrorCallback = null; // 失败回调函数

  async enqueue(task, priority = 0) {
    const newTask = { callback: task, priority };
    this.#queue.push(newTask);
    this.#queue.sort((a, b) => b.priority - a.priority);
    this.#isQueueEmpty = false;
    await this.processQueue();
  }

  async processQueue() {
    if (this.#isProcessing) {
      return;
    }

    this.#isProcessing = true;
    let concurrentTasks = 0;

    while (this.#queue.length > 0 && concurrentTasks < this.#maxConcurrentTasks) {
      const task = this.#queue.shift();

      if (!task) {
        break;
      }

      try {
        await task.callback();
      } catch (error) {
        console.error('Error executing task:', error);
        if (this.onErrorCallback) {
          // 在捕获到错误后继续执行后续任务
          this.onErrorCallback(error, () => {
            this.#isProcessing = false;
            this.processQueue();
          });
          return;
        }
      }

      concurrentTasks++;
    }

    this.#isProcessing = false;

    if (this.#queue.length === 0) {
      this.#isQueueEmpty = true;
      if (this.onCompleteCallback) {
        this.onCompleteCallback();
      }
    } else {
      await this.processQueue();
    }
  }

  isIdle() {
    return this.#isQueueEmpty && !this.#isProcessing;
  }

  onComplete(callback) {
    this.onCompleteCallback = callback;
  }

  onError(callback) {
    this.onErrorCallback = callback; // 设置失败回调函数
  }
}
