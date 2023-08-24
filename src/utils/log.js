export default {
    success(content) {
        console.log('\u001b[32m%s\u001b[0m', `[CAR SUCCESS]: ${content}`);
    },
    default(content) {
        console.log('\u001b[33m%s\u001b[0m', `[CAR]: ${content}`);
    },
    info(content) {
        console.log('\u001b[34m%s\u001b[0m', `[CAR INFO]: ${content}`);
    },
    error(content) {
        throw new Error(`[CAR ERROR]: ${content}`);
    }
}
