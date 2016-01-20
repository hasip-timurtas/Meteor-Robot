Template.homePage.events({
    'click #command': function(){
        $("#command").val("");
        robotToy.writeError("");
        robotToy.writeMessage("");
    },
    'keypress #command': function (evt, template) {
    if (evt.which === 13) {
        var command= $("#command").val();
        robotToy.processCommand(command);
        robotToy.writeMessage("command executed");
    }
  }

});


robotToy = ({
    facing: ['NORTH', 'SOUTH', 'EAST', 'WEST'],
    maxX: 4,
    maxY: 4,
    robot: null,
    currentPos: {},
    processCommand: function (command){
        //make empty
        this.writeError("");
        this.writeMessage("");

        this.currentPos = {
            x: this.robot.x,
            y: this.robot.y,
            f: this.robot.f
        };

        var completeCmd = command.split(" ");
        var firstCmd = completeCmd[0].toUpperCase(); // make avaiable for lowercases

        if (this.commandInitiated) {
            this.switchLiteralCommand(firstCmd, completeCmd);
        } else if ((!this.commandInitiated && firstCmd === 'PLACE')) {
            this.commandInitiated = true;
            var posCmd = completeCmd.slice(1).join(""); // remove extra spaces
            this.place(posCmd);
        } else {
            this.writeError("First command must be PLACE e.g 'PLACE 0,1,NORTH'");
        }
    },

    writeError: function writeError(msg) {
        $("#error").html(msg);
    },

    writeMessage: function (msg) {
        $("#message").html(msg);
        
    },
    validX: function(axis) {
        if (isNaN(axis)) {
            this.writeError("Please enter a numeric X coordinates!");
            return false;
        } else if (axis < 0 || axis > this.maxX) {
            this.writeError("X coordinates out of range!");
            return false;
        } else {
            return true;
        }
    },

    validY: function (axis) {
        if (isNaN(axis)) {
            this.writeError("Please enter a numeric Y coordinates!");
            return false;
        } else if (axis < 0 || axis > this.maxY) {
            this.writeError("Y coordinates out of range!");
            return false;
        } else {
            return true;
        }
    },

    validF: function (face) {
        if (this.facing.indexOf(face) === -1) {
            this.writeError("Wrong facing!");
            return false;
        } else {
            return true;
        }
    },

    place: function (posCmd) {
        var newPos = posCmd.split(","); // get x y f from the command
        var newX = parseInt(newPos[0].trim());
        var newY = parseInt(newPos[1].trim());
        var newF = newPos[2].trim().toUpperCase();
        if (this.validX(newX) && this.validY(newY) && this.validF(newF)) {
            this.robot.x = newX;
            this.robot.y = newY;
            this.robot.f = newF;
            this.moveRobot(this.robot);
        }
    },

    move: function () {
        switch (this.currentPos.f) {
            case "NORTH":
                var newY = this.currentPos.y + 1;
                if (this.validY(newY)) {
                    this.robot.y = newY;
                    this.moveRobot(this.robot);
                }
                break;
            case "SOUTH":
                var newY = this.currentPos.y - 1;
                if (this.validY(newY)) {
                    this.robot.y = newY;
                    this.moveRobot(this.robot);
                }
                break;
            case "EAST":
                var newX = this.currentPos.x + 1;
                if (this.validX(newX)) {
                    this.robot.x = newX;
                    this.moveRobot(this.robot);
                }
                break;
            case "WEST":
                var newX = this.currentPos.x - 1;
                if (this.validX(newX)) {
                    this.robot.x = newX;
                    this.moveRobot(this.robot);
                }
                break;
            default:
                break;
        }
    },
    rotate: function (direction) {
        if (direction === "left") {
            switch (this.currentPos.f) {
                case "NORTH":
                    this.robot.f = "WEST";
                    break;
                case "SOUTH":
                    this.robot.f = "EAST";
                    break;
                case "EAST":
                    this.robot.f = "NORTH";
                    break;
                case "WEST":
                    this.robot.f = "SOUTH";
                    break;
                default:
                    break;
            }
        } else if (direction === "right") {
            switch (this.currentPos.f) {
                case "NORTH":
                    this.robot.f = "EAST";
                    break;
                case "SOUTH":
                    this.robot.f = "WEST";
                    break;
                case "EAST":
                    this.robot.f = "SOUTH";
                    break;
                case "WEST":
                    this.robot.f = "NORTH";
                    break;
                default:
                    break;
            }
        }
    },
    report: function () {
        $("#report").html(this.robot.x + "," + this.robot.y + "," + this.robot.f);
    },

    switchLiteralCommand: function (literalCmd, completeCmd) {
        switch (literalCmd) {
            case "PLACE":
                var posCmd = completeCmd.slice(1).join(""); // avoid scenarios when user types extra spaces after coordinates e.g. place 2, 2,  north
                this.place(posCmd);
                break;
            case "MOVE":
                this.move();
                break;
            case "LEFT":
                this.rotate("left");
                break;
            case "RIGHT":
                this.rotate("right");
                break;
            case "REPORT":
                this.report();
                break;
            default:
                this.writeError("Invalid command!");
                break;
        }

    },

    Robot: function (x, y, f) {
        this.x = x;
        this.y = y;
        this.f = f;
    },

    moveRobot: function (newRobot) {
        var axisX = (newRobot.x) * 50;
        var axisY = (4 - newRobot.y) * 50;
        $("img").css('margin-left',axisX+'px');
        $("img").css('margin-top',axisY+'px');
    },

    init: function () {
        this.robot = new this.Robot(0, 4, "WEST");
        this.moveRobot(this.robot);
    }

});

robotToy.init();
