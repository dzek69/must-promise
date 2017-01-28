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

const q = require("q");
describe("Some tests", () => {
    it("detects promises", () => {
        q().must.be.a.promise();
        Promise.resolve().must.be.a.promise();
    });

    it("detects not-promises", () => {
        "5".must.not.be.a.promise();
        true.must.not.be.a.promise();
    });
    
    it("will fail on unchainable promise-like thing", () => {
        ({ then: function() {} }).must.not.be.a.promise();
    });
});
```

# License 

MIT
