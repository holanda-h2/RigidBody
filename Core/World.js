
function World(context) {
    this.context = context;

    this.bodies = [];  

    this.running = false;
    this.raf = null; 

    this.processes = [];
   
    this.t0 = 0;
    this.t1 = 0;
    this.dt = 1 / 100;
    this.dta = 0;

    this.collision = new Collision();
    this.newProcess(this.collision);

}

World.prototype = {
    addBody: function (body) {
        this.bodies.push(body);
        body.world = this;
    },

    turnOn: function () {  // start
        this.t0 = new Date().getTime();
        this.running = true;
        this.loop();
    },

    turnOff: function () {  // stop
        this.running = false;
        window.cancelAnimationFrame(this.raf);
    },

    clearScreen: function () {
        var ctx = this.context;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    },

    loop: function () {
        if (!this.running) return;

        this.t1 = new Date().getTime();
        this.dta += (this.t1 - this.t0) * 0.001; // time in seconds
        this.t0 = this.t1;

        if (this.dta > 0.2) {// fix for bug if user switches tabs
            this.dta = 0.2;
        }

        while (this.dta > this.dt) {
            this.step();
            this.dta -= this.dt;
        }

        this.clearScreen();

        this.draw();

        this.processDeletes();

        // We call the next cycle
        var world = this;
        this.raf = requestAnimationFrame(function () {
            world.loop();
        });
    },

    step: function () {
        for (var i in this.processes) {
            this.processes[i].process();
        }

        for (var i in this.bodies) {
            this.bodies[i].update();
        }
    },

    draw: function () {
        for (var i in this.bodies) {
            this.bodies[i].draw(Game.context);
        }
    },

    newProcess: function (process) {
        this.processes.push(process);
        process.animation = this;
    },

    processDeletes: function () {
        var newBodies = [];
        var newProcesses = [];

        for (var i in this.bodies) {
            if (!this.bodies[i].isDeleted)
                newBodies.push(this.bodies[i]);
        }

        for (var i in this.processes) {
            if (!this.processes[i].isDeleted)
                newProcesses.push(this.processes[i]);
        }

        this.bodies = newBodies;
        this.processes = newProcesses;
    }

}
