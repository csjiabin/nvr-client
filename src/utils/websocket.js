/* eslint-disable no-console */
import Vue from 'vue';
import WS from 'tauri-plugin-websocket-api';
import { AsyncTaskQueue } from './async-task-queue';

const _WebSocket = WebSocket;
window._WebSocket = _WebSocket;

/** 重写WebSocket */
class Socket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  CONNECTING = Socket.CONNECTING;
  OPEN = Socket.OPEN;
  CLOSING = Socket.CLOSING;
  CLOSED = Socket.CLOSED;

  #bus = new Vue();
  ws = null;
  #task = new AsyncTaskQueue();
  onmessage = null;
  onopen = null;
  onclose = null;
  onerror = null;
  readyState = Socket.CONNECTING;

  constructor(...args) {
    this._init(...args);
  }
  _init(...args) {
    this.readyState = Socket.CONNECTING;
    const task = async () => {
      this.ws = await WS.connect(...args)
        .then((r) => {
          this.#bus.$emit('open', r);
          this.onopen && this.onopen(r);
          this.readyState = Socket.OPEN;
          return r;
        })
        .catch((err) => {
          this.#bus.$emit('error', err);
          this.onerror && this.onerror(err);
        });
      this.ws.addListener((r) => {
        this.#bus.$emit('message', r);
        this.onmessage && this.onmessage(r);
      });
    };
    this.#task.enqueue(task);
  }
  send(msg) {
    if (this.readyState !== Socket.OPEN) return;
    // 已创建连接则丢到丢列
    const task = async () => {
      this.ws
        .send(msg)
        .then((r) => {
          console.log(r);
        })
        .catch((err) => {
          this.#bus.$emit('error', err);
          this.onerror && this.onerror(err);
        });
    };
    this.#task.enqueue(task, 1);
  }
  /**
   * @param {'message'|'open'|'error'|'close'} type
   * @param {function?} handler
   */
  addEventListener(type, handler) {
    const task = async () => {
      this.#bus.$on(type, handler);
    };
    this.#task.enqueue(task, 0);
  }
  /**
   * @param {'message'|'open'|'error'|'close'} type
   * @param {function?} handler
   */
  removeEventListener(type, handler) {
    this.#bus.$off(type, handler);
  }
  close() {
    const _readyState = this.readyState;
    this.readyState = Socket.CLOSING;
    this.ws
      .disconnect()
      .then((r) => {
        this.readyState = Socket.CLOSED;
        this.#bus.$emit('close', r);
        this.onclose && this.onclose(r);
      })
      .catch((err) => {
        this.readyState = _readyState;
        this.#bus.$emit('error', err);
        this.onerror && this.onerror(err);
      });
  }
}
window.WebSocket = Socket;
