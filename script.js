const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleArray = [];


let mouse = {
    x: null,
    y: null,
    radius: 100
}

window.addEventListener('mousemove',
    function(e){
        
        mouse.x = e.x + canvas.clientLeft/2;
        mouse.y = e.y + canvas.clientTop/2;
        
    })

function drawImageCustom(){
    let imageWidth = png.width;
    let imageHeight = png.height;
    
    const data = ctx.getImageData(0, 0, imageWidth, imageHeight);
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    class Particle {
        constructor(x, y, color, size){
            this.x = x + canvas.width/2 - png.width * 2,
            this.y = y + canvas.height/2 - png.height * 2,
            this.color = color,
            this.size = 2,
            this.baseX = x + canvas.width/2 - png.width * 2,
            this.baseY = y + canvas.height/2 - png.height * 2,
            this.density = (Math.random() * 10) + 2
        }
        draw(){
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0 , Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        update(){
            ctx.fillStyle = this.color;


            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy)

            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;

            const maxDistance = 100;
            let force = (maxDistance - distance) / maxDistance;
            if(force < 0) force = 0;

            let directionX = (forceDirectionX * force * this.density * 0.6)
            let directionY = (forceDirectionY * force * this.density * 0.6)


            if(distance < mouse.radius + this.size) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if(this.x !== this.baseX){
                    let dx = this.x - this.baseX;
                    this.x -= dx/20;
                } if (this.y !== this.baseY){
                    let dy = this.y - this.baseY;
                    this.y -= dy/20;
                }
            }
            this.draw()


        }
    }
    function init() {
        particleArray = [];
        for(let y = 0, y2 = data.height; y < y2; y++){
            for(let x = 0, x2 = data.width; x < x2; x++){
                if(data.data[(y * 4 * data.width) + (x * 4) + 3] > 128){
                    let positionX = x;
                    let positionY = y;
                    let color = "rgb(" + data.data[(y*4*data.width) + (x * 4)] + "," + 
                                        data.data[(y * 4 * data.width) + (x * 4) + 1] + ',' +
                                        data.data[(y * 4 * data.width) + (x * 4) + 1] + ')';

                    particleArray.push(new Particle(positionX * 4, positionY * 4, color))
                }
            }
        }
    }
    function animate() {
        requestAnimationFrame(animate);
        ctx.fillStyle = 'rgba(0, 0, 0, .05)';
        ctx.fillRect(0, 0, innerWidth, innerHeight);

        for(let i = 0; i < particleArray.length; i++){
            particleArray[i].update()
        }

        
    }
    init()
    animate()

    window.addEventListener('resize',
    function(){
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        init()
    })
}

const png = new Image()

png.src = "data:image/png;base64,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"

window.addEventListener('load', (event) => {
    console.log('page has loaded');
    ctx.drawImage(png, 0 , 0);
    drawImageCustom();
})