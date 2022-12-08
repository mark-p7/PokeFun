// Error Handling Classes
class PokemonBadRequestError extends Error {
    constructor(errMessage) {
        super(errMessage);
        this.name = "PokemonBadRequestError";
        this.code = 400;
    }
}

class PokemonNotFoundError extends PokemonBadRequestError {
    constructor(errMessage) {
        super(errMessage);
        this.name = "PokemonNotFoundError";
        this.code = 404;
    }
}

class PokemonMissingIdError extends PokemonBadRequestError {
    constructor(errMessage) {
        super(errMessage);
        this.name = "PokemonMissingIdError";
        this.code = 404;
    }
}

class PokemonDbError extends PokemonBadRequestError {
    constructor(errMessage) {
        super(errMessage);
        this.name = "PokemonDbError";
        this.code = 400;
    }
}

class InvalidRouteError extends PokemonBadRequestError {
    constructor(errMessage) {
        super(errMessage);
        this.name = "InvalidRouteError";
        this.code = 404;
    }
}

module.exports = { PokemonBadRequestError, PokemonDbError, PokemonMissingIdError, PokemonNotFoundError, InvalidRouteError}