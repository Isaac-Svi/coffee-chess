CREATE TABLE games (
    game_id SERIAL PRIMARY KEY,
    player_white VARCHAR(50) REFERENCES users(username),
    player_black VARCHAR(50) REFERENCES users(username),
    moves TEXT,
    minutes INTEGER NOT NULL,
    seconds INTEGER NOT NULL,
    url VARCHAR(50) NOT NULL UNIQUE
);