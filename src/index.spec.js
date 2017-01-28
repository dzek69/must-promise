const must = require("must");

const register = function() {
    require("./index");
};

describe("must-return", function() {
    describe("registers", function() {
        it("a `promise` method on `must`", function() {
            (must.prototype.promise === undefined).must.be.true();
            register();
            must.prototype.promise.must.be.a.function();
        });
    });

    describe("throws on", function() {
        const assertOnString = function() {
            "a string".must.be.a.promise(false);
        };

        const assertOnBoolean = function() {
            false.must.be.a.promise(false);
        };

        const assertOnFunction = function() {
            const fn = function() {};
            fn.must.be.a.promise(false);
        };

        const assertOnEmptyObject = function() {
            ({}).must.be.a.promise(false);
        };

        const assertOnNonPromiseLikeObject = function() {
            const object = {
                random: "property",
            };
            object.must.be.a.promise(false);
        };

        const assertOnCatchOnly = function() {
            const object = {
                catch: function() {},
            };
            object.must.be.a.promise(false);
        };

        it("string", function() {
            assertOnString.must.throw(must.AssertionError);
            try {
                assertOnString();
            }
            catch (e) {
                const { message, actual, expected } = e;
                actual.must.equal("string");
                (expected === undefined).must.be.true();
                message.must.equal("\"a string\" must be an object");
            }
        });

        it("boolean", function() {
            assertOnBoolean.must.throw(must.AssertionError);
            try {
                assertOnBoolean();
            }
            catch (e) {
                const { message, actual, expected } = e;
                actual.must.equal("boolean");
                (expected === undefined).must.be.true();
                message.must.equal("false must be an object");
            }
        });

        it("function", function() {
            assertOnFunction.must.throw(must.AssertionError);
            try {
                assertOnFunction();
            }
            catch (e) {
                const { message, actual, expected } = e;
                actual.must.equal("function");
                (expected === undefined).must.be.true();
                message.must.equal("function () {} must be an object");
            }
        });

        it("empty object", function() {
            assertOnEmptyObject.must.throw(must.AssertionError);
            try {
                assertOnEmptyObject();
            }
            catch (e) {
                const { message, actual, expected } = e;
                actual.must.equal("undefined");
                (expected === undefined).must.be.true();
                message.must.equal("{} must have `then` property that is a function");
            }
        });

        it("object without `then`", function() {
            assertOnNonPromiseLikeObject.must.throw(must.AssertionError);
            try {
                assertOnNonPromiseLikeObject();
            }
            catch (e) {
                const { message, actual, expected } = e;
                actual.must.equal("undefined");
                (expected === undefined).must.be.true();
                message.must.equal("{\"random\":\"property\"} must have `then` property that is a function");
            }
        });

        it("object with `catch` only", function() {
            assertOnCatchOnly.must.throw(must.AssertionError);
            try {
                assertOnCatchOnly();
            }
            catch (e) {
                const { message, actual, expected } = e;
                actual.must.equal("undefined");
                (expected === undefined).must.be.true();
                // Must.js assertion seems to swallow function properties when generating a message
                message.must.equal("{} must have `then` property that is a function");
            }
        });
    });

    describe("in non-strict mode it", function() {
        it("throws on object with then method that is not chainable", function() {
            const testAssertion = function() {
                const object = {
                    then: function() {},
                };
                object.must.be.a.promise(false);
            };

            testAssertion.must.throw(must.AssertionError);

            try {
                testAssertion();
            }
            catch (e) {
                const {message, actual, expected} = e;
                actual.must.have.ownKeys(["then"]);
                (expected === undefined).must.be.true();
                // Must.js assertion seems to swallow function properties when generating a message
                message.must.equal("{} must have `then` property that is chainable");
            }
        });

        it("throws on object with improperly chainable `then`", function() {
            const testAssertion = function() {
                const object = {
                    then: function() {
                        return {
                            then: "well, that's bad",
                        }
                    },
                };
                object.must.be.a.promise(false);
            };

            testAssertion.must.throw(must.AssertionError);

            try {
                testAssertion();
            }
            catch (e) {
                const {message, actual, expected} = e;
                actual.must.have.ownKeys(["then"]);
                (expected === undefined).must.be.true();
                // Must.js assertion seems to swallow function properties when generating a message
                message.must.equal("{} must have `then` property that is chainable");
            }
        });

        it("doesn't throw on object with properly chainable `then`", function() {
            const testAssertion = function() {
                const object = {
                    then: function() {
                        return {
                            then: function() {},
                        }
                    },
                };
                object.must.be.a.promise(false);
            };

            testAssertion.must.not.throw();
        });
    });

    describe("in strict mode it", function() {
        it("throws on objects without `catch property`", function() {
            const testAssertion = function() {
                const object = {
                    then: function() {
                        return {
                            then: function() {},
                            catch: function() {},
                        }
                    },
                };
                object.must.be.a.promise(true);
            };

            testAssertion.must.throw(must.AssertionError);

            try {
                testAssertion();
            }
            catch (e) {
                const { message, actual, expected } = e;
                actual.must.equal("undefined");
                (expected === undefined).must.be.true();
                // Must.js assertion seems to swallow function properties when generating a message
                message.must.equal("{} must have `catch` property that is a function");
            }
        });

        it("throws on objects with not chainable `catch` method", function() {
            const testAssertion = function() {
                const object = {
                    then: function() {
                        return {
                            then: function() {},
                            catch: function() {},
                        }
                    },
                    catch: function() {

                    },
                };
                object.must.be.a.promise(true);
            };

            testAssertion.must.throw(must.AssertionError);

            try {
                testAssertion();
            }
            catch (e) {
                const { message, actual, expected } = e;
                actual.must.have.ownKeys(["then", "catch"]);
                (expected === undefined).must.be.true();
                // Must.js assertion seems to swallow function properties when generating a message
                message.must.equal("{} must have `then` and `catch` properties that are chainable");
            }
        });

        it("doesn't throw on objects with chainable `then` and `catch`", function() {
            const testAssertion = function() {
                const object = {
                    then: function() {
                        return {
                            then: function() {},
                            catch: function() {},
                        }
                    },
                    catch: function() {
                        return {
                            then: function() {},
                            catch: function() {},
                        }
                    },
                };
                object.must.be.a.promise(true);
            };

            testAssertion.must.not.throw();
        });
    });

    describe("it works", () => {
        it("on real promises", () => {
            const testAssertion = function() {
                (new Promise(function() {})).must.be.a.promise();
                Promise.resolve().must.be.a.promise();
                Promise.reject().must.be.a.promise();
            };

            testAssertion.must.not.throw();
        });
    })
});
