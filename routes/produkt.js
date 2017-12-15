const db = require('../config/sql').connect();

module.exports = function (app) {

    app.get('/user/:id', function (req, res) {
        let userId = req.params.id.replace("id=", "");
        db.query(`select * from tictactoeUsers where id = ${userId}`, function (err, data) {
            res.send(data);
        })
    });

    app.post('/add/user/', function (req, res) {
        let username = req.body.username;
        let curDate = new Date();
        let curDay = curDate.getDate();
        let curMonth = curDate.getMonth()+1;
        let curYear = curDate.getFullYear();
        let curTime = curDate.getHours()+''+curDate.getMinutes();
        let CurDateTime = curDay+''+curMonth+''+curYear+''+curTime;
        db.execute(`INSERT INTO tictactoeUsers VALUES ('', '${username}', 0, '${CurDateTime}', 'no')`, (err, rows) => {
            if (err) {
                res.json({"message": "userError"});
            } else {
                db.query(`SELECT * FROM tictactoeUsers WHERE username = '${username}'`, (err, data) => {
                    if (err) {
                        res.json({"message": "userError"});
                    } else {
                        res.json({"message": "userCreated", "userId": data[0].id});
                    }
                })
            }
        })
    });

    app.get('/user/opponent/:id', function (req, res) {
        let userId = req.params.id.replace("id=", "");
        db.execute(`SELECT COUNT(*) as 'opponent' FROM tictactoeUsers WHERE playing = 'no' and not id = ${userId}`, function (err, opponentActive) {
            if (opponentActive[0].opponent >= 1) {
                db.query(`select * from tictactoeUsers where playing = 'no' and not id = ${userId} order by id asc limit 1`, function (err, data) {
                    res.send({"message": 'matchOpponent', "userData": data});
                })
            } else {
                res.json({"message": 'noOpponent'});
            }
        })
    });

    app.post('/game/create/', function (req, res) {
        let userId = req.body.userId;
        let opponentId = req.body.opponentId;
        let playerStart = Math.floor((Math.random() * 2) + 1);
        let curDate = new Date();
        let curDay = curDate.getDate();
        let curMonth = curDate.getMonth()+1;
        let curYear = curDate.getFullYear();
        let curTime = curDate.getHours()+''+curDate.getMinutes();
        let CurDateTime = curDay+''+curMonth+''+curYear+''+curTime;

        db.execute(`SELECT gameId as 'lastGameId' FROM tictactoeUsers order by gameId desc limit 1`, function (err, opponentActive) {
            var gameId = opponentActive[0].lastGameId + Math.floor((Math.random() * 100) + 1);
            db.execute(`UPDATE tictactoeUsers SET gameId = '${gameId}', playing = 'yes' WHERE id = '${userId}'`, (err, rows) => {
                db.execute(`UPDATE tictactoeUsers SET gameId = '${gameId}', playing = 'yes' WHERE id = '${opponentId}'`, (err, rows) => {
                    if(playerStart == 1) {
                        db.execute(`INSERT INTO tictactoeBoards VALUES ('', '${gameId}', 'cross', 'none', '${userId}', '${CurDateTime}')`, (err, rows) => {
                            db.execute(`INSERT INTO tictactoeBoards VALUES ('', '${gameId}', 'circle', 'none', '${opponentId}', '${CurDateTime}')`, (err, rows) => {
                                res.json({"message": "gameCreated"});
                            })
                        })
                    } else {
                        db.execute(`INSERT INTO tictactoeBoards VALUES ('', '${gameId}', 'circle', 'none', '${userId}', '${CurDateTime}')`, (err, rows) => {
                            db.execute(`INSERT INTO tictactoeBoards VALUES ('', '${gameId}', 'cross', 'none', '${opponentId}', '${CurDateTime}')`, (err, rows) => {
                                res.json({"message": "gameCreated"});
                            })
                        })
                    }
                })
            })
        })
    });

    app.get('/user/delete/:id', function (req, res) {
        let userId = req.params.id.replace("id=", "");
        db.query(`delete from tictactoeUsers where id = ${userId}`, function (err, data) {
            res.json({"message":"userDeleted"});
        })
    });

    app.get('/board/delete/:id', function (req, res) {
        let gameId = req.params.id.replace("id=", "");
        db.query(`delete from tictactoeBoards where boardId = ${gameId}`, function (err, data) {
            res.json({"message":"boardDeleted"});
        })
    });

    app.post('/board/opponent/', function (req, res) {
        let gameId = req.body.gameId;
        let userId = req.body.userId;
        db.query(`select * from tictactoeBoards where boardId = '${gameId}' and not turnId = ${userId} order by id asc limit 1`, function (err, data) {
            res.send(data);
        })
    });

    app.get('/board/lastturn/:id', function (req, res) {
        let gameId = req.params.id.replace("id=", "");
        db.query(`select * from tictactoeBoards where boardId = ${gameId} order by id desc limit 1`, function (err, data) {
            res.send(data);
        })
    });

}
