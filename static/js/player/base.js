import { AcGameObject } from '/static/js/game_object/base.js';


export class Player extends AcGameObject {
    constructor(root, info) {
        super();

        this.root = root;
        this.id = info.id;
        this.x = info.x;
        this.y = info.y;
        this.width = info.width;
        this.height = info.height;
        this.color = info.color;

        this.direction = 1;

        this.vx = 0;
        this.vy = 0;

        this.speedx = 440;
        this.speedy = -1200;

        this.gravity = 50;

        this.spent_time=0;

        this.ctx = this.root.game_map.ctx;

        this.pressed_keys = this.root.game_map.controller.pressed_keys;

        this.status = 3; //0:idle 1:向前 2：向后 3：跳跃 4：攻击 5：被打 6：死亡 
        this.animations = new Map();
        this.frame_current_cnt = 0;      

        this.hp = 100;
        this.bao=0;
        this.$hp = this.root.$kof.find(`.kof-head-hp-${this.id}>div`);
        this.$hp_div = this.root.$kof.find(`.kof-head-hp-${this.id}>div>div`);
        this.$bao_div=this.root.$kof.find(`.kof-bao-${this.id}>div`)



    }

    start() {

    }



    update_move() {

        this.spent_time+=this.timedelta/1000;
        this.vy += this.gravity;

        this.x += this.vx * this.timedelta / 1000;
        this.y += this.vy * this.timedelta / 1000;
        //推人效果
        // let [a, b] = this.root.players;
        // if (a !== this) [a, b] = [b, a];
        // let r1 = {
        //     x1: a.x,
        //     y1: a.y,
        //     x2: a.x + a.width,
        //     y2: a.y + a.height,
        // };

        // let r2 = {
        //     x1: b.x,
        //     y1: b.y,
        //     x2: b.x + b.width,
        //     y2: b.y + b.height,
        // };

        // if (this.is_collection(r1, r2)) {
        //     b.x += this.vx * this.timedelta / 1000 ;
        //     b.y += this.vy * this.timedelta / 1000 ;

        //     a.x -= this.vx * this.timedelta / 1000 ;
        //     a.y -= this.vy * this.timedelta / 1000 ;

        //     if (this.status == 3) this.status = 0;

        // }

        if (this.y > 450) {
            this.y = 450;
            this.vy = 0;
            if (this.status === 3) this.status = 0;

        }
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x + this.width > this.root.game_map.$canvas.width()) {
            this.x = this.root.game_map.$canvas.width() - this.width;
        }

    }

    ai_move_control(){
        if(this.status===5){
            if(this.direction>0){
                return true;
            } else {
                return false;
            }
        }
        if (Math.floor(this.spent_time) % 4 == 0 || Math.floor(this.spent_time) % 3 == 0 || Math.floor(this.spent_time) % 11 == 0) {
            return false;
        }
        return true;
    }

    ai_attack_control(){
        let players=this.root.players;
        let me=this,you=players[1-this.id];
        let r1;

        if (this.direction > 0) {
            r1 = {
                x1: me.x + 125,
                y1: me.y + 40,
                x2: me.x + 125 + 100,
                y2: me.y + 40 + 20
            }
        } else {
            r1 = {
                x1: me.x + this.width - 125 - 100,
                y1: me.y + 40,
                x2: me.x + this.width - 125 - 100 + 100,
                y2: me.y + 40 + 20
            }
        }
        let r2;
        r2 = {
            x1: you.x,
            y1: you.y,
            x2: you.x + you.width,
            y2: you.y + you.height,
        }

        if(this.is_collection(r1,r2)&&you.status!==6){
            return true;
        }
        return false;

    }
    
    ai_jump_control(){
        if(Math.floor(this.spent_time)%13==0||this.status===5){
            return true;
         } return false;

    }


    ai_attack_control1(){
        let players=this.root.players;
        let me=this,you=players[1-this.id];
        let r1;

        if (this.direction > 0) {
            r1 = {
                x1: me.x + 125,
                y1: me.y + 40,
                x2: me.x + 125 + 100,
                y2: me.y + 40 + 20
            }
        } else {
            r1 = {
                x1: me.x + this.width - 125 - 100,
                y1: me.y + 40,
                x2: me.x + this.width - 125 - 100 + 100,
                y2: me.y + 40 + 20
            }
        }
        let r2;
        r2 = {
            x1: you.x,
            y1: you.y,
            x2: you.x + you.width,
            y2: you.y + you.height,
        }

        if(this.is_collection(r1,r2)&&you.status!==6){
            return (Math.random()*10)+1;
        }
        return false;

    }

    ai_skill_control(){
        if(this.id===1){
            if(Math.floor(this.spent_time)%7===0 && this.bao === 100 ){
              return true;
            } else return false;
        }
       

    }

    



    update_control() {

        let w, a, d, j, k,l,u;
        if (this.id == 0) {
            w = this.pressed_keys.has('w');
            a = this.pressed_keys.has('a');
            d = this.pressed_keys.has('d');
            j = this.pressed_keys.has('j');
            k = this.pressed_keys.has('k');
            l = this.pressed_keys.has('l');
            u = this.pressed_keys.has('u');
        } else {
        
            // w = this.pressed_keys.has('ArrowUp');
            // a = this.pressed_keys.has('ArrowLeft');
            // d = this.pressed_keys.has('ArrowRight');
            // j = this.pressed_keys.has('1');
            // k = this.pressed_keys.has('2');
            // l = this.pressed_keys.has('3');
            // u =  this.pressed_keys.has('4'); 

            w=this.ai_jump_control();
            a=this.ai_move_control();
            d=!this.ai_move_control();
            // j=this.ai_attack_control();
            if(this.ai_attack_control1()){
                
                if(this.ai_attack_control1()<5){
                    j=this.ai_attack_control1();
                } else k=this.ai_attack_control1();

            }  
           u=this.ai_skill_control(); 
        
        }
      
      


        if (this.status === 0 || this.status === 1 || this.status === 11) {
            if (j) {
                if(w){
                    this.status=9;
                    if(this.direction>0){
                        this.vx=this.speedx;
                    } else this.vx=-this.speedx;
                    this.vy=this.speedy;
                    this.frame_current_cnt=0;
                } else{
                    this.status = 4;
                    this.vx = 0;
                    this.frame_current_cnt = 0;
                }
               
            } else if(k){
                this.status = 8;
                this.vx = 0;
                this.frame_current_cnt = 0;
            } else if (w) {
                if (d) {
                    this.vx = this.speedx;
                } else if (a) {
                    this.vx = -this.speedx;
                } else {
                    this.vx = 0;
                }
                this.vy = this.speedy;
                this.status = 3;
            } else if(l){
                if(d||a){
                    if(this.direction>0){
                        this.vx=this.speedx*1.2;
                    } else{
                        this.vx=-this.speedx*1.2;
                    }
                    this.status = 7;
                    this.frame_current_cnt=0;
                }

            } else if (d) {
                if(u && this.bao==100){
                    this.status=10;
                    this.frame_current_cnt=0;
                    this.vx=this.speedx;
                    this.vy=this.speedy;
                } else{
                    this.vx = this.speedx;
                    this.status = 1;
                }
               
            } else if (a) {
                if(u && this.bao === 100){
                    this.status=10;
                    this.frame_current_cnt=0;
                    this.vx=-this.speedx;
                    this.vy=this.speedy;
                } else{
                    this.vx = -this.speedx;
                    this.status = 1;
                }
            } else {
                this.vx = 0;

                this.status = 0;
            }

        }

    }
    update_derection() {
        if (this.status === 6) {
            return;
        }
        let players = this.root.players;
        if (players[0] && players[1]) {
            let me = this, you = players[1 - this.id];
            if (me.x < you.x) me.direction = 1;
            else me.direction = -1;

        }

    }
    is_attack(hart,ennerge) {
        
        if (this.status === 6) {
            return;
        }
        this.status = 5;
        this.frame_current_cnt = 0;

        this.hp = Math.max(this.hp - hart, 0);

        this.bao=Math.min(this.bao+ennerge,100);

        this.$hp_div.animate({
            width: this.$hp.parent().width() * this.hp / 100

        }, 300);
        this.$hp.animate({
            width: this.$hp.parent().width() * this.hp / 100

        }, 500);

        this.$bao_div.animate({
             width:this.$bao_div.parent().width()*this.bao/100
        },300);

        if (this.hp <= 0) {
            this.status = 6;
            this.frame_current_cnt = 0;
            this.vx = 0;
           
        }
    }

    is_collection(r1, r2) {
        if (Math.max(r1.x1, r2.x1) > Math.min(r1.x2, r2.x2)) {
            return false;
        if (Math.max(r1.y1, r2.y1) > Math.min(r1.y2, r2.y2))
                return false;
        } else return true;
    }

    update_attack() {
        if (this.status == 4 && this.frame_current_cnt == 18) {   
            let me = this, you = this.root.players[1 - this.id];
            let r1;
            if (this.direction > 0) {
                r1 = {
                    x1: me.x + 120,
                    y1: me.y + 40,
                    x2: me.x + 120 + 100,
                    y2: me.y + 40 + 20,

                };
            } else {
                r1 = {
                    x1: me.x + this.width - 120 - 100,
                    y1: me.y + 40,
                    x2: me.x + this.width - 120 - 100 + 100,
                    y2: me.y + 40 + 20,

                };

            }
            let r2 = {
                x1: you.x,
                y1: you.y,
                x2: you.x + you.width,
                y2: you.y + you.height,
            };
            if (this.is_collection(r1, r2)) {
                you.is_attack(5,10);
            }
        }else if(this.status == 8 && this.frame_current_cnt == 18){
           
            let me = this, you = this.root.players[1 - this.id];
            let r1;
            if (this.direction > 0) {
                r1 = {
                    x1: me.x + 160,
                    y1: me.y + 180,
                    x2: me.x + 160 + 100,
                    y2: me.y + 180 + 20,

                };
            } else {
                r1 = {
                    x1: me.x + this.width - 160 - 100,
                    y1: me.y + 180,
                    x2: me.x + this.width - 160 - 100 + 100,
                    y2: me.y + 180 + 20,

                };

            }
            let r2 = {
                x1: you.x,
                y1: you.y,
                x2: you.x + you.width,
                y2: you.y + you.height,
            };
            if (this.is_collection(r1, r2)) {
                you.is_attack(10,20);
            }
        } else if(this.status === 9 && this.frame_current_cnt === 18){
            let me = this, you = this.root.players[1 - this.id];
            let r1;
            if (this.direction > 0) {
                r1 = {
                    x1: me.x + 160,
                    y1: me.y + 10,
                    x2: me.x + 160 + 20,
                    y2: me.y + 10 + 20,

                };
            } else {
                r1 = {
                    x1: me.x + this.width - 160 - 20,
                    y1: me.y + 10,
                    x2: me.x + this.width - 160 - 20 + 20,
                    y2: me.y + 10 + 20,

                };

            }
            let r2 = {
                x1: you.x,
                y1: you.y,
                x2: you.x + you.width,
                y2: you.y + you.height,
            };
            if (this.is_collection(r1, r2)) {
                you.is_attack(15,30);
            }
            
        } else if(this.status === 10 && this.frame_current_cnt === 18){
            let me = this, you = this.root.players[1 - this.id];
            let r1;
            if (this.direction > 0) {
                r1 = {
                    x1: me.x + this.width,
                    y1: me.y -130,
                    x2: me.x + this.width+this.width,
                    y2: me.y -130 + this.height+50,

                };
            } else {
                r1 = {
                    x1: me.x + this.width - this.width-this.width ,
                    y1: me.y - 130,
                    x2: me.x + this.width - this.width ,
                    y2: me.y -130 + this.height+50,

                };

            }
            let r2 = {
                x1: you.x,
                y1: you.y,
                x2: you.x + you.width,
                y2: you.y + you.height,
            };
            if (this.is_collection(r1, r2)) {
                you.is_attack(30,40);
            }

        }
   

    }

    update() {
        this.update_control();
        this.update_move();
        this.update_derection();
        this.update_attack();

        this.render();

    }

    render() {
        let status = this.status;
        if (this.status == 1 && this.direction * this.vx < 0) status = 2;
        let obj = this.animations.get(status);
        if (obj && obj.loaded) {
            if (this.direction > 0) {
                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.x, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);
            } else {
                this.ctx.save();
                this.ctx.scale(-1, 1);
                this.ctx.translate(-this.root.game_map.$canvas.width(), 0);

                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.root.game_map.$canvas.width() - this.x - this.width, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);

                this.ctx.restore();

            }


        }
       
        if (status === 4 || status === 5 || status === 6|| status === 8 || status === 7 || status ===9 || status=== 10) {
            if (this.frame_current_cnt === obj.frame_rate * (obj.frame_cnt - 1)) {
                if (status === 6 ) {
                    this.frame_current_cnt--;
                    this.ctx.fillStyle = 'red';
                    this.ctx.font = "170px serif";
                     this.ctx.fillText("K.O", 525, 250);
                } else {
                    this.status = 0;
                }
            }
        }
        this.frame_current_cnt++;


    }
}