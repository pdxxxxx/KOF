import { Player } from "./base.js";
import { GIF } from "../utils/gif.js";

export class Kyo extends Player {
    constructor(root, info) {
        super(root, info);

        this.init_animations();

    }
    init_animations() {
        let outer = this;
        let offsets = [0, -22, -22, -120, 0, 0, 0,0,0,-130,-180];
        for (let i = 0; i < 11; i++) {
            let gif = new GIF();
            gif.load(`/static/images/player/kyo/${i}.gif`);
            this.animations.set(i, {
                gif: gif,
                frame_cnt: 0,       //当前的总帧数
                frame_rate: 5,      //每5帧过度一次
                offset_y: offsets[i],     //y偏移量 
                loaded: false,   //是否加载完成 
                scale: 2,    //缩放
            });

            gif.onload = function () {
                let obj = outer.animations.get(i);
                obj.frame_cnt = gif.frames.length;
                obj.loaded = true;
                if (i == 3) {
                    obj.frame_rate = 4;
                }

            }
        }

    }

}
