# must-return

This library adds `is a promise` assertion to `Must.js`. Internally it checks if object has a `then` property and if
it's chainable. With strict check (by default) it also checks for `catch` property.

# Install 
```
npm install must-promise
```

# Usage

```javascript
require("must-promise"); // This will internally require must and upgrade its prototype.
```

# License 

MIT
