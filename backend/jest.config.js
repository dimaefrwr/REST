module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testTimeout: 10000,
};
```

## 5. `.gitignore` (główny folder backend)
```
node_modules/
.env
coverage/
*.log
.DS_Store
build/
dist/