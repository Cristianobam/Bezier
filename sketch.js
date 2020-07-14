let leftSlider, rightSlider;

function setup() {
    createCanvas(windowWidth, windowHeight);
    leftSlider = new SliderPoint(windowWidth*2/5, windowHeight/2, 500);
    rightSlider = new SliderPoint(windowWidth*3/5, windowHeight/2, 500);
}

function draw() {
    background(155);
    noFill();

    stroke('purple');
    strokeWeight(15);
    point(windowWidth*1/5, windowHeight/2);
    push();
    leftSlider.draw();
    rightSlider.draw();
    pop();
    point(windowWidth*4/5, windowHeight/2);
    
    //leftSlider.setYPos(leftSlider.centery + leftSlider.height/2);
    //rightSlider.setYPos(leftSlider.centery - leftSlider.height/2);
    //rightSlider.update();
    stroke('red');
    strokeWeight(4);
    beginShape();
        let t = Numerical.linspace(0,1,100);
        bezier = new Bezier([[windowWidth*1/5, windowHeight/2],
                            [leftSlider.x, leftSlider.y],
                            [rightSlider.x, rightSlider.y],
                            [windowWidth*4/5, windowHeight/2]]);

        let pos = t.map(element => bezier.fit(element));
        for (let i in t){
            vertex(pos[i][0], pos[i][1]);
        }
    endShape();

    console.log(Numerical.trapz(t => ((bezier.derivative(t)[0])**2 + (bezier.derivative(t)[1])**2)**.5, 0, 1))
    noLoop()
}


class Numerical {
    static derivative(f, a, h=1e-8) {
        return (f(a+h) - f(a-h)) / (2 * h)
    }

    static simps(f, a, b, N=100) {
        if (N % 2 === 1) {
            console.log('N must be a even number')
            return null
        }
        const dx = (b-a)/N
        const x = Numerical.linspace(0, 1, N);
        const y = x.map(element => f(element));
        let S = 0;
        for (let i = 1; i < y.length / 2; i++) {
            S += y[2 * i - 2] + 4 * y[2 * i - 1] + y[2 * i];
        }
        return S * dx / 3;
    }

    static trapz(f, a, b, N=100) {
        const x = Numerical.linspace(a, b, N+1);
        const y = x.map(element => f(element));
        const dx = (b - a) / N;
        let T = 0;
        for (let i = 1; i <= N; i++){ T += (y[i-1] + y[i]) * dx/2}
        return T
    }

    static linspace(a, b, N) {
        let array = [];
        let step = (b - a) / (N - 1.);
        for (let i = 0; i < N; i++) {
            array.push(a + (i * step));
        }
        return array
    }

    static sum(x) {
        result = 0;
        for (let i in x){ result += x[i] };
        return result
    }

    static factorial(x) { 
        let out = 1
        for (let i = 1; i <= x; i++){ out *= i };
        return out
    }

    static C(n, k) {
        if ( (typeof n !== 'number') || (typeof k !== 'number') ) {
            return null;
        }
        let out = 1;
	    for (let x = n - k + 1; x <= n; x++){ out *= x };
	    for (let x = 1; x <= k; x++){ out /= x };
	    return out;
    }
}

class Bezier {
    constructor(coordinates) {
        this.coordinates = coordinates
    }

    fit(t) {
        let Bx = 0;
        let By = 0;
        const n = this.coordinates.length - 1;
    
        for (let i = 0; i <= n; i++) { 
            Bx += Numerical.C(n,i) * (1 - t)**(n - i) * t**i * this.coordinates[i][0];
        };
    
        for (let i = 0; i <= n; i++) { 
            By += Numerical.C(n,i) * (1 - t)**(n - i) * t**i * this.coordinates[i][1];
        };
        return [Bx, By]
    }
    
    derivative(t) {
        let BxLeft = 0;
        let BxRight = 0;
        let ByLeft = 0;
        let ByRight = 0;

        const n = this.coordinates.length - 1;
    
        for (let i = 0; i <= n - 1; i++) {
            BxLeft += Numerical.C(n,i) * (1 - t)**(n - i) * t**i * this.coordinates[i+1][0];
            BxRight += Numerical.C(n,i) * (1 - t)**(n - i) * t**i * this.coordinates[i][0];
        };
        
        let Bx = (BxLeft - BxRight) * n;

        for (let i = 0; i <= n - 1; i++) { 
            ByLeft += Numerical.C(n,i) * (1 - t)**(n - i) * t**i * this.coordinates[i+1][1];
            ByRight += Numerical.C(n,i) * (1 - t)**(n - i) * t**i * this.coordinates[i][1];
        };

        let By = (ByLeft - ByRight) * n;

        return [Bx, By]
    }
}

class SliderPoint {
    constructor(centerx, centery, height, capsize = 10) {
        this.centerx = centerx;
        this.centery = centery;
        this.x = this.centerx;
        this.y = this.centery;
        this.height =  height;
        this.capsize = capsize;
        this.direction = random([-1, 1]);
    }

    draw() {
        push();
        strokeWeight(3);
        stroke('white')
        line(this.centerx, this.centery+this.height/2, this.centerx, this.centery-this.height/2);
        line(this.centerx-this.capsize, this.centery+this.height/2, this.centerx+this.capsize, this.centery+this.height/2);
        line(this.centerx-this.capsize, this.centery-this.height/2, this.centerx+this.capsize, this.centery-this.height/2);
        pop();
        point(this.centerx, this.y);
    }

    update() {
        this.y += 1 * this.direction;
        if ((this.y >= this.centery + this.height/2) || (this.y <= this.centery - this.height/2)) {
            this.direction *= -1;
        }
    }

    setYPos(y) {
        this.y = y;
    }
}