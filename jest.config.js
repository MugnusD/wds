module.exports = {
    // 指定 Jest 应该转换的文件类型
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    // 指定使用的转换器
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    // 指定测试文件的匹配模式
    testMatch: ['**/test/**/*.test.[jt]s?(x)'],
};