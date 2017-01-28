const must = require("must");

const isObject = function(tested) {
    return tested !== null && typeof tested === "object";
};

const isFunction = function(tested) {
    return typeof tested === "function";
};

const hasThen = function(object) {
    return isObject(object) && isFunction(object.then);
};

const hasCatch = function(object) {
    return isObject(object) && isFunction(object.catch);
};

const hasThenCatch = function(object) {
    return isObject(object) && isFunction(object.then) && isFunction(object.catch);
};

const noop = function() {};

must.prototype.promise = function(strict) {
    const strictMode = strict === undefined || strict === true;

    this.assert(isObject(this.actual), "be an object", {
        actual: typeof this.actual,
    });

    this.assert(hasThen(this.actual), "have `then` property that is a function", {
        actual: typeof this.actual.then,
    });

    const thenResult = this.actual.then(noop);

    const thenResultAssertion = strictMode ? hasThenCatch(thenResult) : hasThen(thenResult);
    const thenResultMessage = strictMode ? "and `catch` properties that are" : "property that is";

    this.assert(thenResultAssertion, "have `then` " + thenResultMessage + " chainable");

    if (!strictMode) {
        return;
    }

    this.assert(hasCatch(this.actual), "have `catch` property that is a function", {
        actual: typeof this.actual.catch,
    });

    const catchResult = this.actual.catch(() => {});

    const catchResultAssertion = hasThenCatch(catchResult);
    this.assert(catchResultAssertion, "have `then` and `catch` properties that are chainable");

};
