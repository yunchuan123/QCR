let instance = undefined;

export function setInstance(_instance) {
    instance = _instance;
}

export function clearInstance() {
    instance = undefined;
}

export function getInstance() {
    return instance;
}

export function useInstance() {
    return getInstance();
}
