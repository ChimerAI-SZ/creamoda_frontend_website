module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-empty': [2, 'never'], // 不允许类型为空
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复bug
        'docs', // 文档更新
        'style', // 代码格式（不影响代码运行的变动）
        'refactor', // 重构（既不是新增功能，也不是修改bug的代码变动）
        'perf', // 性能优化
        'test', // 增加测试
        'chore', // 构建过程或辅助工具的变动
        'revert', // 回退
        'build', // 打包
        'ci' // CI配置相关
      ]
    ],
    'subject-empty': [2, 'never'], // 不允许主题为空
    'subject-full-stop': [2, 'never', '.'], // 主题句号
    'subject-case': [0], // 主题大小写不做限制
    'header-max-length': [2, 'always', 72], // 头部最长72个字符
    'body-leading-blank': [1, 'always'], // body开始于空行
    'footer-leading-blank': [1, 'always'] // footer开始于空行
  }
}
