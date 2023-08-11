export default {
    success(content) {
        console.log('\u001b[32m%s\u001b[0m', content);
    },
    default(content) {
        console.log('\u001b[33m%s\u001b[0m', content);
    },
    info(content) {
        console.log('\u001b[34m%s\u001b[0m', content);
    },
    error(content) {
        throw new Error(content);
    }
}
