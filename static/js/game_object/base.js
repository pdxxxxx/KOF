let AC_GAME_OBJECTS = [];
class AcGameObject {
    constructor() {
        AC_GAME_OBJECTS.push(this);
        this.timedelta = 0;          //每两帧之间的时间间隔
        this.has_call_start = false;   //是否执行过
    }
    start() {   //初始执行一次

    }
    update() {  //每一帧执行一次(除了第一次)

    }
    destory() {
        for (let i in AC_GAME_OBJECTS) {
            if (AC_GAME_OBJECTS[i] === this) {
                AC_GAME_OBJECTS.splice(i, 1);  //销毁元素
                break;
            }
        }

    }

}
let last_timestamp;
let AC_GAME_OBJECTS_FRAME = (timestamp) => {   //timestamp当前执行的是那个时刻
    for (let obj of AC_GAME_OBJECTS) {
        if (!obj.has_call_start) {
            obj.start();
            obj.has_call_start = true;
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;
    requestAnimationFrame(AC_GAME_OBJECTS_FRAME);
}
requestAnimationFrame(AC_GAME_OBJECTS_FRAME);

export {
    AcGameObject
}
