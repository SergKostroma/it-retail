const commonChunks = [
    'common'
]

/**
 * @type {Object.<string, String[]>}
 */
const chunksMap = {
}

module.exports.getChunks = (pageName) => {
    const defaultChunk = pageName.split('.').slice(0, -1).join(".");

    const pageChunks = chunksMap[pageName] || [defaultChunk]
    const chunks = [...commonChunks, ...pageChunks]
    return Array.from(new Set(chunks));
};
